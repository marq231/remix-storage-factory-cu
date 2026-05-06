'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import {
  Shield,
  ArrowLeft,
  Search,
  RefreshCw,
  AlertCircle,
  DollarSign,
  CheckCircle,
  XCircle,
  Calendar,
  Mail,
  Phone,
  User,
  Clock,
  Hash,
  Eye,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface LeaveRequest {
  id: string;
  tracking_code: string;
  type: string;
  duration_package: string;
  leave_amount: number;
  soldier_name: string;
  soldier_rank: string;
  soldier_id: string;
  soldier_image_url: string;
  relationship_to_soldier: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  payment_status: string;
  payment_confirmed: boolean;
  payment_confirmed_at: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
  created_at: string;
}

export default function AdminPaymentApprovals() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending'>('confirmed');
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth !== 'authenticated') {
      router.push('/admin');
      return;
    }
    fetchRequests();
  }, [router]);

  useEffect(() => {
    let filtered = requests;

    // Apply filter
    if (filter === 'confirmed') {
      filtered = filtered.filter((r) => r.payment_confirmed === true && r.payment_status === 'pending');
    } else if (filter === 'pending') {
      filtered = filtered.filter((r) => r.payment_status === 'pending' && !r.payment_confirmed);
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(
        (r) =>
          r.tracking_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.soldier_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.applicant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.applicant_email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRequests(filtered);
  }, [requests, filter, searchTerm]);

  const fetchRequests = async () => {
    setIsRefreshing(true);
    try {
      // Fetch leave requests with approved status and pending payment
      const { data, error } = await supabase
        .from('leave_requests')
        .select('*')
        .eq('status', 'approved')
        .in('payment_status', ['pending', 'not_paid'])
        .order('payment_confirmed_at', { ascending: false, nullsFirst: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const approvePayment = async (id: string) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('leave_requests')
        .update({ payment_status: 'completed' })
        .eq('id', id);

      if (error) throw error;

      // Find the request to get details for email notification
      const request = requests.find((r) => r.id === id);

      // Send email notification to client
      if (request && request.applicant_email) {
        try {
          await fetch('/api/send-notification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'payment_approved',
              data: {
                tracking_code: request.tracking_code,
                soldier_name: request.soldier_name,
                applicant_name: request.applicant_name,
                applicant_email: request.applicant_email,
                leave_amount: request.leave_amount,
              },
            }),
          });
        } catch (notifError) {
          console.error('Failed to send notification:', notifError);
        }
      }

      // Update local state
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, payment_status: 'completed' } : r))
      );

      setIsDialogOpen(false);
      setSelectedRequest(null);
      alert('Payment approved successfully! Client has been notified.');
    } catch (error) {
      console.error('Error approving payment:', error);
      alert('Failed to approve payment. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const rejectPayment = async (id: string) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('leave_requests')
        .update({ 
          payment_status: 'not_paid',
          payment_confirmed: false,
          payment_confirmed_at: null 
        })
        .eq('id', id);

      if (error) throw error;

      // Find the request to get details for email notification
      const request = requests.find((r) => r.id === id);

      // Send email notification to client
      if (request && request.applicant_email) {
        try {
          await fetch('/api/send-notification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'payment_rejected',
              data: {
                tracking_code: request.tracking_code,
                soldier_name: request.soldier_name,
                applicant_name: request.applicant_name,
                applicant_email: request.applicant_email,
                leave_amount: request.leave_amount,
              },
            }),
          });
        } catch (notifError) {
          console.error('Failed to send notification:', notifError);
        }
      }

      // Update local state
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, payment_status: 'not_paid', payment_confirmed: false } : r))
      );

      setIsDialogOpen(false);
      setSelectedRequest(null);
      alert('Payment rejected. Client has been notified to re-submit payment.');
    } catch (error) {
      console.error('Error rejecting payment:', error);
      alert('Failed to reject payment. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmedCount = requests.filter((r) => r.payment_confirmed && r.payment_status === 'pending').length;
  const pendingCount = requests.filter((r) => r.payment_status === 'pending' && !r.payment_confirmed).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37] mx-auto mb-4"></div>
          <p className="text-gray-400">Loading payment approvals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1628]">
      {/* Header */}
      <header className="bg-[#1a2d4a] border-b border-[#d4af37]/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#d4af37] rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-[#0a1628]" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Payment Approvals</h1>
                  <p className="text-xs text-gray-400">Verify and approve client payments</p>
                </div>
              </div>
            </div>
            <Button
              onClick={fetchRequests}
              disabled={isRefreshing}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="bg-green-900/30 border-green-500/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-300">Awaiting Your Approval</p>
                  <p className="text-4xl font-bold text-green-400">{confirmedCount}</p>
                  <p className="text-xs text-green-300 mt-1">Clients confirmed payment made</p>
                </div>
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-900/30 border-yellow-500/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-300">Awaiting Client Payment</p>
                  <p className="text-4xl font-bold text-yellow-400">{pendingCount}</p>
                  <p className="text-xs text-yellow-300 mt-1">Payment not yet confirmed by client</p>
                </div>
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <Clock className="w-8 h-8 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-[#1a2d4a] border-[#d4af37]/30 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex gap-2">
                <Button
                  onClick={() => setFilter('confirmed')}
                  variant={filter === 'confirmed' ? 'default' : 'outline'}
                  size="sm"
                  className={filter === 'confirmed' 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  }
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Needs Approval ({confirmedCount})
                </Button>
                <Button
                  onClick={() => setFilter('pending')}
                  variant={filter === 'pending' ? 'default' : 'outline'}
                  size="sm"
                  className={filter === 'pending' 
                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                    : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  }
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Awaiting Payment ({pendingCount})
                </Button>
                <Button
                  onClick={() => setFilter('all')}
                  variant={filter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  className={filter === 'all' 
                    ? 'bg-[#d4af37] hover:bg-[#b8972e] text-[#0a1628]' 
                    : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  }
                >
                  All ({requests.length})
                </Button>
              </div>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  placeholder="Search by tracking code, name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#0a1628] border-gray-600 text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-400 text-sm">
            Showing {filteredRequests.length} of {requests.length} requests
          </p>
        </div>

        {/* Requests List */}
        {filteredRequests.length === 0 ? (
          <Card className="bg-[#1a2d4a] border-[#d4af37]/30">
            <CardContent className="py-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">
                {filter === 'confirmed' 
                  ? 'No payments awaiting your approval' 
                  : filter === 'pending'
                  ? 'No requests awaiting client payment'
                  : 'No payment requests found'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <Card 
                key={request.id} 
                className={`border-2 transition-all ${
                  request.payment_confirmed 
                    ? 'bg-green-900/20 border-green-500/50 hover:border-green-400' 
                    : 'bg-[#1a2d4a] border-[#d4af37]/30 hover:border-[#d4af37]'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      {/* Status Badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#d4af37] text-[#0a1628] flex items-center gap-1">
                          <Hash className="w-3 h-3" />
                          {request.tracking_code}
                        </span>
                        {request.payment_confirmed ? (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white flex items-center gap-1 animate-pulse">
                            <CheckCircle className="w-3 h-3" />
                            CLIENT CONFIRMED PAID
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Awaiting Payment
                          </span>
                        )}
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                          {request.type} Leave
                        </span>
                      </div>

                      {/* Soldier Info */}
                      <div className="flex items-start gap-4 mb-3">
                        {request.soldier_image_url && (
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-[#d4af37]/50 flex-shrink-0">
                            <Image
                              src={request.soldier_image_url}
                              alt={request.soldier_name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {request.soldier_rank} {request.soldier_name}
                          </h3>
                          <p className="text-sm text-gray-400">ID: {request.soldier_id}</p>
                        </div>
                      </div>

                      {/* Applicant Info */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-2">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {request.applicant_name} ({request.relationship_to_soldier})
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {request.applicant_email}
                        </span>
                        {request.applicant_phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {request.applicant_phone}
                          </span>
                        )}
                      </div>

                      {/* Dates and Duration */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {request.duration_package}
                        </span>
                        {request.payment_confirmed_at && (
                          <span className="flex items-center gap-1 text-green-400">
                            <CheckCircle className="w-4 h-4" />
                            Confirmed: {new Date(request.payment_confirmed_at).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Amount and Actions */}
                    <div className="text-right space-y-3">
                      <div>
                        <p className="text-sm text-gray-400">Leave Amount</p>
                        <p className="text-3xl font-bold text-[#d4af37]">
                          ${request.leave_amount?.toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="flex gap-2 justify-end">
                        <Button
                          onClick={() => {
                            setSelectedRequest(request);
                            setIsDialogOpen(true);
                          }}
                          variant="outline"
                          size="sm"
                          className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Review
                        </Button>
                        
                        {request.payment_confirmed && (
                          <>
                            <Button
                              onClick={() => approvePayment(request.id)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              disabled={isUpdating}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => rejectPayment(request.id)}
                              size="sm"
                              variant="outline"
                              className="border-red-500 text-red-500 hover:bg-red-500/10"
                              disabled={isUpdating}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#1a2d4a] border-[#d4af37]/30 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#d4af37] flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Payment Review - {selectedRequest?.tracking_code}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Review payment details before approving or rejecting
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6 mt-4">
              {/* Payment Status */}
              {selectedRequest.payment_confirmed && (
                <div className="p-4 bg-green-900/30 border border-green-500 rounded-lg">
                  <div className="flex items-center gap-2 text-green-400 font-bold mb-2">
                    <CheckCircle className="w-5 h-5" />
                    CLIENT CONFIRMED PAYMENT MADE
                  </div>
                  <p className="text-sm text-green-300">
                    Confirmed at: {new Date(selectedRequest.payment_confirmed_at).toLocaleString()}
                  </p>
                </div>
              )}

              {/* Soldier Info */}
              <div>
                <h4 className="font-semibold text-[#d4af37] mb-3">Soldier Information</h4>
                <div className="flex items-start gap-4">
                  {selectedRequest.soldier_image_url && (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-[#d4af37]">
                      <Image
                        src={selectedRequest.soldier_image_url}
                        alt={selectedRequest.soldier_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="space-y-1">
                    <p className="text-white">
                      <strong>Name:</strong> {selectedRequest.soldier_rank} {selectedRequest.soldier_name}
                    </p>
                    <p className="text-gray-300">
                      <strong>ID:</strong> {selectedRequest.soldier_id}
                    </p>
                    <p className="text-gray-300">
                      <strong>Leave Type:</strong> {selectedRequest.type}
                    </p>
                    <p className="text-gray-300">
                      <strong>Duration:</strong> {selectedRequest.duration_package}
                    </p>
                  </div>
                </div>
              </div>

              {/* Applicant Info */}
              <div>
                <h4 className="font-semibold text-[#d4af37] mb-3">Applicant Information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className="text-gray-300"><strong>Name:</strong> {selectedRequest.applicant_name}</p>
                  <p className="text-gray-300"><strong>Relationship:</strong> {selectedRequest.relationship_to_soldier}</p>
                  <p className="text-gray-300"><strong>Email:</strong> {selectedRequest.applicant_email}</p>
                  <p className="text-gray-300"><strong>Phone:</strong> {selectedRequest.applicant_phone || 'N/A'}</p>
                </div>
              </div>

              {/* Payment Amount */}
              <div className="p-4 bg-[#0a1628] rounded-lg text-center">
                <p className="text-sm text-gray-400 mb-1">Payment Amount</p>
                <p className="text-4xl font-bold text-[#d4af37]">
                  ${selectedRequest.leave_amount?.toLocaleString()}
                </p>
              </div>

              {/* Actions */}
              {selectedRequest.payment_confirmed && (
                <div className="flex gap-4 pt-4 border-t border-gray-700">
                  <Button
                    onClick={() => approvePayment(selectedRequest.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    disabled={isUpdating}
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Approve Payment
                  </Button>
                  <Button
                    onClick={() => rejectPayment(selectedRequest.id)}
                    variant="outline"
                    className="flex-1 border-red-500 text-red-500 hover:bg-red-500/10"
                    disabled={isUpdating}
                  >
                    <XCircle className="w-5 h-5 mr-2" />
                    Reject Payment
                  </Button>
                </div>
              )}

              <Button
                onClick={() => setIsDialogOpen(false)}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
