'use client';

import React, { useState } from 'react';
import { useAppContext } from '@/app/context/AppContext';
import { useRouter } from 'next/navigation';
import { translate } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import Image from 'next/image';

const PORTAL_PASSWORD = '#70346';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, login, language } = useAppContext();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate delay for security feel
    setTimeout(() => {
      if (password === PORTAL_PASSWORD) {
        login();
        router.push('/dashboard');
      } else {
        setError(translate('login.invalidPassword', language));
        setPassword('');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left side - Image */}
          <div className="hidden md:block relative h-96 rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/military-hero.jpg"
              alt="Military headquarters"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-transparent"></div>
          </div>

          {/* Right side - Login Form */}
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">D4</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-primary">
                  D4 Battalion Squad
                </h1>
              </div>
              <p className="text-muted-foreground text-lg">
                Military Services Portal
              </p>
            </div>

            {/* Login Card */}
            <Card className="p-6 md:p-8 shadow-lg border-2 border-accent/20">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Welcome Message */}
                <div className="bg-primary/5 border-l-4 border-accent p-4 rounded mb-6">
                  <p className="text-sm text-primary font-semibold">
                    {translate('login.welcome', language)}
                  </p>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    {translate('login.password', language)}
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••"
                    disabled={loading}
                    className="border-2 border-border focus:border-primary"
                    autoFocus
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-destructive/10 border border-destructive text-destructive text-sm p-3 rounded-md flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading || !password}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 h-10 mt-6"
                >
                  {loading ? 'Verifying...' : translate('login.submit', language)}
                </Button>

                {/* Security Info */}
                <div className="text-xs text-muted-foreground text-center pt-4">
                  Secure D4 Battalion Squad Portal - All information is encrypted
                </div>
              </form>
            </Card>

            {/* Features List */}
            <div className="grid grid-cols-2 gap-3 mt-8 pt-4 border-t border-border">
              <div className="flex gap-2">
                <span className="text-accent text-lg">✓</span>
                <span className="text-sm text-muted-foreground">Leave Requests</span>
              </div>
              <div className="flex gap-2">
                <span className="text-accent text-lg">✓</span>
                <span className="text-sm text-muted-foreground">Flight Payments</span>
              </div>
              <div className="flex gap-2">
                <span className="text-accent text-lg">✓</span>
                <span className="text-sm text-muted-foreground">Care Packages</span>
              </div>
              <div className="flex gap-2">
                <span className="text-accent text-lg">✓</span>
                <span className="text-sm text-muted-foreground">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
