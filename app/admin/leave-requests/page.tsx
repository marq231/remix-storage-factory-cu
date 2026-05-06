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
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
  AlertCircle,
  Calendar,
  User,
  Mail,
  Phone,
  Hash,
  DollarSign,
  Copy,
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
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

const DURATION_LABELS: Record<string, string> = {
  '1-2_months': '1-2 Months',
  '2-5_months': '2-5 Months',
  '5-8_months': '5-8 Months',
  '8-12_months': '8-12 Months',
};

export default function AdminLeaveRequests() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
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

    if (searchTerm) {
      filtered = filtered.filter(
        (r) =>
          r.soldier_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.applicant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.applicant_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.soldier_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (r.tracking_code && r.tracking_code.includes(searchTerm))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter((r) => r.type === typeFilter);
    }

    setFilteredRequests(filtered);
  }, [requests, searchTerm, statusFilter, typeFilter]);

  const fetchRequests = async () => {
    setIsRefreshing(true);
    try {
      const { data, error } = await supabase
        .from('leave_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    setIsUpdating(true);
    try {
      const updateData: { status: string; payment_status?: string } = { status: newStatus };
      
      if (newStatus === 'approved') {
        updateData.payment_status = 'pending';
      }

      const { error } = await supabase
        .from('leave_requests')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      // Find the request to get details for email notification
      const request = requests.find(r => r.id === id);
      
      // Send email notification to client
      if (request && request.applicant_email) {
        try {
          await fetch('/api/send-notification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: newStatus === 'approved' ? 'leave_approved' : 'leave_rejected',
              data: {
                tracking_code: request.tracking_code,
                type: request.type,
                soldier_name: request.soldier_name,
                applicant_name: request.applicant_name,
                applicant_email: request.applicant_email,
                start_date: request.start_date,
                end_date: request.end_date,
                leave_amount: request.leave_amount,
              },
            }),
          });
        } catch (notifError) {
          console.error('Failed to send notification:', notifError);
        }
      }

      setRequests((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: newStatus, payment_status: newStatus === 'approved' ? 'pending' : r.payment_status } : r
        )
      );

      setIsDialogOpen(false);
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const copyTrackingCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'emergency':
        return 'bg-red-100 text-red-800';
      case 'vacation':
        return 'bg-blue-100 text-blue-800';
      case 'medical':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'not_paid':
        return 'bg-red-100 text-red-800';
      case 'not_required':
        return 'bg-gray-100 text-gray-600';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading leave requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary border-b border-accent/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="icon" className="text-primary-foreground/70 hover:text-primary-foreground">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-primary-foreground">Leave Requests</h1>
                  <p className="text-xs text-primary-foreground/70">Manage all leave applications</p>
                </div>
              </div>
            </div>
            <Button
              onClick={fetchRequests}
              disabled={isRefreshing}
              variant="outline"
              size="sm"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="bg-card border-accent/30 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search by tracking code, soldier name, applicant, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background border-border text-foreground"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40 bg-background border-border text-foreground">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-40 bg-background border-border text-foreground">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="vacation">Vacation</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-muted-foreground text-sm">
            Showing {filteredRequests.length} of {requests.length} requests
          </p>
        </div>

        {/* Requests List */}
        {filteredRequests.length === 0 ? (
          <Card className="bg-card border-accent/30">
            <CardContent className="py-12 text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No leave requests found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <Card key={request.id} className="bg-card border-accent/30">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      {/* Tracking Code - Prominent */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="bg-accent/20 border-2 border-accent px-4 py-2 rounded-lg flex items-center gap-2">
                          <Hash className="w-5 h-5 text-accent" />
                          <span className="text-xl font-bold font-mono text-accent">
                            {request.tracking_code || 'N/A'}
                          </span>
                          {request.tracking_code && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => copyTrackingCode(request.tracking_code)}
                            >
                              <Copy className={`w-4 h-4 ${copiedCode === request.tracking_code ? 'text-green-500' : 'text-muted-foreground'}`} />
                            </Button>
                          )}
                        </div>
                        {copiedCode === request.tracking_code && (
                          <span className="text-xs text-green-500">Copied!</span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(request.type)}`}>
                          {request.type.toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                          {request.status.toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(request.payment_status)}`}>
                          Payment: {request.payment_status.replace('_', ' ')}
                        </span>
                        {request.payment_confirmed && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-300">
                            CLIENT CONFIRMED PAID
                          </span>
                        )}
                        {request.duration_package && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {DURATION_LABELS[request.duration_package] || request.duration_package}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {request.soldier_name} ({request.soldier_rank})
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Soldier ID: {request.soldier_id} | Relationship: {request.relationship_to_soldier}
                      </p>

                      {/* Leave Amount */}
                      {request.leave_amount > 0 && (
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-4 h-4 text-accent" />
                          <span className="text-lg font-bold text-accent">
                            ${request.leave_amount.toLocaleString()}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            (+ 5% platform fee)
                          </span>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {request.applicant_name}
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
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRequest(request);
                          setIsDialogOpen(true);
                        }}
                        className="border-accent text-accent hover:bg-accent/10"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      {request.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => updateStatus(request.id, 'approved')}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateStatus(request.id, 'rejected')}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
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
        <DialogContent className="bg-card border-accent/30 text-foreground max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-accent">Leave Request Details</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Complete information about this leave request
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              {/* Tracking Code - Prominent */}
              <div className="bg-accent/20 border-2 border-accent p-4 rounded-lg text-center">
                <p className="text-xs text-accent mb-1">TRACKING CODE</p>
                <p className="text-3xl font-bold font-mono text-accent">
                  {selectedRequest.tracking_code || 'N/A'}
                </p>
              </div>

              {/* Amount */}
              {selectedRequest.leave_amount > 0 && (
                <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg text-center">
                  <p className="text-xs text-green-400 mb-1">LEAVE AMOUNT</p>
                  <p className="text-2xl font-bold text-green-400">
                    ${selectedRequest.leave_amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Duration: {DURATION_LABELS[selectedRequest.duration_package] || 'N/A'}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Soldier Name</p>
                  <p className="font-medium">{selectedRequest.soldier_name}</p>
                </div>
                <div className="bg-background p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Rank</p>
                  <p className="font-medium">{selectedRequest.soldier_rank}</p>
                </div>
                <div className="bg-background p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Soldier ID</p>
                  <p className="font-medium">{selectedRequest.soldier_id}</p>
                </div>
                <div className="bg-background p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Leave Type</p>
                  <p className="font-medium capitalize">{selectedRequest.type}</p>
                </div>
                <div className="bg-background p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Start Date</p>
                  <p className="font-medium">{new Date(selectedRequest.start_date).toLocaleDateString()}</p>
                </div>
                <div className="bg-background p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">End Date</p>
                  <p className="font-medium">{new Date(selectedRequest.end_date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="bg-background p-4 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Reason for Leave</p>
                <p className="font-medium">{selectedRequest.reason}</p>
              </div>
              <div className="border-t border-border pt-4">
                <h4 className="text-sm font-semibold text-accent mb-3">Applicant Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Applicant Name</p>
                    <p className="font-medium">{selectedRequest.applicant_name}</p>
                  </div>
                  <div className="bg-background p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Relationship</p>
                    <p className="font-medium">{selectedRequest.relationship_to_soldier}</p>
                  </div>
                  <div className="bg-background p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                    <p className="font-medium">{selectedRequest.applicant_email}</p>
                  </div>
                  <div className="bg-background p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Phone</p>
                    <p className="font-medium">{selectedRequest.applicant_phone || 'N/A'}</p>
                  </div>
                </div>
              </div>
              <div className="bg-background p-4 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Submitted At</p>
                <p className="font-medium">{new Date(selectedRequest.created_at).toLocaleString()}</p>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            {selectedRequest?.status === 'pending' && (
              <>
                <Button
                  onClick={() => updateStatus(selectedRequest.id, 'approved')}
                  disabled={isUpdating}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => updateStatus(selectedRequest.id, 'rejected')}
                  disabled={isUpdating}
                  variant="destructive"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </>
            )}
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="border-border text-foreground"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
