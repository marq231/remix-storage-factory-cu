'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { useAppContext } from '@/app/context/AppContext';
import { translate, getLanguageName } from '@/lib/translations';
import {
  Search,
  Hash,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Calendar,
  User,
  DollarSign,
  Plane,
  ArrowLeft,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Footer from '@/components/Footer';

interface LeaveRequest {
  id: string;
  tracking_code: string;
  type: string;
  duration_package: string;
  leave_amount: number;
  soldier_name: string;
  soldier_rank: string;
  soldier_id: string;
  relationship_to_soldier: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  payment_status: string;
  payment_confirmed: boolean;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
  created_at: string;
}

const DURATION_LABELS: Record<string, string> = {
  '1-2_months': '1-2 Months',
  '2-5_months': '2-5 Months',
  '5-8_months': '5-8 Months',
  '8-12_months': '8-12 Months',
};

const LANGUAGES = [
  { code: 'en', name: 'English', flag: 'EN' },
  { code: 'es', name: 'Español', flag: 'ES' },
  { code: 'fr', name: 'Français', flag: 'FR' },
  { code: 'de', name: 'Deutsch', flag: 'DE' },
  { code: 'it', name: 'Italiano', flag: 'IT' },
  { code: 'pt', name: 'Português', flag: 'PT' },
  { code: 'ru', name: 'Русский', flag: 'RU' },
  { code: 'zh', name: '中文', flag: 'ZH' },
  { code: 'ar', name: 'العربية', flag: 'AR' },
  { code: 'ja', name: '日本語', flag: 'JA' },
];

export default function TrackLeavePage() {
  const { language, setLanguage } = useAppContext();
  const [trackingCode, setTrackingCode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<LeaveRequest | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();

  const handleSearch = async () => {
    if (!trackingCode.trim()) {
      setError('Please enter a tracking code');
      return;
    }

    if (trackingCode.length !== 8 || !/^\d+$/.test(trackingCode)) {
      setError('Tracking code must be 8 digits');
      return;
    }

    setIsSearching(true);
    setError('');
    setNotFound(false);
    setSearchResult(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('leave_requests')
        .select('*')
        .eq('tracking_code', trackingCode)
        .single();

      if (fetchError || !data) {
        setNotFound(true);
      } else {
        setSearchResult(data);
      }
    } catch (err) {
      console.error('Error searching:', err);
      setError('An error occurred while searching. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-8 h-8 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-8 h-8 text-red-500" />;
      default:
        return <AlertCircle className="w-8 h-8 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 border-yellow-500 text-yellow-400';
      case 'approved':
        return 'bg-green-500/20 border-green-500 text-green-400';
      case 'rejected':
        return 'bg-red-500/20 border-red-500 text-red-400';
      default:
        return 'bg-gray-500/20 border-gray-500 text-gray-400';
    }
  };

  const getPaymentStatusText = (paymentStatus: string, status: string) => {
    if (status !== 'approved') return null;
    switch (paymentStatus) {
      case 'pending':
        return { text: 'Payment Required', color: 'text-orange-400' };
      case 'completed':
        return { text: 'Payment Completed', color: 'text-green-400' };
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary border-b-4 border-accent sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-accent">
                <Image
                  src="/military-logo.jpg"
                  alt="D4 Battalion Squad Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-accent">D4 Battalion Squad</h1>
                <p className="text-xs text-primary-foreground/80">Military Services Portal</p>
              </div>
            </Link>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-accent/20 border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground font-semibold px-4"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  {LANGUAGES.find((l) => l.code === language)?.name || 'English'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {LANGUAGES.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={language === lang.code ? 'bg-accent/20' : ''}
                  >
                    <span className="font-medium mr-2">{lang.flag}</span>
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Track Leave Card */}
        <Card className="bg-card border-2 border-accent mb-8">
          <CardHeader className="text-center pb-2">
            <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-accent" />
            </div>
            <CardTitle className="text-3xl text-accent">Track Your Leave Request</CardTitle>
            <CardDescription className="text-lg">
              Enter your 8-digit tracking code to check the status of your leave application
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <div className="flex-1 relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-accent" />
                <Input
                  type="text"
                  placeholder="Enter 8-digit code"
                  value={trackingCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 8);
                    setTrackingCode(value);
                    setError('');
                    setNotFound(false);
                  }}
                  className="pl-10 text-center text-2xl font-mono tracking-widest h-14 bg-background border-2 border-accent/50 focus:border-accent"
                  maxLength={8}
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={isSearching || trackingCode.length !== 8}
                className="bg-accent hover:bg-accent/80 text-accent-foreground h-14 px-8 text-lg font-semibold"
              >
                {isSearching ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-accent-foreground" />
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Track
                  </>
                )}
              </Button>
            </div>

            {error && (
              <p className="text-red-400 text-center mt-4">{error}</p>
            )}
          </CardContent>
        </Card>

        {/* Not Found */}
        {notFound && (
          <Card className="bg-red-500/10 border-2 border-red-500/50">
            <CardContent className="py-12 text-center">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-red-400 mb-2">Tracking Code Not Found</h3>
              <p className="text-muted-foreground">
                No leave request found with tracking code: <span className="font-mono font-bold">{trackingCode}</span>
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Please check your code and try again, or contact support if you need assistance.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Search Result */}
        {searchResult && (
          <Card className="bg-card border-2 border-accent">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-accent">Leave Request Found</CardTitle>
                  <CardDescription>
                    Tracking Code: <span className="font-mono font-bold text-accent">{searchResult.tracking_code}</span>
                  </CardDescription>
                </div>
                {getStatusIcon(searchResult.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status Banner */}
              <div className={`p-6 rounded-lg border-2 text-center ${getStatusColor(searchResult.status)}`}>
                <h3 className="text-2xl font-bold uppercase mb-2">{searchResult.status}</h3>
                {searchResult.status === 'pending' && (
                  <p className="text-sm opacity-80">Your leave request is being reviewed by the administration</p>
                )}
                {searchResult.status === 'approved' && (
                  <p className="text-sm opacity-80">Your leave request has been approved!</p>
                )}
                {searchResult.status === 'rejected' && (
                  <p className="text-sm opacity-80">Your leave request has been rejected. Contact support for more information.</p>
                )}

                {/* Payment Status for Approved */}
                {getPaymentStatusText(searchResult.payment_status, searchResult.status) && (
                  <div className="mt-4 pt-4 border-t border-current/20">
                    <p className={`font-semibold ${getPaymentStatusText(searchResult.payment_status, searchResult.status)?.color}`}>
                      {getPaymentStatusText(searchResult.payment_status, searchResult.status)?.text}
                    </p>
                    {searchResult.payment_status === 'pending' && (
                      <Link href={`/leave-approval-payment/${searchResult.id}`}>
                        <Button className="mt-3 bg-accent hover:bg-accent/80 text-accent-foreground">
                          <DollarSign className="w-4 h-4 mr-2" />
                          Pay Now
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {/* Leave Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-background p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Leave Type</p>
                  <p className="font-semibold capitalize">{searchResult.type} Leave</p>
                </div>
                <div className="bg-background p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Duration Package</p>
                  <p className="font-semibold">{DURATION_LABELS[searchResult.duration_package] || 'N/A'}</p>
                </div>
                <div className="bg-background p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Leave Amount</p>
                  <p className="font-semibold text-accent">
                    ${searchResult.leave_amount?.toLocaleString() || '0'}
                  </p>
                </div>
                <div className="bg-background p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Submitted On</p>
                  <p className="font-semibold">{new Date(searchResult.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Soldier Information */}
              <div className="border-t border-border pt-4">
                <h4 className="font-semibold text-accent mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Soldier Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-background p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Soldier Name</p>
                    <p className="font-semibold">{searchResult.soldier_name}</p>
                  </div>
                  <div className="bg-background p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Rank</p>
                    <p className="font-semibold">{searchResult.soldier_rank}</p>
                  </div>
                </div>
              </div>

              {/* Leave Period */}
              <div className="border-t border-border pt-4">
                <h4 className="font-semibold text-accent mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Leave Period
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-background p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Start Date</p>
                    <p className="font-semibold">{new Date(searchResult.start_date).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-background p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">End Date</p>
                    <p className="font-semibold">{new Date(searchResult.end_date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Payment Confirmation - For approved leave with pending payment */}
              {searchResult.status === 'approved' && searchResult.payment_status === 'pending' && (
                <div className="border-t border-border pt-4">
                  <h4 className="font-semibold text-accent mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Payment Required
                  </h4>
                  <p className="text-muted-foreground mb-4">
                    Your leave has been approved. Please complete the payment via bank transfer and confirm below.
                  </p>
                  
                  {/* Bank Transfer Info */}
                  <div className="bg-accent/10 border border-accent p-4 rounded-lg mb-4">
                    <p className="font-semibold text-foreground mb-2">Contact Admin for Bank Details:</p>
                    <p className="text-sm text-muted-foreground">Email: military@d4battalion.us</p>
                    <p className="text-sm text-muted-foreground">Phone: +1 (430) 291-3433</p>
                    <p className="text-sm text-muted-foreground">WhatsApp: +1 (430) 291-3433</p>
                  </div>

                  {/* Payment Confirmation Buttons */}
                  <div className="bg-primary/10 border border-primary p-4 rounded-lg">
                    <h5 className="font-bold text-foreground mb-3">Have you made the payment?</h5>
                    <p className="text-sm text-muted-foreground mb-4">
                      Click below to notify admin about your payment status.
                    </p>
                    <div className="flex gap-4">
                      <Button
                        onClick={async () => {
                          console.log('[v0] YES button clicked - confirming payment');
                          try {
                            // Update database
                            console.log('[v0] Updating database for leave ID:', searchResult.id);
                            const { error, data } = await supabase
                              .from('leave_requests')
                              .update({ 
                                payment_confirmed: true, 
                                payment_confirmed_at: new Date().toISOString() 
                              })
                              .eq('id', searchResult.id)
                              .select();
                            
                            console.log('[v0] Database update result:', { error, data });
                            
                            if (error) {
                              console.error('[v0] Database error:', error);
                              throw error;
                            }
                            
                            // Send notification to admin
                            console.log('[v0] Sending notification to admin...');
                            const notifResponse = await fetch('/api/send-notification', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                type: 'payment_confirmation',
                                data: {
                                  tracking_code: searchResult.tracking_code,
                                  soldier_name: searchResult.soldier_name,
                                  applicant_name: searchResult.applicant_name,
                                  applicant_email: searchResult.applicant_email,
                                  payment_confirmed: true,
                                  leave_amount: searchResult.leave_amount,
                                },
                              }),
                            });
                            
                            const notifResult = await notifResponse.json();
                            console.log('[v0] Notification API response:', notifResult);
                            
                            alert('Payment confirmation sent to admin successfully! They will verify and update your status shortly.');
                            // Refresh the search result
                            setSearchResult({ ...searchResult, payment_confirmed: true });
                          } catch (e) {
                            console.error('[v0] Payment confirmation error:', e);
                            alert('There was an issue, but your confirmation was likely sent. Admin will review.');
                          }
                        }}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Yes, I have paid
                      </Button>
                      <Button
                        onClick={async () => {
                          console.log('[v0] NO button clicked - payment not made');
                          try {
                            const notifResponse = await fetch('/api/send-notification', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                type: 'payment_confirmation',
                                data: {
                                  tracking_code: searchResult.tracking_code,
                                  soldier_name: searchResult.soldier_name,
                                  applicant_name: searchResult.applicant_name,
                                  applicant_email: searchResult.applicant_email,
                                  payment_confirmed: false,
                                  leave_amount: searchResult.leave_amount,
                                },
                              }),
                            });
                            
                            const notifResult = await notifResponse.json();
                            console.log('[v0] Notification API response:', notifResult);
                            
                            alert('Status noted. Please complete the payment via bank transfer when ready.');
                          } catch (e) {
                            console.error('[v0] Error:', e);
                            alert('Status noted. Please complete the payment when ready.');
                          }
                        }}
                        variant="outline"
                        className="flex-1 border-red-500 text-red-500 hover:bg-red-500/10"
                      >
                        <XCircle className="w-5 h-5 mr-2" />
                        No, not yet
                      </Button>
                    </div>
                  </div>

                  {/* Also show Pay Now link */}
                  <div className="mt-4 text-center">
                    <Link href={`/leave-approval-payment/${searchResult.id}`}>
                      <Button variant="outline" className="border-accent text-accent hover:bg-accent/10">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Go to Payment Page
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Actions - For completed payment */}
              {searchResult.status === 'approved' && searchResult.payment_status === 'completed' && (
                <div className="border-t border-border pt-4">
                  <h4 className="font-semibold text-accent mb-3 flex items-center gap-2">
                    <Plane className="w-4 h-4" />
                    Next Steps
                  </h4>
                  <p className="text-muted-foreground mb-4">
                    Your leave payment is complete. You can now proceed to book your flight ticket.
                  </p>
                  <Link href="/payments">
                    <Button className="bg-accent hover:bg-accent/80 text-accent-foreground">
                      <Plane className="w-4 h-4 mr-2" />
                      Book Flight Ticket
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <Card className="bg-card/50 border border-border mt-8">
          <CardContent className="py-6">
            <h3 className="font-semibold text-foreground mb-2">Need Help?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              If you have lost your tracking code or need assistance, please contact our support team.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <a href="mailto:military@d4battalion.us" className="text-accent hover:underline">
                military@d4battalion.us
              </a>
              <a href="tel:+14302913433" className="text-accent hover:underline">
                +1 (430) 291-3433
              </a>
              <a
                href="https://wa.me/14302913433"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-500 hover:underline"
              >
                WhatsApp Support
              </a>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
