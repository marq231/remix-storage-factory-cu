'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import {
  Shield,
  FileText,
  CreditCard,
  Plane,
  Package,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  LogOut,
  RefreshCw,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Stats {
  totalLeaveRequests: number;
  pendingLeaves: number;
  approvedLeaves: number;
  rejectedLeaves: number;
  totalApprovalPayments: number;
  totalFlightPayments: number;
  totalCarePackages: number;
  totalRevenue: number;
}

interface LeaveRequest {
  id: string;
  type: string;
  soldier_name: string;
  soldier_rank: string;
  applicant_name: string;
  applicant_email: string;
  status: string;
  payment_status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalLeaveRequests: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    rejectedLeaves: 0,
    totalApprovalPayments: 0,
    totalFlightPayments: 0,
    totalCarePackages: 0,
    totalRevenue: 0,
  });
  const [recentLeaves, setRecentLeaves] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth !== 'authenticated') {
      router.push('/admin');
      return;
    }
    fetchData();
  }, [router]);

  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      // Fetch leave requests
      const { data: leaves, error: leavesError } = await supabase
        .from('leave_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (leavesError) throw leavesError;

      // Fetch approval payments
      const { data: approvalPayments, error: apError } = await supabase
        .from('approval_payments')
        .select('*');

      if (apError) throw apError;

      // Fetch flight payments
      const { data: flightPayments, error: fpError } = await supabase
        .from('flight_payments')
        .select('*');

      if (fpError) throw fpError;

      // Fetch care packages
      const { data: carePackages, error: cpError } = await supabase
        .from('care_packages')
        .select('*');

      if (cpError) throw cpError;

      // Calculate stats
      const pendingLeaves = leaves?.filter((l) => l.status === 'pending').length || 0;
      const approvedLeaves = leaves?.filter((l) => l.status === 'approved').length || 0;
      const rejectedLeaves = leaves?.filter((l) => l.status === 'rejected').length || 0;

      const approvalRevenue = approvalPayments?.reduce((sum, p) => sum + parseFloat(p.total_amount || 0), 0) || 0;
      const flightRevenue = flightPayments?.reduce((sum, p) => sum + parseFloat(p.total_amount || 0), 0) || 0;
      const packageRevenue = carePackages?.reduce((sum, p) => sum + parseFloat(p.shipping_cost || 0), 0) || 0;

      setStats({
        totalLeaveRequests: leaves?.length || 0,
        pendingLeaves,
        approvedLeaves,
        rejectedLeaves,
        totalApprovalPayments: approvalPayments?.length || 0,
        totalFlightPayments: flightPayments?.length || 0,
        totalCarePackages: carePackages?.length || 0,
        totalRevenue: approvalRevenue + flightRevenue + packageRevenue,
      });

      setRecentLeaves(leaves?.slice(0, 5) || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    router.push('/admin');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37] mx-auto mb-4"></div>
          <p className="text-gray-400">Loading admin dashboard...</p>
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
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#d4af37] rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#0a1628]" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-xs text-gray-400">Military Leave Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={fetchData}
                disabled={isRefreshing}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-red-600 text-red-400 hover:bg-red-900/30"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#1a2d4a] border-[#d4af37]/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Leave Requests</p>
                  <p className="text-3xl font-bold text-white">{stats.totalLeaveRequests}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2d4a] border-[#d4af37]/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Pending Review</p>
                  <p className="text-3xl font-bold text-yellow-400">{stats.pendingLeaves}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2d4a] border-[#d4af37]/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Payments</p>
                  <p className="text-3xl font-bold text-green-400">
                    {stats.totalApprovalPayments + stats.totalFlightPayments}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2d4a] border-[#d4af37]/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Revenue</p>
                  <p className="text-3xl font-bold text-[#d4af37]">
                    ${stats.totalRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#d4af37]/20 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-[#d4af37]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-green-900/30 border-green-500/30">
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-green-400">{stats.approvedLeaves}</p>
                <p className="text-xs text-green-300">Approved</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-red-900/30 border-red-500/30">
            <CardContent className="p-4 flex items-center gap-3">
              <XCircle className="w-8 h-8 text-red-400" />
              <div>
                <p className="text-2xl font-bold text-red-400">{stats.rejectedLeaves}</p>
                <p className="text-xs text-red-300">Rejected</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-900/30 border-purple-500/30">
            <CardContent className="p-4 flex items-center gap-3">
              <Plane className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-2xl font-bold text-purple-400">{stats.totalFlightPayments}</p>
                <p className="text-xs text-purple-300">Flight Payments</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-900/30 border-orange-500/30">
            <CardContent className="p-4 flex items-center gap-3">
              <Package className="w-8 h-8 text-orange-400" />
              <div>
                <p className="text-2xl font-bold text-orange-400">{stats.totalCarePackages}</p>
                <p className="text-xs text-orange-300">Care Packages</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Approvals - Highlighted */}
        <Link href="/admin/payment-approvals">
          <Card className="bg-green-900/30 border-2 border-green-500 hover:border-green-400 transition-colors cursor-pointer mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-green-500/30 rounded-full flex items-center justify-center">
                    <DollarSign className="w-8 h-8 text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-green-400">Payment Approvals</h3>
                    <p className="text-sm text-green-300">Review and approve client payment confirmations</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-300">Awaiting Approval</p>
                  <p className="text-3xl font-bold text-green-400">
                    {recentLeaves.filter(l => l.status === 'approved' && l.payment_status === 'pending').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href="/admin/leave-requests">
            <Card className="bg-[#1a2d4a] border-[#d4af37]/30 hover:border-[#d4af37] transition-colors cursor-pointer h-full">
              <CardContent className="p-6 text-center">
                <FileText className="w-10 h-10 text-[#d4af37] mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-1">Leave Requests</h3>
                <p className="text-sm text-gray-400">View and manage all leave applications</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/payment-approvals">
            <Card className="bg-[#1a2d4a] border-[#d4af37]/30 hover:border-[#d4af37] transition-colors cursor-pointer h-full">
              <CardContent className="p-6 text-center">
                <CreditCard className="w-10 h-10 text-[#d4af37] mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-1">Payment Approvals</h3>
                <p className="text-sm text-gray-400">Approve client payment confirmations</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/flight-payments">
            <Card className="bg-[#1a2d4a] border-[#d4af37]/30 hover:border-[#d4af37] transition-colors cursor-pointer h-full">
              <CardContent className="p-6 text-center">
                <Plane className="w-10 h-10 text-[#d4af37] mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-1">Flight Payments</h3>
                <p className="text-sm text-gray-400">View flight booking payments</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/care-packages">
            <Card className="bg-[#1a2d4a] border-[#d4af37]/30 hover:border-[#d4af37] transition-colors cursor-pointer h-full">
              <CardContent className="p-6 text-center">
                <Package className="w-10 h-10 text-[#d4af37] mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-1">Care Packages</h3>
                <p className="text-sm text-gray-400">View care package orders</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Leave Requests */}
        <Card className="bg-[#1a2d4a] border-[#d4af37]/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Recent Leave Requests</CardTitle>
                <CardDescription className="text-gray-400">
                  Latest submissions requiring attention
                </CardDescription>
              </div>
              <Link href="/admin/leave-requests">
                <Button variant="outline" size="sm" className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentLeaves.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400">No leave requests yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentLeaves.map((leave) => (
                  <div
                    key={leave.id}
                    className="flex items-center justify-between p-4 bg-[#0a1628] rounded-lg border border-gray-700"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{leave.soldier_name}</p>
                        <p className="text-sm text-gray-400">
                          Applied by: {leave.applicant_name} ({leave.applicant_email})
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(leave.type)}`}>
                        {leave.type}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}>
                        {leave.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
