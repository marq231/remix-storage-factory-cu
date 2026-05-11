"use client"

import { useState } from "react"
import Image from "next/image"
import { Play, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false)

  // Demo video - a professional business/financial services video
  // Replace with your actual video ID when available
  const VIDEO_ID = "dQw4w9WgXcQ"

  return (
    <section className="py-16 lg:py-24 bg-muted">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl text-balance">
            A Message From Our CEO
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear directly from our leadership about our mission to help every American achieve financial freedom.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Video Container */}
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
            {!isPlaying ? (
              <>
                {/* Video Thumbnail with CEO Image */}
                <Image
                  src="/images/video-thumbnail.jpg"
                  alt="NextFund US CEO - Introduction Video"
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-foreground/30"></div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                  {/* Play Button */}
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="group mb-6"
                    aria-label="Play video"
                  >
                    <div className="w-24 h-24 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-xl">
                      <Play className="w-10 h-10 text-primary ml-1" fill="currentColor" />
                    </div>
                  </button>

                  {/* Punchlines */}
                  <div className="text-card max-w-lg">
                    <h3 className="text-2xl md:text-3xl font-bold mb-3 drop-shadow-lg">
                      {'"'}Your Dreams Deserve Funding{'"'}
                    </h3>
                    <p className="text-card/90 text-lg drop-shadow-md">
                      {'"'}At NextFund US, we believe financial barriers {"shouldn't"} stop you from achieving greatness. {"We've"} helped over 50,000 Americans turn their dreams into reality.{'"'}
                    </p>
                    <p className="mt-4 text-card/80 text-sm font-medium">
                      — Dr. Mark-Anthony B., CEO & Founder
                    </p>
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-4 right-4 bg-foreground/80 text-card px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                  1:00
                </div>
              </>
            ) : (
              <div className="relative w-full h-full bg-foreground">
                {/* Embedded Video */}
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0`}
                  title="NextFund US - CEO Introduction"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                
                {/* Close Button */}
                <Button
                  onClick={() => setIsPlaying(false)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/90 hover:bg-card text-foreground z-10"
                  size="icon"
                  variant="ghost"
                  aria-label="Close video"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>

          {/* Key Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <div className="text-center p-6 bg-card rounded-xl border border-border shadow-sm">
              <p className="text-3xl font-bold text-primary mb-2">$2.5B+</p>
              <p className="text-muted-foreground">Grants Distributed</p>
            </div>
            <div className="text-center p-6 bg-card rounded-xl border border-border shadow-sm">
              <p className="text-3xl font-bold text-primary mb-2">50,000+</p>
              <p className="text-muted-foreground">Americans Helped</p>
            </div>
            <div className="text-center p-6 bg-card rounded-xl border border-border shadow-sm">
              <p className="text-3xl font-bold text-primary mb-2">98%</p>
              <p className="text-muted-foreground">Satisfaction Rate</p>
            </div>
          </div>

          {/* Quote Section */}
          <div className="mt-10 bg-primary/5 border border-primary/20 rounded-xl p-8 text-center">
            <blockquote className="text-xl md:text-2xl font-serif text-foreground italic max-w-3xl mx-auto">
              {'"'}Every American deserves a fair shot at success. {"We're"} not just providing funds — {"we're"} investing in dreams, families, and the future of our communities.{'"'}
            </blockquote>
            <p className="mt-4 text-muted-foreground font-medium">
              Dr. Mark-Anthony B., CEO & Founder of NextFund US
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
