'use client';

import React, { useState } from 'react';
import { useAppContext } from '@/app/context/AppContext';
import { useRouter } from 'next/navigation';
import { translate } from '@/lib/translations';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  FileText,
  CreditCard,
  Package,
  ArrowRight,
  Search,
  Hash,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, language } = useAppContext();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const services = [
    {
      id: 'leave',
      title: translate('dashboard.leaveRequests', language),
      description: 'Apply for emergency, vacation, or medical leave with duration-based pricing',
      icon: FileText,
      href: '/leave',
      color: 'bg-primary/10 border-primary/30',
      accentColor: 'text-primary',
      image: '/military-personnel.jpg',
    },
    {
      id: 'payments',
      title: 'Book Flight Ticket',
      description: 'Select aircraft class and book your military flight',
      icon: CreditCard,
      href: '/payments',
      color: 'bg-secondary/10 border-secondary/30',
      accentColor: 'text-secondary',
      image: '/military-aircraft.jpg',
    },
    {
      id: 'packages',
      title: translate('dashboard.carePackages', language),
      description: 'Send care packages to military personnel',
      icon: Package,
      href: '/care-packages',
      color: 'bg-accent/10 border-accent/30',
      accentColor: 'text-accent',
      image: '/military-family.jpg',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Track Your Leave - Prominent Section */}
        <Link href="/track">
          <Card className="mb-8 p-6 bg-accent/20 border-4 border-accent cursor-pointer hover:bg-accent/30 transition-all">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-accent-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-accent">Track Your Leave Request</h2>
                  <p className="text-muted-foreground">
                    Enter your 8-digit tracking code to check your application status
                  </p>
                </div>
              </div>
              <Button className="bg-accent hover:bg-accent/80 text-accent-foreground text-lg px-8 py-6">
                <Hash className="w-5 h-5 mr-2" />
                Track Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </Card>
        </Link>

        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Welcome to D4 Battalion Squad
          </h1>
          <p className="text-muted-foreground text-lg">
            Military Services Portal - Select a service below
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <Link key={service.id} href={service.href}>
                <Card
                  className={`h-full p-6 border-2 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 ${service.color}`}
                >
                  {/* Image */}
                  <div className="relative w-full h-32 mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className={`${service.accentColor} mb-3`}>
                        <IconComponent className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground">
                        {service.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4">
                    {service.description}
                  </p>

                  {/* Action */}
                  <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                    Access <ArrowRight className="w-4 h-4" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-primary mb-6">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="text-accent text-2xl">✓</div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Duration-Based Leave Pricing
                </h3>
                <p className="text-sm text-muted-foreground">
                  Choose from 1-2 months ($10,000) up to 8-12 months ($50,000) leave packages
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-accent text-2xl">✓</div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Multiple Aircraft Classes
                </h3>
                <p className="text-sm text-muted-foreground">
                  Economy to Private Jet Charter options for your military flight
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-accent text-2xl">✓</div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Care Package Support
                </h3>
                <p className="text-sm text-muted-foreground">
                  Send care packages to military personnel at any location
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-accent text-2xl">✓</div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  24/7 Support
                </h3>
                <p className="text-sm text-muted-foreground">
                  Dedicated support team available via email, phone, and WhatsApp
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Support Card */}
        <Card className="border-2 border-accent/50 bg-accent/5 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-lg font-bold text-primary mb-1">Need Assistance?</h3>
              <p className="text-sm text-muted-foreground">
                Our support team is ready to help you 24/7
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                asChild
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
              >
                <a href="mailto:ltcol.defence@gmail.com">Email Support</a>
              </Button>
              <Button
                asChild
                className="bg-primary hover:bg-primary/90"
              >
                <a
                  href="https://wa.me/14302913433?text=Hello,%20I%20need%20military%20support%20services"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
