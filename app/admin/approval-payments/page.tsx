'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import {
  Shield,
  ArrowLeft,
  Search,
  RefreshCw,
  AlertCircle,
  DollarSign,
  CreditCard,
  Building,
  Calendar,
  Mail,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ApprovalPayment {
  id: string;
  leave_request_id: string;
  full_name: string;
  email: string;
  amount: number;
  platform_fee: number;
  total_amount: number;
  payment_method: string;
  billing_address: string;
  billing_city: string;
  billing_zip: string;
  billing_country: string;
  status: string;
  created_at: string;
}

export default function AdminApprovalPayments() {
  const [payments, setPayments] = useState<ApprovalPayment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<ApprovalPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalRevenue, setTotalRevenue] = useState(0);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth !== 'authenticated') {
      router.push('/admin');
      return;
    }
    fetchPayments();
  }, [router]);

  useEffect(() => {
    let filtered = payments;

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPayments(filtered);
  }, [payments, searchTerm]);

  const fetchPayments = async () => {
    setIsRefreshing(true);
    try {
      const { data, error } = await supabase
        .from('approval_payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
      
      const total = (data || []).reduce((sum, p) => sum + parseFloat(String(p.total_amount || 0)), 0);
      setTotalRevenue(total);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37] mx-auto mb-4"></div>
          <p className="text-gray-400">Loading approval payments...</p>
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
                  <Shield className="w-5 h-5 text-[#0a1628]" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Approval Payments</h1>
                  <p className="text-xs text-gray-400">$10,000 + 5% fee payments</p>
                </div>
              </div>
            </div>
            <Button
              onClick={fetchPayments}
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
        {/* Revenue Summary */}
        <Card className="bg-gradient-to-r from-[#d4af37]/20 to-[#d4af37]/5 border-[#d4af37]/50 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#d4af37]">Total Approval Revenue</p>
                <p className="text-4xl font-bold text-white">${totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-gray-400 mt-1">{payments.length} payments received</p>
              </div>
              <div className="w-16 h-16 bg-[#d4af37]/20 rounded-full flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-[#d4af37]" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <Card className="bg-[#1a2d4a] border-[#d4af37]/30 mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#0a1628] border-gray-600 text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-400 text-sm">
            Showing {filteredPayments.length} of {payments.length} payments
          </p>
        </div>

        {/* Payments List */}
        {filteredPayments.length === 0 ? (
          <Card className="bg-[#1a2d4a] border-[#d4af37]/30">
            <CardContent className="py-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">No approval payments found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <Card key={payment.id} className="bg-[#1a2d4a] border-[#d4af37]/30">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {payment.status.toUpperCase()}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex items-center gap-1">
                          <CreditCard className="w-3 h-3" />
                          {payment.payment_method === 'card' ? 'Card' : 'Bank Transfer'}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {payment.full_name}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {payment.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(payment.created_at).toLocaleDateString()}
                        </span>
                        {payment.billing_city && (
                          <span className="flex items-center gap-1">
                            <Building className="w-4 h-4" />
                            {payment.billing_city}, {payment.billing_country}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">
                        Fee: ${parseFloat(String(payment.amount)).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">
                        Platform: ${parseFloat(String(payment.platform_fee)).toLocaleString()}
                      </div>
                      <div className="text-2xl font-bold text-[#d4af37]">
                        ${parseFloat(String(payment.total_amount)).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
