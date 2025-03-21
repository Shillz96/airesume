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
import { RefreshCw, Mic, Play, Star, User, Bot, Send } from "lucide-react";
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
  const cardRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  
  const defaultJob = {
    id: "default",
    title: "Software Engineer",
    company: "Tech Innovators Inc."
  };
  
  const activeJob = job || defaultJob;
  
  const questions = [
    `Tell me about a time you used a key skill related to ${activeJob.title} roles.`,
    `How do you approach challenges in ${activeJob.title} positions?`,
    `Why are you interested in working as a ${activeJob.title} at ${activeJob.company}?`,
  ];

  useEffect(() => {
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

  return (
    <Card className="cosmic-card mb-8 overflow-hidden" ref={cardRef}>
      <CardHeader className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 pb-3">
        <CardTitle className="text-xl text-white flex items-center">
          <Bot className="mr-2 h-5 w-5 text-blue-400" />
          Interview Practice AI
        </CardTitle>
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
              {questions[currentQuestion]}
            </p>
            <Button 
              onClick={handleSpeak} 
              variant="outline"
              size="sm"
              className="text-blue-400 border-blue-800/50 hover:bg-blue-900/30 hover:text-blue-300"
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
          onClick={() => {
            setCurrentQuestion(0);
            setUserResponse("");
            setFeedback("");
          }}
          disabled={currentQuestion === 0 && !userResponse && !feedback}
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Reset
        </Button>
        
        <Button 
          onClick={handleSubmitResponse} 
          size="sm"
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
          disabled={!userResponse.trim()}
        >
          <Send className="h-3 w-3 mr-1" />
          Submit Response
        </Button>
      </CardFooter>
    </Card>
  );
}