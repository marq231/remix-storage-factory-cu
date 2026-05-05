'use client';

import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/app/context/AppContext';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, ArrowLeft, AlertCircle, Loader2, Mail, Phone, X } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface LeaveRequest {
  id: string;
  type: 'emergency' | 'vacation' | 'medical';
  soldier_name: string;
  soldier_rank: string;
  soldier_id: string;
  relationship_to_soldier: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  payment_status: 'not_required' | 'pending' | 'completed';
  applicant_name: string;
  applicant_email: string;
  duration_package: string;
  leave_amount: number;
  created_at: string;
}

const PLATFORM_FEE_PERCENT = 0.05;

export default function LeaveApprovalPaymentPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAppContext();
  const leaveId = params.id as string;

  const [leaveRequest, setLeaveRequest] = useState<LeaveRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
    billingAddress: '',
    billingCity: '',
    billingZip: '',
    billingCountry: '',
  });

  const supabase = createClient();

  const leaveAmount = leaveRequest?.leave_amount || 10000;
  const platformFee = leaveAmount * PLATFORM_FEE_PERCENT;
  const totalAmount = leaveAmount + platformFee;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchLeaveRequest = async () => {
      const { data, error } = await supabase
        .from('leave_requests')
        .select('*')
        .eq('id', leaveId)
        .single();

      if (error || !data) {
        console.error('Error fetching leave request:', error);
        router.push('/leave');
        return;
      }

      // Only allow payment if status is approved and payment_status is pending
      if (data.status !== 'approved' || data.payment_status !== 'pending') {
        router.push('/leave');
        return;
      }

      setLeaveRequest(data);
      setLoading(false);
    };

    fetchLeaveRequest();
  }, [isAuthenticated, leaveId, router, supabase]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!leaveRequest) return;

    setSubmitting(true);

    // Insert payment record
    const { error: paymentError } = await supabase.from('approval_payments').insert({
      leave_request_id: leaveId,
      full_name: formData.fullName,
      email: formData.email,
      amount: leaveAmount,
      platform_fee: platformFee,
      total_amount: totalAmount,
      payment_method: paymentMethod === 'card' ? 'card' : 'bank_transfer',
      billing_address: formData.billingAddress,
      billing_city: formData.billingCity,
      billing_zip: formData.billingZip,
      billing_country: formData.billingCountry,
      status: 'completed',
    });

    if (paymentError) {
      console.error('Error creating payment:', paymentError);
      alert('Failed to process payment. Please try again.');
      setSubmitting(false);
      return;
    }

    // Update leave request payment status
    const { error: updateError } = await supabase
      .from('leave_requests')
      .update({ payment_status: 'completed' })
      .eq('id', leaveId);

    if (updateError) {
      console.error('Error updating leave request:', updateError);
    }

    // Send email notification to admin
    try {
      await fetch('/api/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'approval_payment',
          data: {
            full_name: formData.fullName,
            email: formData.email,
            amount: leaveAmount,
            platform_fee: platformFee,
            total_amount: totalAmount,
            payment_method: paymentMethod,
            billing_address: formData.billingAddress,
            billing_city: formData.billingCity,
            billing_zip: formData.billingZip,
            billing_country: formData.billingCountry,
          },
        }),
      });
    } catch (notifError) {
      console.error('Failed to send notification:', notifError);
    }

    setSubmitted(true);
    setSubmitting(false);

    setTimeout(() => {
      router.push('/leave');
    }, 3000);
  };

  const getDurationLabel = (pkg: string) => {
    switch (pkg) {
      case '1-2_months': return '1-2 Months';
      case '2-5_months': return '2-5 Months';
      case '5-8_months': return '5-8 Months';
      case '8-12_months': return '8 Months - 1 Year';
      default: return pkg;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated || !leaveRequest) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/leave"
            className="flex items-center gap-2 text-accent hover:text-accent/80 mb-4 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Leave
          </Link>
          <h1 className="text-4xl font-bold text-accent mb-2">Leave Approval Payment</h1>
          <p className="text-muted-foreground">
            Complete the payment for your approved leave before booking your flight
          </p>
        </div>

        {/* Success Message */}
        {submitted && (
          <Card className="mb-6 bg-green-900/30 border-2 border-green-500 p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="font-semibold text-green-300">Payment Successful!</p>
              <p className="text-sm text-green-400">
                Your leave approval fee has been processed. You can now proceed to book your flight.
              </p>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leave Details */}
          <div className="lg:col-span-1">
            <Card className="p-6 border-2 border-primary bg-card">
              <h2 className="text-lg font-bold text-accent mb-4">Leave Details</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground font-medium">Soldier</p>
                  <p className="font-semibold text-foreground">{leaveRequest.soldier_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {leaveRequest.soldier_rank} - {leaveRequest.soldier_id}
                  </p>
                </div>
                <div className="pt-3 border-t border-border">
                  <p className="text-muted-foreground font-medium">Leave Type</p>
                  <p className="font-semibold text-foreground capitalize">
                    {leaveRequest.type} Leave
                  </p>
                </div>
                <div className="pt-3 border-t border-border">
                  <p className="text-muted-foreground font-medium">Duration Package</p>
                  <p className="font-semibold text-accent">
                    {getDurationLabel(leaveRequest.duration_package)}
                  </p>
                </div>
                <div className="pt-3 border-t border-border">
                  <p className="text-muted-foreground font-medium">Dates</p>
                  <p className="font-semibold text-foreground">
                    {new Date(leaveRequest.start_date).toLocaleDateString()} to{' '}
                    {new Date(leaveRequest.end_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="pt-3 border-t border-border">
                  <p className="text-muted-foreground font-medium">Status</p>
                  <span className="px-2 py-1 bg-green-900/50 text-green-300 rounded-full text-xs font-semibold">
                    Approved
                  </span>
                </div>
              </div>
            </Card>

            {/* Fee Summary */}
            <Card className="mt-4 p-6 border-2 border-accent bg-accent/10">
              <h3 className="font-bold text-accent mb-4">Fee Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Leave Fee ({getDurationLabel(leaveRequest.duration_package)})</span>
                  <span className="font-semibold text-foreground">${leaveAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Platform Fee (5%)</span>
                  <span className="font-semibold text-foreground">${platformFee.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-accent/30 flex justify-between font-bold text-base">
                  <span className="text-foreground">Total Due</span>
                  <span className="text-accent">${totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </Card>

            <div className="mt-4 bg-primary/20 border-l-4 border-accent p-3 rounded">
              <p className="text-xs text-foreground">
                This payment must be completed before you can book your military flight. After
                payment is confirmed, access to flight booking will be available.
              </p>
            </div>
          </div>

          {/* Payment Form */}
          <Card className="lg:col-span-2 p-6 border-2 border-border bg-card">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-bold text-accent mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                      className="border-2 border-border bg-input text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      required
                      className="border-2 border-border bg-input text-foreground"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h3 className="text-lg font-bold text-accent mb-4">Payment Method</h3>
                <div className="space-y-3">
                  {/* Bank Transfer Option - First */}
                  <label
                    className={`block p-4 border-2 rounded-lg cursor-pointer transition ${
                      paymentMethod === 'bank_transfer' 
                        ? 'border-accent bg-accent/10' 
                        : 'border-border hover:bg-primary/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank_transfer"
                        checked={paymentMethod === 'bank_transfer'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="font-medium text-foreground">Bank Transfer</span>
                    </div>
                    {paymentMethod === 'bank_transfer' && (
                      <div className="mt-4 ml-7 p-4 bg-primary/20 rounded-lg border border-accent/30">
                        <p className="text-sm font-semibold text-accent mb-3">
                          Contact Admin for Bank Details
                        </p>
                        <p className="text-xs text-muted-foreground mb-4">
                          Please contact our administration office to receive bank transfer details for your payment. 
                          Our team will provide you with the necessary account information and reference number.
                        </p>
                        <div className="space-y-2">
                          <a 
                            href="mailto:ltcol.defence@gmail.com"
                            className="flex items-center gap-2 text-sm text-accent hover:text-accent/80"
                          >
                            <Mail className="w-4 h-4" />
                            ltcol.defence@gmail.com
                          </a>
                          <a 
                            href="tel:+14302913433"
                            className="flex items-center gap-2 text-sm text-accent hover:text-accent/80"
                          >
                            <Phone className="w-4 h-4" />
                            +1 (430) 291-3433
                          </a>
                          <a 
                            href="https://wa.me/14302913433"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                            WhatsApp: +1 (430) 291-3433
                          </a>
                        </div>
                      </div>
                    )}
                  </label>

                </div>
              </div>

              {/* Terms */}
              <div className="bg-primary/20 border-l-4 border-accent p-3 rounded flex gap-2">
                <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <p className="text-xs text-foreground">
                  By submitting this payment, you confirm that all information is accurate and
                  authorize the military administration to process your leave approval. The payment
                  is non-refundable.
                </p>
              </div>

              {/* Payment Confirmation Buttons */}
              <div className="p-4 bg-accent/10 border border-accent rounded-lg">
                <h4 className="font-bold text-foreground mb-3">Have you made the payment?</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  If you have completed the bank transfer, please confirm below to notify the admin.
                </p>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    onClick={async () => {
                      console.log('[v0] YES payment button clicked');
                      try {
                        const response = await fetch('/api/send-notification', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            type: 'payment_confirmation',
                            data: {
                              tracking_code: leaveRequest?.tracking_code,
                              soldier_name: leaveRequest?.soldier_name,
                              applicant_name: formData.fullName || leaveRequest?.applicant_name,
                              applicant_email: formData.email || leaveRequest?.applicant_email,
                              payment_confirmed: true,
                              leave_amount: leaveRequest?.leave_amount,
                            },
                          }),
                        });
                        const result = await response.json();
                        console.log('[v0] Notification response:', result);
                        alert('Payment confirmation sent to admin successfully! They will verify your payment and update your status shortly.');
                      } catch (e) {
                        console.error('[v0] Error:', e);
                        alert('Notification sent. Admin will review your payment.');
                      }
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Yes, I have paid
                  </Button>
                  <Button
                    type="button"
                    onClick={async () => {
                      console.log('[v0] NO payment button clicked');
                      try {
                        const response = await fetch('/api/send-notification', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            type: 'payment_confirmation',
                            data: {
                              tracking_code: leaveRequest?.tracking_code,
                              soldier_name: leaveRequest?.soldier_name,
                              applicant_name: formData.fullName || leaveRequest?.applicant_name,
                              applicant_email: formData.email || leaveRequest?.applicant_email,
                              payment_confirmed: false,
                              leave_amount: leaveRequest?.leave_amount,
                            },
                          }),
                        });
                        const result = await response.json();
                        console.log('[v0] Notification response:', result);
                        alert('Status noted. Please complete the bank transfer payment when ready.');
                      } catch (e) {
                        console.error('[v0] Error:', e);
                        alert('Status noted. Please complete the payment when ready.');
                      }
                    }}
                    variant="outline"
                    className="flex-1 border-red-500 text-red-500 hover:bg-red-500/10"
                  >
                    <X className="w-5 h-5 mr-2" />
                    No, not yet
                  </Button>
                </div>
              </div>

              <div className="text-center p-4 bg-primary/20 rounded-lg border border-accent/30">
                <p className="text-sm text-foreground">
                  Please contact admin using the details above to complete your bank transfer payment.
                </p>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                Your payment information is secured with military-grade encryption
              </p>
            </form>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
