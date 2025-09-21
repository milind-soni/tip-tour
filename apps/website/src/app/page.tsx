"use client";

// import Image from "next/image";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { DemoDashboard } from "@/components/demo-dashboard";
import { WaitlistForm } from "@/components/waitlist-form";

// Import TipTour (will be loaded client-side)
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
let TipTour: any = null;

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tipTourRef = useRef<any>(null);

  useEffect(() => {
    // Dynamically import TipTour to avoid SSR issues
    const initTipTour = async () => {
      try {
        const { TipTour: TipTourClass } = await import("../lib/tiptour");
        TipTour = TipTourClass;
        
        if (tipTourRef.current) return; // Already initialized
        
        tipTourRef.current = new TipTourClass({
          smoothRadius: 18,
          friction: 0.9,
          offset: { x: 24, y: 18 },
          hideDelay: 6000,
          showDelay: 100,
          arrow: { enabled: true, color: '#1a1a1a' }
        });

        tipTourRef.current.setContent("🚀 Welcome to TipTour! Hover over elements to see interactive tooltips in action.");
        console.log("TipTour initialized successfully!");
        
        // Add hover listeners to interactive elements
        const addHoverTooltip = (selector: string, content: string) => {
          const elements = document.querySelectorAll(selector);
          elements.forEach((el) => {
            el.addEventListener('mouseenter', () => {
              tipTourRef.current?.setContent(content);
              tipTourRef.current?.show();
            });
          });
        };

        // Add tooltips to key elements
        setTimeout(() => {
          addHoverTooltip('[data-tooltip="features"]', '✨ Discover TipTour&apos;s powerful features for modern web apps');
          addHoverTooltip('[data-tooltip="github"]', '⭐ Star us on GitHub and contribute to the project');
          addHoverTooltip('[data-tooltip="waitlist"]', '🎯 Join early adopters getting first access to TipTour');
          addHoverTooltip('[data-tooltip="demo"]', '🎮 Interactive demo showing smooth cursor following');
          addHoverTooltip('[data-tooltip="workflow"]', '🔄 Record and replay user workflows as JSON');
          
          // Dashboard tooltips
          addHoverTooltip('[data-tooltip="dashboard-header"]', '📊 Dashboard header with title and actions');
          addHoverTooltip('[data-tooltip="dashboard-actions"]', '⚡ Quick actions like exporting data');
          addHoverTooltip('[data-tooltip="metric-revenue"]', '💰 Total revenue with growth percentage');
          addHoverTooltip('[data-tooltip="metric-users"]', '👥 Active user count and engagement metrics');
          addHoverTooltip('[data-tooltip="metric-orders"]', '📦 Order volume and transaction data');
          addHoverTooltip('[data-tooltip="metric-conversion"]', '📈 Conversion rate and optimization insights');
          addHoverTooltip('[data-tooltip="dashboard-chart"]', '📊 Interactive chart showing revenue trends over time');
          addHoverTooltip('[data-tooltip="dashboard-activity"]', '🔔 Real-time activity feed with recent events');
        }, 1000);

      } catch (error) {
        console.error('Failed to initialize TipTour:', error);
      }
    };

    initTipTour();

    return () => {
      if (tipTourRef.current) {
        tipTourRef.current.destroy();
        tipTourRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="mr-4 hidden md:flex">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded-md bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500" />
              <span className="hidden font-bold sm:inline-block">TipTour</span>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <a
                href="#features"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                data-tooltip="features"
              >
                Features
              </a>
              <a
                href="#demo"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                data-tooltip="demo"
              >
                Demo
              </a>
              <a
                href="https://github.com/milind-soni/tip-tour"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                data-tooltip="github"
              >
                GitHub
              </a>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container mx-auto space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-2 text-center">
            <Badge variant="outline" className="mb-4">
              ✨ Interactive tooltips reimagined
            </Badge>
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
              Build beautiful cursor-following tooltips with{" "}
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                guided workflows
              </span>
            </h1>
            <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
              TipTour delivers 60fps cursor tracking, smart positioning, and a complete workflow system 
              to record and replay user interactions. Perfect for onboarding, support, and automation.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 mt-8">
              <Button size="lg" data-tooltip="waitlist" className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                Join Waitlist
              </Button>
              <Button variant="outline" size="lg" data-tooltip="github">
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                View on GitHub
              </Button>
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section id="demo" className="container mx-auto py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center mb-8">
            <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl">
              Interactive Demo
            </h2>
            <p className="max-w-[600px] text-lg text-muted-foreground">
              Hover over any element in this dashboard to see TipTour tooltips in action with contextual information.
            </p>
          </div>
          <div className="w-full overflow-hidden rounded-xl border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <DemoDashboard />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto py-8 md:py-12 lg:py-24" data-tooltip="features">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
            <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl">
              Powerful features
            </h2>
            <p className="max-w-[600px] text-lg text-muted-foreground">
              Everything you need to create engaging user experiences and streamline workflows.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3 mt-12">
            {[
              {
                title: "60fps Smooth Tracking",
                description: "Hardware-accelerated cursor following with device-pixel precision and RAF optimization.",
                icon: "⚡"
              },
              {
                title: "Smart Positioning",
                description: "Edge-aware placement with automatic repositioning to keep tooltips always visible.",
                icon: "🎯"
              },
              {
                title: "Workflow Recording",
                description: "Capture user interactions as JSON workflows for onboarding and automation.",
                icon: "🔄",
                tooltip: "workflow"
              },
              {
                title: "Animated Arrows",
                description: "Dynamic arrows that point to targets with distance-based scaling and rotation.",
                icon: "➡️"
              },
              {
                title: "Type-Safe API",
                description: "Full TypeScript support with typed options, events, and workflow schemas.",
                icon: "🛡️"
              },
              {
                title: "Framework Agnostic",
                description: "Works with React, Vue, Svelte, or vanilla JS. Import via ES modules or CDN.",
                icon: "🔧"
              }
            ].map((feature, index) => (
              <Card key={index} className="relative overflow-hidden border-0 bg-gradient-to-br from-background to-muted/20 hover:shadow-lg transition-all duration-300" data-tooltip={feature.tooltip}>
                <CardContent className="p-6 space-y-4">
                  <div className="text-3xl">{feature.icon}</div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
            <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl">
              Ready to get started?
            </h2>
            <p className="max-w-[600px] text-lg text-muted-foreground">
              Join the waitlist to be among the first to experience TipTour&apos;s full potential.
            </p>
            <WaitlistForm />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded-md bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500" />
              <span className="font-bold">TipTour</span>
            </div>
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built with ❤️ for modern web experiences.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/milind-soni/tip-tour"
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-tooltip="github"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}