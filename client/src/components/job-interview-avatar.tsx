import { useState, useRef, useEffect } from "react";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle,
  CardFooter,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { RefreshCw, Play, Star, Bot, Send, Settings, RefreshCcw, Zap } from "lucide-react";
import gsap from "gsap";

interface Job {
  id: string;
  title: string;
  company: string;
}

interface JobInterviewAvatarProps {
  job?: Job;
}

export default function JobInterviewAvatar({ job }: JobInterviewAvatarProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userResponse, setUserResponse] = useState("");
  const [feedback, setFeedback] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [customJobTitle, setCustomJobTitle] = useState("");
  const [customCompanyName, setCustomCompanyName] = useState("");
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  
  const defaultJob = {
    id: "default",
    title: "Software Engineer",
    company: "Tech Innovators Inc."
  };
  
  const activeJob = job || {
    ...defaultJob,
    title: customJobTitle || defaultJob.title,
    company: customCompanyName || defaultJob.company
  };
  
  const defaultQuestions = [
    `Tell me about a time you used a key skill related to ${activeJob.title} roles.`,
    `How do you approach challenges in ${activeJob.title} positions?`,
    `Why are you interested in working as a ${activeJob.title} at ${activeJob.company}?`,
  ];
  
  const [questions, setQuestions] = useState(defaultQuestions);

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
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, delay: 0.4, ease: "power2.out" }
      );
    }
    
    if (avatarRef.current) {
      gsap.fromTo(
        avatarRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, delay: 0.8, ease: "back.out" }
      );
    }
  }, []);

  // Update questions when job title or company is changed
  useEffect(() => {
    if (customJobTitle || customCompanyName) {
      regenerateQuestions();
    }
  }, [customJobTitle, customCompanyName]);

  const handleSpeak = () => {
    setIsSpeaking(true);
    setTimeout(() => setIsSpeaking(false), 2000);
  };

  const handleSubmitResponse = () => {
    if (!userResponse.trim()) return;
    
    // Set feedback based on response length
    if (userResponse.length < 50) {
      setFeedback("Your answer is too brief. Try to provide more specific examples and details.");
    } else if (userResponse.length > 500) {
      setFeedback("Good answer, but try to be more concise. Aim for 1-2 minutes when speaking.");
    } else {
      setFeedback("Good answer! You provided a balanced response with relevant details.");
    }
    
    // Move to next question if available
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setUserResponse("");
        setFeedback("");
      }, 3000);
    }
  };
  
  const regenerateQuestions = () => {
    setIsRegenerating(true);
    
    // In a real app, this would call an AI service
    // For now, we'll simulate with a timeout and use template strings
    setTimeout(() => {
      const jobTitle = customJobTitle || activeJob.title;
      const company = customCompanyName || activeJob.company;
      
      const newQuestions = [
        `Tell me about your experience with ${jobTitle} technologies and how you've applied them in previous roles.`,
        `Describe a challenging project you worked on as a ${jobTitle} and how you overcame obstacles.`,
        `What interests you most about the ${jobTitle} position at ${company} and how do you see yourself contributing?`,
      ];
      
      setQuestions(newQuestions);
      setIsRegenerating(false);
      setFeedback("");
      setUserResponse("");
    }, 1500);
  };
  
  const resetInterview = () => {
    setCurrentQuestion(0);
    setUserResponse("");
    setFeedback("");
  };

  return (
    <div>
      <h2 
        ref={titleRef}
        className="cosmic-page-title text-2xl flex items-center"
      >
        <Bot className="mr-2 h-5 w-5 text-blue-400" />
        Interview Practice AI
      </h2>
      
      <Card className="cosmic-card mt-4" ref={cardRef}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg text-white font-medium">Practice Session</CardTitle>
            
            <div className="flex space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-gray-400 border-gray-700 hover:text-blue-300 hover:border-blue-500/50"
                  >
                    <Settings className="h-3.5 w-3.5 mr-1" />
                    Customize
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 cosmic-card border-white/10">
                  <div className="space-y-4">
                    <h3 className="font-medium text-white">Interview Settings</h3>
                    <div className="space-y-2">
                      <Label htmlFor="job-title">Job Title</Label>
                      <Input
                        id="job-title"
                        placeholder="e.g. Software Engineer"
                        value={customJobTitle}
                        onChange={(e) => setCustomJobTitle(e.target.value)}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company-name">Company Name</Label>
                      <Input
                        id="company-name"
                        placeholder="e.g. Tech Innovators Inc."
                        value={customCompanyName}
                        onChange={(e) => setCustomCompanyName(e.target.value)}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <Button 
                      onClick={regenerateQuestions}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Zap className="h-3.5 w-3.5 mr-1" />
                      Generate Questions
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              
              <Button 
                variant="outline" 
                size="sm"
                className="text-gray-400 border-gray-700 hover:text-blue-300 hover:border-blue-500/50"
                onClick={regenerateQuestions}
                disabled={isRegenerating}
              >
                <RefreshCcw className={`h-3.5 w-3.5 mr-1 ${isRegenerating ? 'animate-spin' : ''}`} />
                New Questions
              </Button>
            </div>
          </div>
          <CardDescription className="text-gray-300">
            Practice your interview skills for {activeJob.title} positions
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div 
              ref={avatarRef}
              className={`w-16 h-16 rounded-full bg-gradient-to-r from-blue-600/30 to-purple-600/30 border border-white/10 flex items-center justify-center ${
                isSpeaking ? "cosmic-avatar-pulse shadow-lg shadow-blue-500/20" : ""
              }`}
            >
              <Bot className="h-8 w-8 text-blue-400" />
            </div>
            
            <div className="flex-1">
              <p className="text-white font-medium mb-2 text-lg">
                {isRegenerating ? (
                  <span className="inline-flex items-center">
                    <RefreshCw className="h-3.5 w-3.5 mr-2 animate-spin text-blue-400" />
                    Generating new questions...
                  </span>
                ) : (
                  questions[currentQuestion]
                )}
              </p>
              <Button 
                onClick={handleSpeak} 
                variant="outline"
                size="sm"
                className="text-blue-400 border-blue-800/50 hover:bg-blue-900/30 hover:text-blue-300"
                disabled={isRegenerating}
              >
                <Play className="h-3 w-3 mr-1" />
                Hear Question
              </Button>
            </div>
          </div>
          
          <Textarea
            className="min-h-[100px] bg-white/5 border-white/10 text-white"
            value={userResponse}
            onChange={(e) => setUserResponse(e.target.value)}
            placeholder="Type your response here..."
            disabled={isRegenerating}
          />
          
          {feedback && (
            <div className="p-3 bg-white/5 rounded-lg border border-white/10">
              <h4 className="text-sm font-medium flex items-center text-amber-400 mb-1">
                <Star className="h-4 w-4 mr-1 text-amber-400" />
                AI Feedback
              </h4>
              <p className="text-sm text-gray-300">{feedback}</p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="p-4 bg-white/5 border-t border-white/10 flex justify-between">
          <Button 
            variant="outline" 
            size="sm"
            className="text-gray-400 border-gray-700 hover:text-gray-300"
            onClick={resetInterview}
            disabled={(currentQuestion === 0 && !userResponse && !feedback) || isRegenerating}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Reset
          </Button>
          
          <Button 
            onClick={handleSubmitResponse} 
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={!userResponse.trim() || isRegenerating}
          >
            <Send className="h-3 w-3 mr-1" />
            Submit Response
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}