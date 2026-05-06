'use client';

import React, { useState, useRef } from 'react';
import { useAppContext } from '@/app/context/AppContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle, ArrowLeft, Loader2, Plane, Mail, Phone, Search, Upload, User, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

interface LeaveRequest {
  id: string;
  tracking_code: string;
  soldier_name: string;
  soldier_rank: string;
  soldier_image_url: string;
  start_date: string;
  end_date: string;
  status: string;
  payment_status: string;
  applicant_email: string;
  applicant_name: string;
  type: string;
  leave_amount: number;
}

// Aircraft class pricing
const FLIGHT_CLASSES = [
  { id: 'economy', name: 'Economy Class', price: 4021, description: 'Standard seating with basic amenities' },
  { id: 'flexi_economy', name: 'Flexi Economy', price: 7047, description: 'Flexible booking with extra legroom' },
  { id: 'business', name: 'Business Class', price: 12000, description: 'Premium seating with priority boarding' },
  { id: 'first_class', name: 'First Class', price: 15000, description: 'Luxury seating with full amenities' },
  { id: 'private_jet', name: 'Private Jet Charter', price: 86000, description: 'Exclusive private aircraft charter' },
];

const PLATFORM_FEE_PERCENT = 0.05;

export default function PaymentsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppContext();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tracking code verification state
  const [trackingCode, setTrackingCode] = useState('');
  const [verifiedLeave, setVerifiedLeave] = useState<LeaveRequest | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // Booking form state
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedFlightClass, setSelectedFlightClass] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmingPayment, setConfirmingPayment] = useState(false);

  // Soldier image state
  const [soldierImage, setSoldierImage] = useState<File | null>(null);
  const [soldierImagePreview, setSoldierImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
    city: '',
    country: '',
    zipCode: '',
    departureLocation: '',
    arrivalLocation: '',
    departureDate: '',
    fullName: '',
    email: '',
  });

  const selectedClassData = FLIGHT_CLASSES.find((c) => c.id === selectedFlightClass);
  const flightAmount = selectedClassData?.price || 0;
  const platformFee = flightAmount * PLATFORM_FEE_PERCENT;
  const totalAmount = flightAmount + platformFee;

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

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

  // Verify tracking code
  const handleVerifyCode = async () => {
    if (!trackingCode || trackingCode.length !== 8) {
      setVerificationError('Please enter a valid 8-digit tracking code');
      return;
    }

    setVerifying(true);
    setVerificationError(null);
    setVerifiedLeave(null);

    const { data, error } = await supabase
      .from('leave_requests')
      .select('*')
      .eq('tracking_code', trackingCode)
      .single();

    setVerifying(false);

    if (error || !data) {
      setVerificationError('No leave request found with this tracking code');
      return;
    }

    // Check if leave is approved
    if (data.status !== 'approved') {
      setVerificationError(`Your leave is currently "${data.status}". Only approved leaves can book flights.`);
      return;
    }

    // Check if leave approval payment is completed
    if (data.payment_status !== 'completed') {
      setVerificationError('You must complete the leave approval payment before booking a flight. Please go to Leave Approval Payment first.');
      return;
    }

    setVerifiedLeave(data);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Confirm payment (Yes/No buttons)
  const handlePaymentConfirmation = async (confirmed: boolean) => {
    console.log('[v0] Flight payment confirmation clicked:', confirmed ? 'YES' : 'NO');
    if (!verifiedLeave) {
      console.log('[v0] No verified leave found');
      return;
    }

    setConfirmingPayment(true);

    // Send notification to admin about flight payment confirmation
    try {
      console.log('[v0] Sending flight payment notification...');
      const response = await fetch('/api/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'flight_payment_confirmation',
          data: {
            tracking_code: verifiedLeave.tracking_code,
            soldier_name: verifiedLeave.soldier_name,
            applicant_name: verifiedLeave.applicant_name,
            applicant_email: verifiedLeave.applicant_email,
            payment_confirmed: confirmed,
            flight_class: selectedClassData?.name,
            total_amount: totalAmount,
          },
        }),
      });
      const result = await response.json();
      console.log('[v0] Notification response:', result);
    } catch (e) {
      console.error('[v0] Failed to send notification:', e);
    }

    setConfirmingPayment(false);
    
    if (confirmed) {
      alert('Payment confirmation sent to admin successfully! They will verify your payment shortly.');
    } else {
      alert('Status noted. Please complete the bank transfer payment when ready.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!verifiedLeave || !selectedFlightClass || !soldierImage) {
      alert('Please complete all required fields including soldier picture');
      return;
    }

    setSubmitting(true);

    // Convert soldier image to base64
    let soldierImageUrl = null;
    if (soldierImage) {
      const reader = new FileReader();
      soldierImageUrl = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(soldierImage);
      });
    }

    const { error } = await supabase.from('flight_payments').insert({
      leave_request_id: verifiedLeave.id,
      full_name: formData.fullName || verifiedLeave.soldier_name,
      email: formData.email || verifiedLeave.applicant_email,
      flight_amount: flightAmount,
      platform_fee: platformFee,
      total_amount: totalAmount,
      payment_method: paymentMethod === 'card' ? 'card' : 'bank_transfer',
      flight_class: selectedFlightClass,
      departure_location: formData.departureLocation,
      arrival_location: formData.arrivalLocation,
      departure_date: formData.departureDate || null,
      billing_address: formData.billingAddress,
      billing_city: formData.city,
      billing_zip: formData.zipCode,
      billing_country: formData.country,
      soldier_image_url: soldierImageUrl,
      status: 'pending',
    });

    if (error) {
      console.error('Error creating payment:', error);
      alert('Failed to process booking. Please try again.');
      setSubmitting(false);
      return;
    }

    // Send email notification to admin and client
    try {
      await fetch('/api/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'flight_booking',
          data: {
            tracking_code: verifiedLeave.tracking_code,
            full_name: formData.fullName || verifiedLeave.soldier_name,
            email: formData.email || verifiedLeave.applicant_email,
            flight_amount: flightAmount,
            platform_fee: platformFee,
            total_amount: totalAmount,
            flight_class: selectedClassData?.name,
            payment_method: paymentMethod,
            departure_location: formData.departureLocation,
            arrival_location: formData.arrivalLocation,
            departure_date: formData.departureDate,
          },
        }),
      });
    } catch (notifError) {
      console.error('Failed to send notification:', notifError);
    }

    setSubmitted(true);
    setFormData({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      billingAddress: '',
      city: '',
      country: '',
      zipCode: '',
      departureLocation: '',
      arrivalLocation: '',
      departureDate: '',
      fullName: '',
      email: '',
    });
    setSoldierImage(null);
    setSoldierImagePreview(null);
    setSelectedFlightClass('');
    setSubmitting(false);
  };

  const resetForm = () => {
    setSubmitted(false);
    setShowPaymentForm(false);
    setVerifiedLeave(null);
    setTrackingCode('');
    setSelectedFlightClass('');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-accent hover:text-accent/80 mb-4 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-accent mb-2">
            <Plane className="inline-block w-10 h-10 mr-3" />
            Book Flight Ticket
          </h1>
          <p className="text-muted-foreground">
            Enter your leave tracking code to book your military flight
          </p>
        </div>

        {/* Success Message */}
        {submitted && (
          <Card className="mb-6 bg-green-900/30 border-2 border-green-500 p-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-300 mb-2">Flight Booking Submitted!</h2>
              <p className="text-green-400 mb-4">
                Your flight booking request has been submitted. You will receive a confirmation email shortly.
              </p>
              <Button onClick={resetForm} className="bg-accent text-accent-foreground hover:bg-accent/90">
                Book Another Flight
              </Button>
            </div>
          </Card>
        )}

        {!submitted && (
          <>
            {/* ENTER TRACKING CODE SECTION - Prominent */}
            <Card className="mb-8 p-6 bg-accent/10 border-4 border-accent">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex items-center gap-3">
                  <Search className="w-10 h-10 text-accent" />
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Enter Your Leave Code</h2>
                    <p className="text-sm text-muted-foreground">
                      Input your 8-digit tracking code to access flight booking
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
                      setVerificationError(null);
                    }}
                    className="text-xl font-mono tracking-widest text-center bg-input border-2 border-border h-14"
                    maxLength={8}
                  />
                  <Button
                    onClick={handleVerifyCode}
                    disabled={verifying || trackingCode.length !== 8}
                    className="bg-accent text-accent-foreground hover:bg-accent/90 h-14 px-8"
                  >
                    {verifying ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Code'}
                  </Button>
                </div>
              </div>

              {/* Verification Error */}
              {verificationError && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-400">{verificationError}</p>
                </div>
              )}

              {/* Verified Leave Details */}
              {verifiedLeave && (
                <div className="mt-4 p-4 bg-green-500/10 border-2 border-green-500 rounded-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <h3 className="text-lg font-bold text-green-500">Leave Verified - Ready to Book Flight</h3>
                  </div>

                  {/* Soldier Image */}
                  {verifiedLeave.soldier_image_url && (
                    <div className="flex justify-center mb-4">
                      <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-green-500">
                        <Image
                          src={verifiedLeave.soldier_image_url}
                          alt="Soldier"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Tracking Code</p>
                      <p className="font-bold text-accent font-mono">{verifiedLeave.tracking_code}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Soldier</p>
                      <p className="font-semibold text-foreground">{verifiedLeave.soldier_name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Leave Status</p>
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-semibold">
                        Approved
                      </span>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Payment Status</p>
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-semibold">
                        Completed
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Show rest of form only if leave is verified */}
            {verifiedLeave && (
              <>
                {/* Aircraft Class Selection */}
                <Card className="mb-6 p-6 border-2 border-border bg-card">
                  <h2 className="text-xl font-bold text-accent mb-4">Select Aircraft Class</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {FLIGHT_CLASSES.map((flightClass) => (
                      <label
                        key={flightClass.id}
                        className={`block p-4 border-2 rounded-lg cursor-pointer transition ${
                          selectedFlightClass === flightClass.id
                            ? 'border-accent bg-accent/10'
                            : 'border-border hover:bg-primary/10'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="flightClass"
                            value={flightClass.id}
                            checked={selectedFlightClass === flightClass.id}
                            onChange={(e) => setSelectedFlightClass(e.target.value)}
                            className="w-4 h-4 mt-1"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">{flightClass.name}</p>
                            <p className="text-xs text-muted-foreground mb-2">{flightClass.description}</p>
                            <p className="text-lg font-bold text-accent">${flightClass.price.toLocaleString()}</p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </Card>

                {/* Price Summary */}
                {selectedFlightClass && (
                  <Card className="mb-6 p-6 border-2 border-accent bg-accent/10">
                    <h3 className="font-bold text-accent mb-4">Price Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{selectedClassData?.name}</span>
                        <span className="font-semibold text-foreground">${flightAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Platform Fee (5%)</span>
                        <span className="font-semibold text-foreground">${platformFee.toLocaleString()}</span>
                      </div>
                      <div className="pt-2 border-t border-accent/30 flex justify-between font-bold text-lg">
                        <span className="text-foreground">Total</span>
                        <span className="text-accent">${totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Continue to Booking Button */}
                {selectedFlightClass && !showPaymentForm && (
                  <div className="mb-6">
                    <Button
                      onClick={() => setShowPaymentForm(true)}
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-6 text-lg"
                    >
                      Continue to Flight Booking
                    </Button>
                  </div>
                )}

                {/* Booking Form */}
                {showPaymentForm && (
                  <Card className="p-6 border-2 border-border bg-card">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Soldier Image Upload */}
                      <div>
                        <h3 className="text-lg font-bold text-accent mb-4">Soldier Picture *</h3>
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

                      {/* Personal Information */}
                      <div>
                        <h3 className="text-lg font-bold text-accent mb-4">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-foreground">Full Name *</Label>
                            <Input
                              type="text"
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleInputChange}
                              placeholder="Enter your full name"
                              required
                              className="border-2 border-border bg-input"
                            />
                          </div>
                          <div>
                            <Label className="text-foreground">Email Address *</Label>
                            <Input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="your.email@example.com"
                              required
                              className="border-2 border-border bg-input"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Flight Details */}
                      <div>
                        <h3 className="text-lg font-bold text-accent mb-4">Flight Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-foreground">Departure Location *</Label>
                            <Input
                              type="text"
                              name="departureLocation"
                              value={formData.departureLocation}
                              onChange={handleInputChange}
                              placeholder="e.g., Baghdad, Iraq"
                              required
                              className="border-2 border-border bg-input"
                            />
                          </div>
                          <div>
                            <Label className="text-foreground">Arrival Location *</Label>
                            <Input
                              type="text"
                              name="arrivalLocation"
                              value={formData.arrivalLocation}
                              onChange={handleInputChange}
                              placeholder="e.g., Dallas, TX"
                              required
                              className="border-2 border-border bg-input"
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <Label className="text-foreground">Departure Date *</Label>
                          <Input
                            type="date"
                            name="departureDate"
                            value={formData.departureDate}
                            onChange={handleInputChange}
                            required
                            className="border-2 border-border bg-input"
                          />
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
                            <div className="flex items-start gap-3">
                              <input
                                type="radio"
                                name="paymentMethod"
                                value="bank_transfer"
                                checked={paymentMethod === 'bank_transfer'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-4 h-4 mt-1"
                              />
                              <div className="flex-1">
                                <p className="font-semibold text-foreground">Bank Transfer</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Contact admin for bank details for transfer
                                </p>
                                <div className="mt-3 p-3 bg-muted/50 rounded-lg border border-border">
                                  <p className="text-sm font-semibold text-accent mb-2">Contact Admin:</p>
                                  <div className="space-y-1 text-sm">
                                    <p className="flex items-center gap-2 text-foreground">
                                      <Mail className="w-4 h-4 text-accent" />
                                      Ltcol.defence@gmail.com
                                    </p>
                                    <p className="flex items-center gap-2 text-foreground">
                                      <Phone className="w-4 h-4 text-accent" />
                                      Contact via WhatsApp or Email
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </label>

                        </div>

                        {/* Payment Confirmation for Bank Transfer */}
                        {paymentMethod === 'bank_transfer' && (
                          <div className="mt-4 p-4 bg-accent/10 border border-accent rounded-lg">
                            <h4 className="font-bold text-foreground mb-3">Have you made the payment?</h4>
                            <p className="text-sm text-muted-foreground mb-4">
                              If you have completed the bank transfer, please confirm below to notify the admin.
                            </p>
                            <div className="flex gap-4">
                              <Button
                                type="button"
                                onClick={() => handlePaymentConfirmation(true)}
                                disabled={confirmingPayment}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                              >
                                <CheckCircle className="w-5 h-5 mr-2" />
                                Yes, I have paid
                              </Button>
                              <Button
                                type="button"
                                onClick={() => handlePaymentConfirmation(false)}
                                disabled={confirmingPayment}
                                variant="outline"
                                className="flex-1 border-red-500 text-red-500 hover:bg-red-500/10"
                              >
                                <X className="w-5 h-5 mr-2" />
                                No, not yet
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Submit Button */}
                      <div className="flex gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowPaymentForm(false)}
                          className="flex-1 border-border"
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          disabled={submitting || !soldierImage}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            'Submit Flight Booking'
                          )}
                        </Button>
                      </div>
                    </form>
                  </Card>
                )}
              </>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
