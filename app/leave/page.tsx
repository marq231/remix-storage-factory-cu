'use client';

import React, { useState, useRef } from 'react';
import { useAppContext } from '@/app/context/AppContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/lib/supabase/client';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Search,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  Upload,
  User,
  X,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Duration packages with pricing
const DURATION_PACKAGES = [
  { id: '1-2_months', label: '1-2 Months', price: 10000, description: 'Short-term leave' },
  { id: '2-5_months', label: '2-5 Months', price: 15000, description: 'Medium-term leave' },
  { id: '5-8_months', label: '5-8 Months', price: 30000, description: 'Extended leave' },
  { id: '8-12_months', label: '8-12 Months', price: 50000, description: 'Long-term leave' },
];

// Generate unique 8-digit tracking code
function generateTrackingCode(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

export default function LeavePage() {
  const { isAuthenticated } = useAppContext();
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const [leaveType, setLeaveType] = useState<'emergency' | 'vacation' | 'medical' | null>(null);
  const [durationPackage, setDurationPackage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  // Soldier image state
  const [soldierImage, setSoldierImage] = useState<File | null>(null);
  const [soldierImagePreview, setSoldierImagePreview] = useState<string | null>(null);

  // Tracking section state
  const [trackingCode, setTrackingCode] = useState('');
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [trackingError, setTrackingError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [confirmingPayment, setConfirmingPayment] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    applicantName: '',
    applicantEmail: '',
    applicantPhone: '',
    soldierName: '',
    soldierRank: '',
    soldierID: '',
    relationshipToSoldier: '',
    startDate: '',
    endDate: '',
    reason: '',
  });

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle soldier image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSoldierImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSoldierImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSoldierImage(null);
    setSoldierImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Track leave by code
  const handleTrackLeave = async () => {
    if (!trackingCode || trackingCode.length !== 8) {
      setTrackingError('Please enter a valid 8-digit tracking code');
      return;
    }

    setIsTracking(true);
    setTrackingError(null);
    setTrackingResult(null);

    const { data, error } = await supabase
      .from('leave_requests')
      .select('*')
      .eq('tracking_code', trackingCode)
      .single();

    setIsTracking(false);

    if (error || !data) {
      setTrackingError('No leave request found with this tracking code');
    } else {
      setTrackingResult(data);
    }
  };

  // Confirm payment (Yes/No buttons)
  const handlePaymentConfirmation = async (confirmed: boolean) => {
    if (!trackingResult) return;

    setConfirmingPayment(true);

    const { error } = await supabase
      .from('leave_requests')
      .update({
        payment_confirmed: confirmed,
        payment_confirmed_at: confirmed ? new Date().toISOString() : null,
      })
      .eq('id', trackingResult.id);

    if (!error) {
      // Send notification to admin
      try {
        await fetch('/api/send-notification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'payment_confirmation',
            data: {
              tracking_code: trackingResult.tracking_code,
              soldier_name: trackingResult.soldier_name,
              applicant_name: trackingResult.applicant_name,
              applicant_email: trackingResult.applicant_email,
              payment_confirmed: confirmed,
              leave_amount: trackingResult.leave_amount,
            },
          }),
        });
      } catch (e) {
        console.error('Failed to send notification:', e);
      }

      // Refresh tracking result
      const { data } = await supabase
        .from('leave_requests')
        .select('*')
        .eq('id', trackingResult.id)
        .single();

      if (data) {
        setTrackingResult(data);
      }
    }

    setConfirmingPayment(false);
  };

  // Submit leave request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveType || !durationPackage || !soldierImage) return;

    setSubmitting(true);

    // Upload soldier image
    let soldierImageUrl = null;
    if (soldierImage) {
      const fileExt = soldierImage.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      // For now, we'll convert to base64 and store directly
      const reader = new FileReader();
      soldierImageUrl = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(soldierImage);
      });
    }

    const trackingCodeGenerated = generateTrackingCode();
    const selectedPackage = DURATION_PACKAGES.find((p) => p.id === durationPackage);
    const leaveAmount = selectedPackage?.price || 0;

    const { error } = await supabase.from('leave_requests').insert({
      tracking_code: trackingCodeGenerated,
      type: leaveType,
      duration_package: durationPackage,
      leave_amount: leaveAmount,
      soldier_name: formData.soldierName,
      soldier_rank: formData.soldierRank,
      soldier_id: formData.soldierID,
      soldier_image_url: soldierImageUrl,
      relationship_to_soldier: formData.relationshipToSoldier,
      start_date: formData.startDate,
      end_date: formData.endDate,
      reason: formData.reason,
      applicant_name: formData.applicantName,
      applicant_email: formData.applicantEmail,
      applicant_phone: formData.applicantPhone,
      status: 'pending',
      payment_status: 'not_paid',
    });

    if (error) {
      console.log('[v0] Supabase error details:', JSON.stringify(error, null, 2));
      console.log('[v0] Error code:', error.code);
      console.log('[v0] Error message:', error.message);
      console.log('[v0] Error details:', error.details);
      alert(`Failed to submit leave request: ${error.message}`);
      setSubmitting(false);
    } else {
      // Send email notification to admin AND client
      try {
        await fetch('/api/send-notification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'leave_request',
            data: {
              tracking_code: trackingCodeGenerated,
              type: leaveType,
              duration_package: durationPackage,
              leave_amount: leaveAmount,
              soldier_name: formData.soldierName,
              soldier_rank: formData.soldierRank,
              soldier_id: formData.soldierID,
              relationship_to_soldier: formData.relationshipToSoldier,
              start_date: formData.startDate,
              end_date: formData.endDate,
              reason: formData.reason,
              applicant_name: formData.applicantName,
              applicant_email: formData.applicantEmail,
              applicant_phone: formData.applicantPhone,
            },
          }),
        });
      } catch (notifError) {
        console.error('Failed to send notification:', notifError);
      }

      setGeneratedCode(trackingCodeGenerated);
      setSubmitted(true);
      setSubmitting(false);
    }
  };

  // Reset form for new application
  const handleNewApplication = () => {
    setCurrentStep(1);
    setLeaveType(null);
    setDurationPackage(null);
    setSubmitted(false);
    setGeneratedCode(null);
    setSoldierImage(null);
    setSoldierImagePreview(null);
    setFormData({
      applicantName: '',
      applicantEmail: '',
      applicantPhone: '',
      soldierName: '',
      soldierRank: '',
      soldierID: '',
      relationshipToSoldier: '',
      startDate: '',
      endDate: '',
      reason: '',
    });
  };

  const getLeaveTypeLabel = (type: string) => {
    switch (type) {
      case 'emergency':
        return 'Emergency Leave';
      case 'vacation':
        return 'Vacation Leave';
      case 'medical':
        return 'Medical Leave';
      default:
        return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-semibold flex items-center gap-1">
            <Clock className="w-4 h-4" /> Pending Review
          </span>
        );
      case 'approved':
        return (
          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold flex items-center gap-1">
            <CheckCircle className="w-4 h-4" /> Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-semibold flex items-center gap-1">
            <AlertCircle className="w-4 h-4" /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'not_paid':
        return (
          <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-semibold">
            Not Paid
          </span>
        );
      case 'pending':
        return (
          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-semibold">
            Payment Pending
          </span>
        );
      case 'completed':
        return (
          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
            Payment Completed
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-semibold">
            Not Paid
          </span>
        );
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-accent hover:text-accent/80 mb-6 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-accent mb-2">Leave Request</h1>
          <p className="text-muted-foreground">
            Apply for military leave or track your existing application
          </p>
        </div>

        {/* TRACK YOUR LEAVE SECTION - Prominent */}
        <Card className="mb-8 p-6 bg-accent/10 border-2 border-accent">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-3">
              <Search className="w-8 h-8 text-accent" />
              <div>
                <h2 className="text-xl font-bold text-foreground">Track Your Leave</h2>
                <p className="text-sm text-muted-foreground">
                  Enter your 8-digit tracking code to check status
                </p>
              </div>
            </div>
            <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Input
                type="text"
                placeholder="Enter 8-digit code"
                value={trackingCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 8);
                  setTrackingCode(value);
                  setTrackingError(null);
                }}
                className="text-lg font-mono tracking-widest text-center bg-input border-2 border-border"
                maxLength={8}
              />
              <Button
                onClick={handleTrackLeave}
                disabled={isTracking || trackingCode.length !== 8}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {isTracking ? 'Searching...' : 'Track'}
              </Button>
            </div>
          </div>

          {/* Tracking Error */}
          {trackingError && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {trackingError}
            </div>
          )}

          {/* Tracking Result */}
          {trackingResult && (
            <div className="mt-4 p-4 bg-card border border-border rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Tracking Code</p>
                  <p className="text-2xl font-mono font-bold text-accent">
                    {trackingResult.tracking_code}
                  </p>
                </div>
                {getStatusBadge(trackingResult.status)}
              </div>

              {/* Soldier Image */}
              {trackingResult.soldier_image_url && (
                <div className="mb-4 flex justify-center">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-accent">
                    <Image
                      src={trackingResult.soldier_image_url}
                      alt="Soldier"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Leave Type</p>
                  <p className="font-semibold text-foreground">{getLeaveTypeLabel(trackingResult.type)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Soldier Name</p>
                  <p className="font-semibold text-foreground">{trackingResult.soldier_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-semibold text-foreground">
                    {trackingResult.start_date} to {trackingResult.end_date}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Leave Amount</p>
                  <p className="font-semibold text-accent">
                    ${trackingResult.leave_amount?.toLocaleString() || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Payment Status</p>
                  {getPaymentStatusBadge(trackingResult.payment_status)}
                </div>
                <div>
                  <p className="text-muted-foreground">Submitted</p>
                  <p className="font-semibold text-foreground">
                    {new Date(trackingResult.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Payment Confirmation Section */}
              {trackingResult.status === 'approved' && trackingResult.payment_status === 'pending' && (
                <div className="mt-6 p-4 bg-accent/10 border border-accent rounded-lg">
                  <h4 className="font-bold text-foreground mb-3">Have you made the payment?</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    If you have completed the payment via bank transfer, please confirm below. 
                    This will notify the admin to verify your payment.
                  </p>
                  <div className="flex gap-4">
                    <Button
                      onClick={() => handlePaymentConfirmation(true)}
                      disabled={confirmingPayment}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Yes, I have paid
                    </Button>
                    <Button
                      onClick={() => handlePaymentConfirmation(false)}
                      disabled={confirmingPayment}
                      variant="outline"
                      className="flex-1 border-red-500 text-red-500 hover:bg-red-500/10"
                    >
                      <X className="w-5 h-5 mr-2" />
                      No, not yet
                    </Button>
                  </div>
                  {trackingResult.payment_confirmed && (
                    <p className="mt-3 text-sm text-green-500 font-semibold">
                      Payment confirmation submitted. Admin has been notified.
                    </p>
                  )}
                </div>
              )}

              {trackingResult.status === 'approved' &&
                trackingResult.payment_status === 'pending' && (
                  <Button
                    className="mt-4 w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                    onClick={() =>
                      router.push(`/leave-approval-payment/${trackingResult.id}`)
                    }
                  >
                    Proceed to Payment Details
                  </Button>
                )}

              {trackingResult.status === 'approved' &&
                trackingResult.payment_status === 'completed' && (
                  <Button
                    className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => router.push('/payments')}
                  >
                    Book Flight Ticket
                  </Button>
                )}
            </div>
          )}
        </Card>

        {/* SUCCESS MESSAGE */}
        {submitted && generatedCode && (
          <Card className="mb-8 p-8 bg-green-500/10 border-2 border-green-500">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-500 mb-2">
                Leave Request Submitted Successfully!
              </h2>
              <p className="text-muted-foreground mb-6">
                Your application has been submitted for review. Save your tracking code below.
                A confirmation email has been sent to your email address.
              </p>
              <div className="bg-card p-6 rounded-lg border border-border inline-block">
                <p className="text-sm text-muted-foreground mb-2">Your Tracking Code</p>
                <p className="text-4xl font-mono font-bold text-accent tracking-widest">
                  {generatedCode}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Use this code to track your leave status
                </p>
              </div>
              <div className="mt-6">
                <Button
                  onClick={handleNewApplication}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Submit Another Application
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* LEAVE APPLICATION FORM */}
        {!submitted && (
          <Card className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-8 h-8 text-accent" />
              <div>
                <h2 className="text-2xl font-bold text-foreground">New Leave Application</h2>
                <p className="text-sm text-muted-foreground">
                  Complete all steps to submit your request
                </p>
              </div>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center justify-between mb-8 px-4">
              {[1, 2, 3, 4, 5].map((step) => (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                        currentStep >= step
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {step}
                    </div>
                    <span className="text-xs mt-1 text-muted-foreground hidden sm:block">
                      {step === 1 && 'Leave Type'}
                      {step === 2 && 'Duration'}
                      {step === 3 && 'Applicant'}
                      {step === 4 && 'Soldier'}
                      {step === 5 && 'Details'}
                    </span>
                  </div>
                  {step < 5 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        currentStep > step ? 'bg-accent' : 'bg-muted'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {/* STEP 1: Leave Type */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    Step 1: Select Leave Type
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        type: 'emergency',
                        label: 'Emergency Leave',
                        desc: 'For urgent family matters',
                        color: 'border-red-500 bg-red-500/10',
                      },
                      {
                        type: 'vacation',
                        label: 'Vacation Leave',
                        desc: 'For personal time off',
                        color: 'border-blue-500 bg-blue-500/10',
                      },
                      {
                        type: 'medical',
                        label: 'Medical Leave',
                        desc: 'For health-related needs',
                        color: 'border-green-500 bg-green-500/10',
                      },
                    ].map((item) => (
                      <div
                        key={item.type}
                        onClick={() => setLeaveType(item.type as any)}
                        className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                          leaveType === item.type
                            ? `${item.color} border-opacity-100`
                            : 'border-border hover:border-accent/50'
                        }`}
                      >
                        <h4 className="font-bold text-lg mb-1 text-foreground">{item.label}</h4>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end mt-6">
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      disabled={!leaveType}
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      Next Step <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 2: Duration Package */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    Step 2: Select Leave Duration Package
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {DURATION_PACKAGES.map((pkg) => (
                      <div
                        key={pkg.id}
                        onClick={() => setDurationPackage(pkg.id)}
                        className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                          durationPackage === pkg.id
                            ? 'border-accent bg-accent/10'
                            : 'border-border hover:border-accent/50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-lg text-foreground">{pkg.label}</h4>
                            <p className="text-sm text-muted-foreground">{pkg.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-accent">
                              ${pkg.price.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">+ 5% platform fee</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-6">
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      variant="outline"
                      className="border-border"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      disabled={!durationPackage}
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      Next Step <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 3: Applicant Information */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    Step 3: Applicant Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="applicantName" className="text-foreground">
                        Full Name *
                      </Label>
                      <Input
                        id="applicantName"
                        name="applicantName"
                        value={formData.applicantName}
                        onChange={handleInputChange}
                        required
                        className="bg-input border-border"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="applicantEmail" className="text-foreground">
                        Email Address *
                      </Label>
                      <Input
                        id="applicantEmail"
                        name="applicantEmail"
                        type="email"
                        value={formData.applicantEmail}
                        onChange={handleInputChange}
                        required
                        className="bg-input border-border"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="applicantPhone" className="text-foreground">
                        Phone Number *
                      </Label>
                      <Input
                        id="applicantPhone"
                        name="applicantPhone"
                        type="tel"
                        value={formData.applicantPhone}
                        onChange={handleInputChange}
                        required
                        className="bg-input border-border"
                        placeholder="+1 (000) 000-0000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="relationshipToSoldier" className="text-foreground">
                        Relationship to Soldier *
                      </Label>
                      <Input
                        id="relationshipToSoldier"
                        name="relationshipToSoldier"
                        value={formData.relationshipToSoldier}
                        onChange={handleInputChange}
                        required
                        className="bg-input border-border"
                        placeholder="e.g., Spouse, Parent, Sibling"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between mt-6">
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      variant="outline"
                      className="border-border"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      disabled={
                        !formData.applicantName ||
                        !formData.applicantEmail ||
                        !formData.applicantPhone ||
                        !formData.relationshipToSoldier
                      }
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      Next Step <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 4: Soldier Information */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    Step 4: Soldier Information
                  </h3>

                  {/* Soldier Image Upload */}
                  <div className="mb-6">
                    <Label className="text-foreground mb-2 block">
                      Soldier&apos;s Picture *
                    </Label>
                    <div className="flex flex-col items-center gap-4">
                      {soldierImagePreview ? (
                        <div className="relative">
                          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-accent">
                            <Image
                              src={soldierImagePreview}
                              alt="Soldier preview"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="w-32 h-32 rounded-full border-4 border-dashed border-accent/50 flex flex-col items-center justify-center cursor-pointer hover:border-accent transition-colors bg-muted/50"
                        >
                          <User className="w-8 h-8 text-muted-foreground mb-1" />
                          <span className="text-xs text-muted-foreground">Upload Photo</span>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      {!soldierImagePreview && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="border-accent text-accent hover:bg-accent/10"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Select Soldier Image
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="soldierName" className="text-foreground">
                        Soldier&apos;s Full Name *
                      </Label>
                      <Input
                        id="soldierName"
                        name="soldierName"
                        value={formData.soldierName}
                        onChange={handleInputChange}
                        required
                        className="bg-input border-border"
                        placeholder="Soldier's full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="soldierRank" className="text-foreground">
                        Soldier&apos;s Rank *
                      </Label>
                      <Input
                        id="soldierRank"
                        name="soldierRank"
                        value={formData.soldierRank}
                        onChange={handleInputChange}
                        required
                        className="bg-input border-border"
                        placeholder="e.g., Sergeant, Captain"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="soldierID" className="text-foreground">
                        Soldier&apos;s Military ID *
                      </Label>
                      <Input
                        id="soldierID"
                        name="soldierID"
                        value={formData.soldierID}
                        onChange={handleInputChange}
                        required
                        className="bg-input border-border"
                        placeholder="Military ID number"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between mt-6">
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      variant="outline"
                      className="border-border"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(5)}
                      disabled={
                        !formData.soldierName ||
                        !formData.soldierRank ||
                        !formData.soldierID ||
                        !soldierImage
                      }
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      Next Step <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 5: Leave Details */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    Step 5: Leave Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate" className="text-foreground">
                        Start Date *
                      </Label>
                      <Input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        required
                        className="bg-input border-border"
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate" className="text-foreground">
                        End Date *
                      </Label>
                      <Input
                        id="endDate"
                        name="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        required
                        className="bg-input border-border"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="reason" className="text-foreground">
                        Reason for Leave *
                      </Label>
                      <Textarea
                        id="reason"
                        name="reason"
                        value={formData.reason}
                        onChange={handleInputChange}
                        required
                        className="bg-input border-border min-h-[120px]"
                        placeholder="Please provide detailed reason for the leave request..."
                      />
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-muted/50 p-4 rounded-lg border border-border">
                    <h4 className="font-bold text-foreground mb-3">Application Summary</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p className="text-muted-foreground">Leave Type:</p>
                      <p className="font-semibold text-foreground">{getLeaveTypeLabel(leaveType || '')}</p>
                      <p className="text-muted-foreground">Duration Package:</p>
                      <p className="font-semibold text-foreground">
                        {DURATION_PACKAGES.find((p) => p.id === durationPackage)?.label}
                      </p>
                      <p className="text-muted-foreground">Leave Amount:</p>
                      <p className="font-semibold text-accent">
                        ${DURATION_PACKAGES.find((p) => p.id === durationPackage)?.price.toLocaleString()}
                      </p>
                      <p className="text-muted-foreground">Platform Fee (5%):</p>
                      <p className="font-semibold text-foreground">
                        ${((DURATION_PACKAGES.find((p) => p.id === durationPackage)?.price || 0) * 0.05).toLocaleString()}
                      </p>
                      <p className="text-muted-foreground font-bold">Total:</p>
                      <p className="font-bold text-accent">
                        ${((DURATION_PACKAGES.find((p) => p.id === durationPackage)?.price || 0) * 1.05).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between mt-6">
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      variant="outline"
                      className="border-border"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting || !formData.startDate || !formData.endDate || !formData.reason}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {submitting ? 'Submitting...' : 'Submit Leave Request'}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}
