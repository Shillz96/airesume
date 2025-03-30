import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Briefcase, Sparkles, Mic
} from 'lucide-react';
import { Button } from "@/components/ui/button"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Job } from "@/features/job/types";
import gsap from 'gsap';

interface EnhancedJobInterviewAvatarProps {
  job?: Job;
  className?: string;
}

const careerPathLabels: Record<string, string> = {
  software_engineering: 'Software Engineering',
  data_science: 'Data Science',
  design: 'Design',
  marketing: 'Marketing',
  sales: 'Sales',
  product_management: 'Product Management',
  finance: 'Finance',
  healthcare: 'Healthcare',
  education: 'Education',
  customer_service: 'Customer Service',
  general: 'General Career Path'
};

export default function EnhancedJobInterviewAvatar() {
  const [selectedCareerPath, setSelectedCareerPath] = useState<string>('general');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('intermediate');
  const [interviewStage, setInterviewStage] = useState('behavioral');
  
  const cardRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  
  // Animation effect
  useEffect(() => {
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: "power2.out" }
      );
    }
    
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.3, ease: "power2.out" }
      );
    }
  }, []);

  // Random interview tip
  const tipText = "Ask thoughtful questions about the role and company at the end of the interview.";
  
  // Start interview handler
  const startInterview = () => {
    console.log("Starting interview practice");
  };
  
  return (
    <div className="h-full flex flex-col">
      <div ref={cardRef}>
        <Card className="solid-card flex-1 flex flex-col rounded-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2 flex-shrink-0">
            <h2 
              ref={titleRef}
              className="text-2xl flex items-center mb-4"
            >
              <Briefcase className="mr-2 h-5 w-5 text-blue-400" />
              Interview Practice
            </h2>
            <CardTitle className="text-lg text-card-foreground font-medium no-blur">AI-Powered Interview Coach</CardTitle>
      </CardHeader>

          <CardContent className="p-4 flex-1 overflow-auto">
            <p className="text-sm text-muted-foreground no-blur mb-4">
          Practice interviews for your next job with our AI-powered coach.
        </p>
        
            <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="careerPath">Career Path</Label>
                <Select 
                  value={selectedCareerPath} 
                  onValueChange={(value) => setSelectedCareerPath(value)}
                >
                  <SelectTrigger id="careerPath" className="no-blur">
                <SelectValue placeholder="Select career path" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(careerPathLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input 
              id="jobTitle" 
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Software Engineer"
                  className="no-blur"
            />
          </div>
          
          <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input 
                  id="company" 
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Google"
                  className="no-blur"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="difficultyLevel">Difficulty</Label>
                  <Select 
                    value={difficultyLevel} 
                    onValueChange={(value) => setDifficultyLevel(value)}
                  >
                    <SelectTrigger id="difficultyLevel" className="no-blur">
                 <SelectValue placeholder="Select difficulty" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="basic">Basic</SelectItem>
                 <SelectItem value="intermediate">Intermediate</SelectItem>
                 <SelectItem value="advanced">Advanced</SelectItem>
               </SelectContent>
             </Select>
           </div>
           
           <div className="space-y-2">
                  <Label htmlFor="interviewStage">Stage</Label>
                  <Select 
                    value={interviewStage} 
                    onValueChange={(value) => setInterviewStage(value)}
                  >
                    <SelectTrigger id="interviewStage" className="no-blur">
                 <SelectValue placeholder="Select stage" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="screening">Screening</SelectItem>
                 <SelectItem value="technical">Technical</SelectItem>
                 <SelectItem value="behavioral">Behavioral</SelectItem>
                 <SelectItem value="final">Final</SelectItem>
               </SelectContent>
             </Select>
           </div>
        </div>

              <div className="space-y-4 mt-6">
                <h3 className="text-sm font-medium text-blue-400 mb-2 no-blur">Practice Questions</h3>
                
                <div className="solid-card rounded-lg p-4 transition-all hover:bg-white/20 dark:hover:bg-gray-800/30 hover:shadow-md">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-500/20 rounded-full mr-3">
                      <Mic className="h-5 w-5 text-blue-400" />
          </div>
                    <div className="no-blur">
                      <h4 className="text-sm font-medium text-card-foreground">Personalized Interview Practice</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        5 questions tailored for your career
                      </p>
                    </div>
                  </div>
        <Button 
                    variant="default" 
                    size="sm" 
                    className="mt-3 text-xs w-full"
          onClick={startInterview} 
        >
                    <Play className="h-4 w-4 mr-2" />
                    Start Practice
        </Button>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-blue-400 mb-2 no-blur">Interview Tip</h3>
                  <div className="solid-card rounded-lg p-4 shadow-md">
                    <div className="flex items-start">
                      <div className="p-2 bg-amber-500/20 rounded-full mr-3 mt-1">
                        <Sparkles className="h-4 w-4 text-amber-400" />
                      </div>
                      <div className="no-blur">
                        <h4 className="text-sm font-medium text-card-foreground">Tips for Better Answers</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {tipText}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
    </Card>
      </div>
    </div>
  );
}