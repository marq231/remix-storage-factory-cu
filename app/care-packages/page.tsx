'use client';

import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/app/context/AppContext';
import { useRouter } from 'next/navigation';
import { translate } from '@/lib/translations';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, CheckCircle, ArrowLeft, Plus, Trash2, Loader2, Upload, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

interface PackageItem {
  id: string;
  description: string;
  quantity: number;
}

interface CarePackage {
  id: string;
  sender_name: string;
  sender_email: string;
  sender_phone: string | null;
  recipient_name: string;
  recipient_rank: string;
  recipient_unit: string;
  recipient_base: string;
  soldier_image_url: string | null;
  items: PackageItem[];
  message: string | null;
  estimated_weight: number | null;
  shipping_cost: number | null;
  status: 'processing' | 'shipped' | 'delivered';
  tracking_number: string | null;
  created_at: string;
}

export default function CarePackagesPage() {
  const router = useRouter();
  const { isAuthenticated, language } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [packages, setPackages] = useState<CarePackage[]>([]);
  const [items, setItems] = useState<PackageItem[]>([
    { id: '1', description: '', quantity: 1 },
  ]);
  const [soldierImage, setSoldierImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    senderPhone: '',
    recipientName: '',
    recipientRank: '',
    recipientUnit: '',
    recipientBase: '',
    message: '',
    estimatedWeight: '',
  });

  const supabase = createClient();

  const fetchPackages = async () => {
    setLoading(true);
    // Don't fetch packages for display - each client sees fresh form only
    setLoading(false);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchPackages();
  }, [isAuthenticated, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (id: string, field: keyof PackageItem, value: string | number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const addItem = () => {
    const newItem: PackageItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: '',
      quantity: 1,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setUploadingImage(true);

    // Convert to base64 for storage
    const reader = new FileReader();
    reader.onloadend = () => {
      setSoldierImage(reader.result as string);
      setUploadingImage(false);
    };
    reader.onerror = () => {
      alert('Failed to upload image. Please try again.');
      setUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate soldier image
    if (!soldierImage) {
      alert('Please upload a photo of the soldier');
      return;
    }

    // Validate items
    const validItems = items.filter((item) => item.description.trim() && item.quantity > 0);
    if (validItems.length === 0) {
      alert('Please add at least one item to the package');
      return;
    }

    setSubmitting(true);

    const estimatedWeight = formData.estimatedWeight
      ? parseFloat(formData.estimatedWeight)
      : null;
    const shippingCost = estimatedWeight ? estimatedWeight * 5.5 : null; // $5.50 per lb

    const { error } = await supabase.from('care_packages').insert({
      sender_name: formData.senderName,
      sender_email: formData.senderEmail,
      sender_phone: formData.senderPhone || null,
      recipient_name: formData.recipientName,
      recipient_rank: formData.recipientRank,
      recipient_unit: formData.recipientUnit,
      recipient_base: formData.recipientBase,
      soldier_image_url: soldierImage,
      items: validItems,
      message: formData.message || null,
      estimated_weight: estimatedWeight,
      shipping_cost: shippingCost,
      status: 'processing',
    });

    if (error) {
      console.error('Error creating care package:', error);
      alert('Failed to submit care package. Please try again.');
      setSubmitting(false);
      return;
    }

    // Send email notification to admin
    try {
      await fetch('/api/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'care_package',
          data: {
            sender_name: formData.senderName,
            sender_email: formData.senderEmail,
            sender_phone: formData.senderPhone,
            recipient_name: formData.recipientName,
            recipient_rank: formData.recipientRank,
            recipient_unit: formData.recipientUnit,
            recipient_base: formData.recipientBase,
            items: validItems,
            message: formData.message,
            estimated_weight: estimatedWeight,
            shipping_cost: shippingCost,
          },
        }),
      });
    } catch (notifError) {
      console.error('Failed to send notification:', notifError);
    }

    setSubmitted(true);
    setFormData({
      senderName: '',
      senderEmail: '',
      senderPhone: '',
      recipientName: '',
      recipientRank: '',
      recipientUnit: '',
      recipientBase: '',
      message: '',
      estimatedWeight: '',
    });
    setItems([{ id: '1', description: '', quantity: 1 }]);
    setSoldierImage(null);
    setSubmitting(false);

    setTimeout(() => {
      setSubmitted(false);
      setShowForm(false);
    }, 3000);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-primary hover:text-primary/80 mb-4 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            {translate('common.back', language)}
          </Link>
          <h1 className="text-4xl font-bold text-primary mb-2">
            {translate('carePackages.title', language)}
          </h1>
          <p className="text-muted-foreground">
            {translate('carePackages.description', language)}
          </p>
        </div>

        {/* Success Message */}
        {submitted && (
          <Card className="mb-6 bg-green-50 border-2 border-green-200 p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-semibold text-green-900">
                {translate('carePackages.submitted', language)}
              </p>
              <p className="text-sm text-green-800">
                Your care package has been submitted and is being processed.
              </p>
            </div>
          </Card>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Info Section */}
          <div className="lg:col-span-1">
            <Card className="p-6 border-2 border-primary/20">
              <h2 className="text-xl font-bold text-primary mb-4">
                {translate('carePackages.sendPackage', language)}
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Send care packages to military personnel deployed overseas. Include personal items,
                snacks, and messages of support.
              </p>

              <Button
                onClick={() => setShowForm(!showForm)}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {showForm ? 'Cancel' : 'Send Care Package'}
              </Button>
            </Card>

            {/* Guidelines Card */}
            <Card className="mt-4 p-4 bg-accent/5 border-2 border-accent/20">
              <h3 className="font-semibold text-accent mb-2">Shipping Guidelines</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>No perishable items</li>
                <li>No liquids over 4 oz</li>
                <li>No aerosols or flammables</li>
                <li>Max weight: 70 lbs</li>
                <li>Est. cost: $5.50/lb</li>
              </ul>
            </Card>
          </div>

          {/* Form */}
          {showForm && (
            <Card className="lg:col-span-2 p-6 border-2 border-accent/50 bg-accent/5">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Soldier Image Upload */}
                <div>
                  <h3 className="text-lg font-bold text-primary mb-4">Soldier Photo</h3>
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-accent bg-muted">
                      {soldierImage ? (
                        <Image
                          src={soldierImage}
                          alt="Soldier"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-16 h-16 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                        {uploadingImage ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                        <span>{uploadingImage ? 'Uploading...' : 'Upload Soldier Photo'}</span>
                      </div>
                    </label>
                    <p className="text-xs text-red-500 font-medium">* Required - Upload a clear photo of the soldier</p>
                  </div>
                </div>

                {/* Sender Information */}
                <div>
                  <h3 className="text-lg font-bold text-primary mb-4">Sender Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Your Name<span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        name="senderName"
                        value={formData.senderName}
                        onChange={handleInputChange}
                        placeholder="Full name"
                        required
                        className="border-2 border-border"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Your Email<span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="email"
                        name="senderEmail"
                        value={formData.senderEmail}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        required
                        className="border-2 border-border"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Your Phone
                      </label>
                      <Input
                        type="tel"
                        name="senderPhone"
                        value={formData.senderPhone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 000-0000"
                        className="border-2 border-border"
                      />
                    </div>
                  </div>
                </div>

                {/* Recipient Information */}
                <div>
                  <h3 className="text-lg font-bold text-primary mb-4">Recipient Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {translate('carePackages.recipientName', language)}
                        <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        name="recipientName"
                        value={formData.recipientName}
                        onChange={handleInputChange}
                        placeholder="Full name"
                        required
                        className="border-2 border-border"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {translate('carePackages.recipientRank', language)}
                        <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        name="recipientRank"
                        value={formData.recipientRank}
                        onChange={handleInputChange}
                        placeholder="e.g., Sergeant, Captain"
                        required
                        className="border-2 border-border"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {translate('carePackages.unit', language)}
                        <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        name="recipientUnit"
                        value={formData.recipientUnit}
                        onChange={handleInputChange}
                        placeholder="Unit designation"
                        required
                        className="border-2 border-border"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Military Base<span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        name="recipientBase"
                        value={formData.recipientBase}
                        onChange={handleInputChange}
                        placeholder="e.g., Camp Arifjan, Kuwait"
                        required
                        className="border-2 border-border"
                      />
                    </div>
                  </div>
                </div>

                {/* Package Contents */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-primary">
                      {translate('carePackages.packageContents', language)}
                    </h3>
                    <Button
                      type="button"
                      onClick={addItem}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      {translate('carePackages.addItem', language)}
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {items.map((item, index) => (
                      <div key={item.id} className="flex gap-3 items-start">
                        <div className="flex-1">
                          <Input
                            type="text"
                            value={item.description}
                            onChange={(e) =>
                              handleItemChange(item.id, 'description', e.target.value)
                            }
                            placeholder={`Item ${index + 1} description`}
                            className="border-2 border-border"
                          />
                        </div>
                        <div className="w-24">
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)
                            }
                            placeholder="Qty"
                            min="1"
                            className="border-2 border-border"
                          />
                        </div>
                        <Button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          variant="outline"
                          size="icon"
                          disabled={items.length === 1}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weight and Message */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Estimated Weight (lbs)
                    </label>
                    <Input
                      type="number"
                      name="estimatedWeight"
                      value={formData.estimatedWeight}
                      onChange={handleInputChange}
                      placeholder="0.0"
                      step="0.1"
                      className="border-2 border-border"
                    />
                    {formData.estimatedWeight && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Estimated shipping: ${(parseFloat(formData.estimatedWeight) * 5.5).toFixed(2)}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {translate('carePackages.message', language)}
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Write a personal message..."
                      className="border-2 border-border min-h-20"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded flex gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-900">
                    All packages are inspected for prohibited items before shipping. Processing
                    typically takes 3-5 business days.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 h-10"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    translate('carePackages.submit', language)
                  )}
                </Button>
              </form>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
