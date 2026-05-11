"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Michael Thompson",
    location: "Dallas, Texas",
    category: "Mortgage Payoff",
    amount: "$1,300,000",
    image: "/images/testimonials/cheque-mortgage.jpg",
    quote: "After 25 years of mortgage payments, I never thought I'd see the day my home was fully paid off. I got my grant through Metro Finance and NextFund US made it possible. The grant covered my entire remaining balance, and now my family has true financial freedom.",
    date: "March 2024"
  },
  {
    id: 2,
    name: "Sarah Martinez",
    location: "Phoenix, Arizona",
    category: "Business Growth",
    amount: "$840,000",
    image: "/images/testimonials/cheque-business.jpg",
    quote: "My small bakery was struggling to expand. I received my business grant through Metro Finance, and with help from NextFund US, I was able to open two new locations and hire 15 more employees. This has transformed not just my life, but my entire community.",
    date: "January 2024"
  },
  {
    id: 3,
    name: "Robert Williams",
    location: "Atlanta, Georgia",
    category: "Medical Expenses",
    amount: "$200,000",
    image: "/images/testimonials/cheque-medical.jpg",
    quote: "When my wife was diagnosed with cancer, the medical bills seemed impossible. I got my grant through Metro Finance and NextFund US covered all our medical expenses, allowing us to focus on her recovery instead of financial stress. She's now in remission.",
    date: "February 2024"
  },
  {
    id: 4,
    name: "Jennifer Chen",
    location: "Seattle, Washington",
    category: "Education Grant",
    amount: "$623,000",
    image: "/images/testimonials/cheque-education.jpg",
    quote: "As a first-generation college student, I dreamed of attending medical school but couldn't afford it. Thanks to Metro Finance and NextFund US, the education grant covered my entire medical school tuition. I'm now a resident physician helping others.",
    date: "December 2023"
  },
]

export function SuccessStories() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }, [])

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      nextSlide()
    }, 6000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, nextSlide])

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section className="py-16 lg:py-24 bg-muted">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl text-balance">
            Success Stories
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Real Americans who have transformed their lives with financial assistance from NextFund US.
          </p>
        </div>

        <div 
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2">
                {/* Image Section */}
                <div className="relative h-64 lg:h-[400px] bg-muted">
                  <Image
                    src={currentTestimonial.image}
                    alt={`${currentTestimonial.name}'s grant cheque for ${currentTestimonial.amount}`}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-block px-3 py-1 bg-accent text-accent-foreground text-sm font-medium rounded-full">
                      {currentTestimonial.category}
                    </span>
                    <p className="mt-2 text-2xl font-bold text-white">
                      {currentTestimonial.amount}
                    </p>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <Quote className="w-10 h-10 text-primary/20 mb-4" />
                  <blockquote className="text-lg text-foreground leading-relaxed mb-6">
                    {currentTestimonial.quote}
                  </blockquote>
                  <div className="mt-auto">
                    <p className="font-semibold text-foreground">{currentTestimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{currentTestimonial.location}</p>
                    <p className="text-xs text-muted-foreground mt-1">Received: {currentTestimonial.date}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none px-4">
            <Button
              variant="secondary"
              size="icon"
              onClick={prevSlide}
              className="pointer-events-auto rounded-full shadow-lg"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={nextSlide}
              className="pointer-events-auto rounded-full shadow-lg"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                index === currentIndex ? "bg-primary" : "bg-primary/30"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">$1.3M</p>
            <p className="text-sm text-muted-foreground">Mortgage Assistance</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">$840K</p>
            <p className="text-sm text-muted-foreground">Business Grants</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">$200K</p>
            <p className="text-sm text-muted-foreground">Medical Relief</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">$623K</p>
            <p className="text-sm text-muted-foreground">Education Support</p>
          </div>
        </div>
      </div>
    </section>
  )
}
