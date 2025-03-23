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
import { Button } from "@/ui/core/Button";
import { Link } from "wouter";
import gsap from "gsap";

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
      linkText: "Edit Resume"
    },
    { 
      title: "Job Matching", 
      description: "Find suitable job matches", 
      progress: 75, 
      icon: <Target className="h-4 w-4 text-blue-400" />,
      link: "/job-finder",
      linkText: "Find More Matches"
    },
    { 
      title: "Applications", 
      description: "Submit job applications", 
      progress: 25, 
      icon: <Send className="h-4 w-4 text-purple-400" />,
      link: "/job-finder",
      linkText: "Apply to Jobs"
    },
    { 
      title: "Interviews", 
      description: "Prepare for interviews", 
      progress: 10, 
      icon: <MoveUpRight className="h-4 w-4 text-amber-400" />,
      link: "#",
      linkText: "Start Practice"
    },
    { 
      title: "Offer Acceptance", 
      description: "Receive and review offers", 
      progress: 0, 
      icon: <CheckCircle2 className="h-4 w-4 text-gray-400" />,
      link: "#",
      linkText: "Learn More"
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
    <Card className="cosmic-card overflow-hidden border border-white/10 bg-black/30" ref={cardRef}>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl text-white">Job Search Progress</CardTitle>
        <CardDescription className="text-gray-300">
          Track your career journey milestones
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6" ref={progressRef}>
        <div className="space-y-8">
          {milestones.map((milestone, index) => (
            <div key={index} className="progress-item">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="p-1.5 bg-blue-900/30 rounded-md">
                    {milestone.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">
                      {milestone.title}
                    </h4>
                    <p className="text-xs text-gray-400">{milestone.description}</p>
                  </div>
                </div>
                
                <div className="text-sm font-medium text-white">
                  {milestone.progress}%
                </div>
              </div>
              
              <div className="relative mt-2 mb-3">
                <div className="overflow-hidden h-1 text-xs flex rounded-full bg-gray-800">
                  <div 
                    className="progress-bar shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center origin-left"
                    style={{ 
                      width: `${milestone.progress}%`,
                      background: `linear-gradient(to right, #3b82f6, #8b5cf6)`,
                      opacity: milestone.progress === 0 ? 0.3 : 1,
                      transform: 'scaleX(1)'
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Link href={milestone.link}>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-6 text-xs px-2 text-blue-400 hover:text-blue-300 hover:bg-transparent"
                  >
                    {milestone.linkText}
                    <ArrowUpRight className="ml-1 h-3 w-3" />
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