import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import CosmicBackground from "@/components/cosmic-background";
import { 
  Rocket, 
  FileText, 
  Briefcase, 
  Star, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  ChevronRight,
  Bot,
  Search,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import gsap from "gsap";

export default function LandingPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  // Animation effects
  useEffect(() => {
    // Hero animations
    if (titleRef.current && subtitleRef.current && ctaRef.current) {
      const tl = gsap.timeline();
      
      tl.fromTo(
        titleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
      )
      .fromTo(
        subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" },
        "-=0.5"
      )
      .fromTo(
        ctaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
        "-=0.3"
      );
    }
    
    // Feature section animations
    if (featureRefs.current.length > 0) {
      gsap.fromTo(
        featureRefs.current,
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.7, 
          stagger: 0.15, 
          ease: "power2.out",
          scrollTrigger: {
            trigger: featureRefs.current[0],
            start: "top bottom-=100",
          }
        }
      );
    }
    
    // Create orbiting particles around the hero section
    const createParticle = () => {
      if (!heroRef.current) return;
      
      const particle = document.createElement('div');
      particle.className = 'cosmic-particle';
      
      // Random size
      const size = Math.random() * 4 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Random position around the perimeter
      const heroRect = heroRef.current.getBoundingClientRect();
      const centerX = heroRect.left + heroRect.width / 2;
      const centerY = heroRect.top + heroRect.height / 2;
      const radius = Math.max(heroRect.width, heroRect.height) * 0.7;
      const angle = Math.random() * Math.PI * 2;
      
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      
      document.body.appendChild(particle);
      
      // Animate in orbit
      gsap.to(particle, {
        duration: Math.random() * 15 + 15,
        rotation: 360,
        repeat: -1,
        ease: "none",
        motionPath: {
          path: [
            {x: x - centerX, y: y - centerY},
            {x: y - centerY, y: -(x - centerX)},
            {x: -(x - centerX), y: -(y - centerY)},
            {x: -(y - centerY), y: x - centerX},
            {x: x - centerX, y: y - centerY}
          ],
          curviness: 1.5,
          autoRotate: false
        },
        transformOrigin: "center center"
      });
      
      // Random opacity pulsing
      gsap.to(particle, {
        opacity: Math.random() * 0.5 + 0.3,
        duration: Math.random() * 2 + 1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      
      // Cleanup
      return () => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      };
    };
    
    // Create particles
    const cleanupFns: Array<() => void> = [];
    for (let i = 0; i < 20; i++) {
      const cleanup = createParticle();
      if (cleanup) cleanupFns.push(cleanup);
    }
    
    return () => {
      cleanupFns.forEach(fn => fn());
    };
  }, []);

  return (
    <div className="cosmic-page min-h-screen">
      <CosmicBackground />
      
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="flex items-center cosmic-text-gradient font-bold text-xl">
                <Rocket className="mr-2 h-5 w-5" />
                AIreHire
              </span>
            </div>
            <div className="hidden md:flex md:items-center md:space-x-6">
              <a href="#features" className="text-gray-300 hover:text-white text-sm font-medium transition-colors duration-200">
                Features
              </a>
              <a href="#pricing" className="text-gray-300 hover:text-white text-sm font-medium transition-colors duration-200">
                Pricing
              </a>
              <a href="#faq" className="text-gray-300 hover:text-white text-sm font-medium transition-colors duration-200">
                FAQ
              </a>
              <Button asChild variant="outline" size="sm" className="ml-3">
                <Link href="/auth?tab=login">Log in</Link>
              </Button>
              <Button asChild size="sm" className="ml-3">
                <Link href="/auth?tab=register">Sign up</Link>
              </Button>
            </div>
            <div className="md:hidden">
              <Button asChild variant="outline" size="sm">
                <Link href="/auth">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section 
        className="pt-32 pb-20 relative overflow-hidden" 
        ref={heroRef}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight"
              ref={titleRef}
            >
              <span className="cosmic-text-gradient">AI-Powered</span> Career Acceleration
            </h1>
            <p 
              className="mt-6 max-w-2xl mx-auto text-xl text-gray-300"
              ref={subtitleRef}
            >
              Create stunning resumes tailored to each job, discover your perfect career match, and land more interviews with our AI-powered platform.
            </p>
            <div 
              className="mt-10 flex justify-center gap-4"
              ref={ctaRef}
            >
              <Button asChild size="lg" className="px-8 py-6 text-lg cosmic-btn-glow">
                <Link href="/auth?tab=register">
                  Try for Free <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg">
                <a href="#pricing">View Plans</a>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl"></div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold cosmic-text-gradient">
              Supercharge Your Job Search
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Our AI tools help you stand out and land your dream job faster.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div 
              className="bg-card/60 backdrop-blur-lg border border-white/10 rounded-xl p-6 text-center"
              ref={el => featureRefs.current[0] = el}
            >
              <div className="flex justify-center mb-4">
                <div className="bg-blue-900/50 p-3 rounded-full cosmic-glow">
                  <FileText className="h-8 w-8 text-blue-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">AI Resume Builder</h3>
              <p className="text-gray-300">
                Create professional, ATS-optimized resumes with smart suggestions and templates tailored to your industry.
              </p>
              <ul className="mt-4 space-y-2 text-left">
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-400 mr-2" />
                  <span className="text-sm text-gray-300">Smart content suggestions</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-400 mr-2" />
                  <span className="text-sm text-gray-300">Multiple design templates</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-400 mr-2" />
                  <span className="text-sm text-gray-300">Keyword optimization</span>
                </li>
              </ul>
            </div>
            
            {/* Feature 2 */}
            <div 
              className="bg-card/60 backdrop-blur-lg border border-white/10 rounded-xl p-6 text-center"
              ref={el => featureRefs.current[1] = el}
            >
              <div className="flex justify-center mb-4">
                <div className="bg-purple-900/50 p-3 rounded-full cosmic-glow">
                  <Briefcase className="h-8 w-8 text-purple-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Smart Job Matching</h3>
              <p className="text-gray-300">
                Discover jobs that match your skills and experience with our intelligent job recommendation engine.
              </p>
              <ul className="mt-4 space-y-2 text-left">
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-400 mr-2" />
                  <span className="text-sm text-gray-300">Personalized job recommendations</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-400 mr-2" />
                  <span className="text-sm text-gray-300">Match percentage indicators</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-400 mr-2" />
                  <span className="text-sm text-gray-300">One-click applications</span>
                </li>
              </ul>
            </div>
            
            {/* Feature 3 */}
            <div 
              className="bg-card/60 backdrop-blur-lg border border-white/10 rounded-xl p-6 text-center"
              ref={el => featureRefs.current[2] = el}
            >
              <div className="flex justify-center mb-4">
                <div className="bg-cyan-900/50 p-3 rounded-full cosmic-glow">
                  <Bot className="h-8 w-8 text-cyan-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">AI Career Assistant</h3>
              <p className="text-gray-300">
                Get personalized guidance and feedback from our AI assistant to improve your job search strategy.
              </p>
              <ul className="mt-4 space-y-2 text-left">
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-400 mr-2" />
                  <span className="text-sm text-gray-300">Resume improvement suggestions</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-400 mr-2" />
                  <span className="text-sm text-gray-300">Cover letter generation</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-400 mr-2" />
                  <span className="text-sm text-gray-300">Interview preparation help</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* More features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {/* Feature 4 */}
            <div 
              className="bg-card/60 backdrop-blur-lg border border-white/10 rounded-xl p-6 text-center"
              ref={el => featureRefs.current[3] = el}
            >
              <div className="flex justify-center mb-4">
                <div className="bg-amber-900/50 p-3 rounded-full cosmic-glow">
                  <Zap className="h-8 w-8 text-amber-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">One-Click Tailoring</h3>
              <p className="text-gray-300">
                Instantly tailor your resume to match specific job descriptions and increase your chance of getting hired.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div 
              className="bg-card/60 backdrop-blur-lg border border-white/10 rounded-xl p-6 text-center"
              ref={el => featureRefs.current[4] = el}
            >
              <div className="flex justify-center mb-4">
                <div className="bg-green-900/50 p-3 rounded-full cosmic-glow">
                  <Search className="h-8 w-8 text-green-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">ATS Optimization</h3>
              <p className="text-gray-300">
                Ensure your resume passes through Applicant Tracking Systems with our keyword and format optimization.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div 
              className="bg-card/60 backdrop-blur-lg border border-white/10 rounded-xl p-6 text-center"
              ref={el => featureRefs.current[5] = el}
            >
              <div className="flex justify-center mb-4">
                <div className="bg-pink-900/50 p-3 rounded-full cosmic-glow">
                  <Sparkles className="h-8 w-8 text-pink-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Career Progress Tracking</h3>
              <p className="text-gray-300">
                Monitor your job search progress, track applications, and visualize your career growth over time.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold cosmic-text-gradient">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Choose the plan that fits your needs. All plans include our core features.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <Card className="bg-card/60 backdrop-blur-lg border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Free</CardTitle>
                    <CardDescription>Get started with basic features</CardDescription>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold">$0</span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <span>1 Resume</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <span>Basic AI suggestions</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <span>5 Job applications/month</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <span>Standard templates</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href="/auth?tab=register">Get Started</Link>
                </Button>
              </CardFooter>
            </Card>
            
            {/* Starter Plan */}
            <Card className="bg-card/60 backdrop-blur-lg border-blue-400/30 relative">
              <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-3 py-1 rounded-bl-lg rounded-tr-lg font-medium">
                POPULAR
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Starter</CardTitle>
                    <CardDescription>Essentials for job seekers</CardDescription>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold">$9.99</span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <span>3 Resumes</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <span>Advanced AI suggestions</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <span>Unlimited job applications</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <span>ATS optimization</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <span>Job match recommendations</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <span>Application tracking</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild size="lg" className="w-full cosmic-btn-glow">
                  <Link href="/auth?tab=register&plan=starter">Get Started</Link>
                </Button>
              </CardFooter>
            </Card>
            
            {/* Pro Plan */}
            <Card className="bg-card/60 backdrop-blur-lg border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Professional</CardTitle>
                    <CardDescription>Advanced career toolkit</CardDescription>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold">$19.99</span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <span>Everything in Starter</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <span>Unlimited resumes</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <span>Premium templates</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <span>Cover letter generation</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <span>LinkedIn profile optimization</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <span>Interview preparation tool</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <span>Priority support</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild variant="default" size="lg" className="w-full">
                  <Link href="/auth?tab=register&plan=pro">Get Started</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section id="faq" className="py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold cosmic-text-gradient">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Find answers to common questions about our service.
            </p>
          </div>
          
          <div className="space-y-6">
            {/* FAQ Item 1 */}
            <div className="bg-card/60 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                How does the AI resume builder work?
              </h3>
              <p className="text-gray-300">
                Our AI resume builder analyzes your experience and skills to suggest impactful content tailored to your industry. It helps optimize your resume for ATS systems and provides real-time suggestions to improve your job applications.
              </p>
            </div>
            
            {/* FAQ Item 2 */}
            <div className="bg-card/60 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                Can I cancel my subscription at any time?
              </h3>
              <p className="text-gray-300">
                Yes, you can cancel your subscription at any time. Your benefits will continue until the end of your current billing period, and you won't be charged again afterward.
              </p>
            </div>
            
            {/* FAQ Item 3 */}
            <div className="bg-card/60 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                How accurate is the job matching feature?
              </h3>
              <p className="text-gray-300">
                Our job matching algorithm analyzes your skills, experience, and preferences against thousands of job postings to find the best matches. It continuously improves as you use the platform and provide feedback on job suggestions.
              </p>
            </div>
            
            {/* FAQ Item 4 */}
            <div className="bg-card/60 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                Can I use AIreHire on multiple devices?
              </h3>
              <p className="text-gray-300">
                Yes, AIreHire is a cloud-based platform that you can access from any device with a web browser. Your data is securely stored and synchronized across all your devices, allowing you to manage your job search from anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-white/10 rounded-xl p-8 md:p-12 backdrop-blur-lg">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Launch Your Career?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of job seekers who've found their dream careers using AIreHire's AI-powered platform.
              </p>
              <Button asChild size="lg" className="px-8 py-6 text-lg cosmic-btn-glow">
                <Link href="/auth?tab=register">
                  Start Your Free Trial <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-white/10 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Rocket className="mr-2 h-5 w-5 text-blue-400" />
                <span className="font-bold text-lg cosmic-text-gradient">AIreHire</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered career acceleration platform helping job seekers land their dream jobs faster.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white text-sm transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white text-sm transition-colors">Pricing</a></li>
                <li><a href="#faq" className="text-gray-400 hover:text-white text-sm transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Career Tips</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Resume Templates</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} AIreHire. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Custom styles for this page */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .cosmic-text-gradient {
          background: linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
          display: inline;
        }
        
        .cosmic-btn-glow {
          box-shadow: 0 0 15px 5px rgba(139, 92, 246, 0.3);
          transition: box-shadow 0.3s ease;
        }
        
        .cosmic-btn-glow:hover {
          box-shadow: 0 0 20px 8px rgba(139, 92, 246, 0.4);
        }
        
        .cosmic-particle {
          position: absolute;
          width: 3px;
          height: 3px;
          background: white;
          border-radius: 50%;
          opacity: 0.6;
          z-index: 5;
        }
        `
      }} />
    </div>
  );
}