import { useRef, useEffect } from "react";
import { 
  Card, 
  CardHeader,
  CardContent, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowUpRight, 
  FileCheck, 
  MoveUpRight, 
  Send, 
  CheckCircle2, 
  Target 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import gsap from "gsap";
import { cn } from "@/lib/utils";

/**
 * JobSearchProgress component displays a visual representation of the user's
 * progress through the job search process with animated milestones
 */
export default function JobSearchProgress() {
  const cardRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  
  // Different milestone stages in job search process
  const milestones = [
    { 
      title: "Resume Creation", 
      description: "Create a professional resume", 
      progress: 100, 
      icon: <FileCheck className="h-4 w-4 text-teal-400" />,
      link: "/resume-builder",
      linkText: "Edit Resume",
      color: "from-teal-500 to-green-400"
    },
    { 
      title: "Job Matching", 
      description: "Find suitable job matches", 
      progress: 75, 
      icon: <Target className="h-4 w-4 text-blue-400" />,
      link: "/job-finder",
      linkText: "Find More Matches",
      color: "from-blue-500 to-indigo-400"
    },
    { 
      title: "Applications", 
      description: "Submit job applications", 
      progress: 25, 
      icon: <Send className="h-4 w-4 text-purple-400" />,
      link: "/job-finder",
      linkText: "Apply to Jobs",
      color: "from-purple-500 to-violet-400"
    },
    { 
      title: "Interviews", 
      description: "Prepare for interviews", 
      progress: 10, 
      icon: <MoveUpRight className="h-4 w-4 text-amber-400" />,
      link: "#",
      linkText: "Start Practice",
      color: "from-amber-500 to-orange-400"
    },
    { 
      title: "Offer Acceptance", 
      description: "Receive and review offers", 
      progress: 0, 
      icon: <CheckCircle2 className="h-4 w-4 text-gray-400" />,
      link: "#",
      linkText: "Learn More",
      color: "from-gray-500 to-gray-400"
    }
  ];
  
  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.3, ease: "power2.out" }
      );
    }
    
    if (progressRef.current) {
      const progressItems = progressRef.current.querySelectorAll('.progress-item');
      
      gsap.fromTo(
        progressItems,
        { x: -20, opacity: 0 },
        { 
          x: 0, 
          opacity: 1, 
          duration: 0.5,
          stagger: 0.15,
          ease: "power2.out",
          delay: 0.5
        }
      );
      
      gsap.fromTo(
        progressRef.current.querySelectorAll('.progress-bar'),
        { scaleX: 0 },
        { 
          scaleX: 1, 
          duration: 1.2,
          stagger: 0.2,
          ease: "power2.inOut",
          delay: 0.7
        }
      );
    }
  }, []);
  
  return (
    <Card className="solid-card shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg" ref={cardRef}>
      <CardHeader className="pb-0">
        <CardTitle className="text-lg no-blur">Job Search Progress</CardTitle>
        <CardDescription className="text-sm text-gray-400 no-blur">Track your progress through the job search process</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 py-2">
          {milestones.map((milestone, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {milestone.icon}
                  <span className="text-sm font-medium no-blur">{milestone.title}</span>
                </div>
                <div className="text-sm text-gray-400 no-blur">{milestone.progress}%</div>
              </div>
              
              <div className="relative">
                <Progress value={milestone.progress} className="h-2" />
                <div className={`absolute top-0 left-0 right-0 bottom-0 overflow-hidden pointer-events-none`}>
                  <div 
                    className={`h-2 bg-gradient-to-r ${milestone.color} opacity-60 w-full transform -translate-x-full animate-pulse`}
                    style={{animation: `progress-pulse 2s ease-in-out infinite ${index * 0.5}s`}}  
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500 no-blur">{milestone.description}</div>
                <Link href={milestone.link}>
                  <Button variant="link" size="sm" className="text-xs p-0 h-auto no-blur">
                    {milestone.linkText}
                    <ArrowUpRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}