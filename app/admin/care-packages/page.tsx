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
  Package,
  Calendar,
  Mail,
  Phone,
  User,
  MapPin,
  Scale,
  Truck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CarePackage {
  id: string;
  sender_name: string;
  sender_email: string;
  sender_phone: string;
  recipient_name: string;
  recipient_rank: string;
  recipient_unit: string;
  recipient_base: string;
  items: { name: string; quantity: number }[];
  message: string;
  estimated_weight: number;
  shipping_cost: number;
  status: string;
  tracking_number: string;
  created_at: string;
}

export default function AdminCarePackages() {
  const [packages, setPackages] = useState<CarePackage[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<CarePackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [totalPackages, setTotalPackages] = useState(0);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth !== 'authenticated') {
      router.push('/admin');
      return;
    }
    fetchPackages();
  }, [router]);

  useEffect(() => {
    let filtered = packages;

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.sender_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.sender_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.recipient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.recipient_base.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    setFilteredPackages(filtered);
  }, [packages, searchTerm, statusFilter]);

  const fetchPackages = async () => {
    setIsRefreshing(true);
    try {
      const { data, error } = await supabase
        .from('care_packages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPackages(data || []);
      setTotalPackages(data?.length || 0);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('care_packages')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setPackages((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37] mx-auto mb-4"></div>
          <p className="text-gray-400">Loading care packages...</p>
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
                  <h1 className="text-xl font-bold text-white">Care Packages</h1>
                  <p className="text-xs text-gray-400">Manage care package orders</p>
                </div>
              </div>
            </div>
            <Button
              onClick={fetchPackages}
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
        {/* Summary */}
        <Card className="bg-gradient-to-r from-orange-500/20 to-orange-500/5 border-orange-500/50 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-400">Total Care Packages</p>
                <p className="text-4xl font-bold text-white">{totalPackages}</p>
                <p className="text-sm text-gray-400 mt-1">
                  {packages.filter((p) => p.status === 'processing').length} processing,{' '}
                  {packages.filter((p) => p.status === 'shipped').length} shipped,{' '}
                  {packages.filter((p) => p.status === 'delivered').length} delivered
                </p>
              </div>
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center">
                <Package className="w-8 h-8 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="bg-[#1a2d4a] border-[#d4af37]/30 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  placeholder="Search by sender, recipient, or base..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#0a1628] border-gray-600 text-white"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40 bg-[#0a1628] border-gray-600 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-400 text-sm">
            Showing {filteredPackages.length} of {packages.length} packages
          </p>
        </div>

        {/* Packages List */}
        {filteredPackages.length === 0 ? (
          <Card className="bg-[#1a2d4a] border-[#d4af37]/30">
            <CardContent className="py-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">No care packages found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredPackages.map((pkg) => (
              <Card key={pkg.id} className="bg-[#1a2d4a] border-[#d4af37]/30">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(pkg.status)}`}>
                            {pkg.status.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(pkg.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        
                        {/* Sender Info */}
                        <div className="mb-4">
                          <p className="text-xs text-gray-500 mb-1">SENDER</p>
                          <h3 className="text-lg font-semibold text-white">{pkg.sender_name}</h3>
                          <div className="flex flex-wrap gap-3 text-sm text-gray-400 mt-1">
                            <span className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {pkg.sender_email}
                            </span>
                            {pkg.sender_phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                {pkg.sender_phone}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Recipient Info */}
                        <div className="bg-[#0a1628] p-4 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">RECIPIENT</p>
                          <h4 className="font-semibold text-white">
                            {pkg.recipient_name} ({pkg.recipient_rank})
                          </h4>
                          <div className="flex flex-wrap gap-3 text-sm text-gray-400 mt-1">
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {pkg.recipient_unit}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {pkg.recipient_base}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Select
                          value={pkg.status}
                          onValueChange={(value) => updateStatus(pkg.id, value)}
                        >
                          <SelectTrigger className="w-40 bg-[#0a1628] border-gray-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                          </SelectContent>
                        </Select>
                        {pkg.estimated_weight && (
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Scale className="w-4 h-4" />
                            {pkg.estimated_weight} lbs
                          </div>
                        )}
                        {pkg.shipping_cost && (
                          <div className="text-lg font-bold text-orange-400">
                            ${parseFloat(String(pkg.shipping_cost)).toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Items */}
                    {pkg.items && pkg.items.length > 0 && (
                      <div className="border-t border-gray-700 pt-4">
                        <p className="text-xs text-gray-500 mb-2">ITEMS ({pkg.items.length})</p>
                        <div className="flex flex-wrap gap-2">
                          {pkg.items.map((item, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-[#0a1628] rounded-full text-xs text-gray-300"
                            >
                              {item.name} x{item.quantity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Message */}
                    {pkg.message && (
                      <div className="border-t border-gray-700 pt-4">
                        <p className="text-xs text-gray-500 mb-1">MESSAGE</p>
                        <p className="text-sm text-gray-300 italic">&quot;{pkg.message}&quot;</p>
                      </div>
                    )}
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
