import React, { useState, useEffect } from 'react';
import { Button } from '@/ui/core/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/ui/core/Card';
import { Play, Send, Mic, Pause, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Job {
  id: string;
  title: string;
  company: string;
  level?: string; // e.g., Junior, Senior
  industry?: string; // e.g., Tech, Finance
}

interface JobInterviewAvatarProps {
  job?: Job;
}

export default function JobInterviewAvatar({ job }: JobInterviewAvatarProps) {
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [userResponse, setUserResponse] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Default job for demonstration if none provided
  const defaultJob: Job = {
    id: '1',
    title: 'Software Engineer',
    company: 'Tech Solutions Inc.',
    level: 'Mid-level',
    industry: 'Tech'
  };
  
  const activeJob: Job = job || {
    id: '1',
    title: 'Software Engineer',
    company: 'Tech Solutions Inc.',
    level: 'Mid-level',
    industry: 'Tech'
  };
  
  useEffect(() => {
    // Load interview questions when component mounts or job changes
    fetchInterviewQuestions(activeJob)
      .then(questions => {
        setQuestions(questions);
        setCurrentQuestionIndex(0);
        setUserResponse('');
        setFeedback('');
        setShowFeedback(false);
      });
  }, [job?.id]);
  
  const fetchInterviewQuestions = async (job: Job): Promise<string[]> => {
    // In a production app, this would be an API call to get real questions
    // For demonstration, we'll use predefined questions based on job type
    if (job.title.toLowerCase().includes('software') || job.title.toLowerCase().includes('developer')) {
      return [
        `Tell me about a complex technical problem you've solved recently.`,
        `How do you stay updated with the latest technologies in your field?`,
        `Describe a situation where you had to make a trade-off between perfect code and meeting a deadline.`,
        `How would you explain a complex technical concept to a non-technical stakeholder?`,
        `What's your experience working with Agile methodologies?`
      ];
    } else if (job.title.toLowerCase().includes('manager') || job.title.toLowerCase().includes('lead')) {
      return [
        `Tell me about a time you had to resolve a conflict within your team.`,
        `How do you prioritize tasks when managing multiple projects?`,
        `Describe your leadership style and how you adapt it to different team members.`,
        `How do you measure success for your team?`,
        `Tell me about a time you had to deliver difficult feedback to a team member.`
      ];
    } else {
      return [
        `Why are you interested in this role at ${job.company}?`,
        `Tell me about your most relevant experience for this position.`,
        `How do you handle tight deadlines and pressure?`,
        `Describe a challenge you faced in your previous role and how you overcame it.`,
        `Where do you see yourself professionally in the next 3-5 years?`
      ];
    }
  };
  
  const startInterview = () => {
    setIsPlaying(true);
    setIsPaused(false);
    setUserResponse('');
    setFeedback('');
    setShowFeedback(false);
  };
  
  const pauseInterview = () => {
    setIsPaused(true);
  };
  
  const resumeInterview = () => {
    setIsPaused(false);
  };
  
  const resetInterview = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentQuestionIndex(0);
    setUserResponse('');
    setFeedback('');
    setShowFeedback(false);
  };
  
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserResponse('');
      setFeedback('');
      setShowFeedback(false);
    } else {
      // End of interview
      setIsPlaying(false);
    }
  };
  
  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setUserResponse('');
      setFeedback('');
      setShowFeedback(false);
    }
  };
  
  const submitResponse = async () => {
    if (!userResponse.trim()) return;
    
    setIsLoading(true);
    try {
      const feedbackText = await generateFeedback(userResponse, questions[currentQuestionIndex], activeJob);
      setFeedback(feedbackText);
      setShowFeedback(true);
    } catch (error) {
      console.error('Error generating feedback:', error);
      setFeedback('Unable to generate feedback at this time. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateFeedback = async (response: string, question: string, job: Job): Promise<string> => {
    // In a production app, this would be an API call to get AI-generated feedback
    // For demonstration, we'll use predefined feedback
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple feedback generation based on response length and content
        if (response.length < 50) {
          resolve(`Your answer was quite brief. Consider elaborating more on your experience and providing specific examples related to ${job.title} roles.`);
        } else if (response.includes('experience') || response.includes('project')) {
          resolve(`Good job mentioning your experience! Your answer shows relevant background for this ${job.title} position. Consider also mentioning how you'd apply these skills at ${job.company}.`);
        } else {
          resolve(`Your answer addresses the question, but try to be more specific about your experiences relevant to the ${job.title} role. Quantifying your achievements and relating them to ${job.company}'s industry (${job.industry}) would strengthen your response.`);
        }
      }, 1000); // Simulate API delay
    });
  };
  
  if (!isPlaying) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
              <Mic className="h-5 w-5" />
            </span>
            Interview Practice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Prepare for your interview at {activeJob.company} for the {activeJob.title} position with our AI-powered interview simulator.
          </p>
          <div className="space-y-4">
            <div className="flex items-center p-3 border border-border rounded-md bg-muted/30">
              <div className="mr-3 h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Mic className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-medium">AI Interview Coach</h4>
                <p className="text-xs text-muted-foreground">5 customized questions for {activeJob.title}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={startInterview}
            iconLeft={<Play className="h-4 w-4" />}
            fullWidth
          >
            Start Interview Practice
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center">
            <span className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-2">
              <Mic className="h-4 w-4" />
            </span>
            Interview Question {currentQuestionIndex + 1}/{questions.length}
          </div>
          <div className="flex space-x-2">
            {isPaused ? (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={resumeInterview} 
                iconLeft={<Play className="h-4 w-4" />}
              >
                Resume
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={pauseInterview} 
                iconLeft={<Pause className="h-4 w-4" />}
              >
                Pause
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={resetInterview} 
              iconLeft={<RotateCcw className="h-4 w-4" />}
            >
              Reset
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className={cn(
          "p-4 border rounded-md",
          showFeedback ? "border-muted bg-muted/30" : "border-primary/30 bg-primary/5"
        )}>
          <h3 className="font-medium mb-2">{questions[currentQuestionIndex]}</h3>
          <p className="text-sm text-muted-foreground">
            Answer as if you were in a real interview for the {activeJob.title} position at {activeJob.company}.
          </p>
        </div>
        
        {!showFeedback ? (
          <div className="space-y-3">
            <textarea
              className="w-full p-3 min-h-[150px] border border-border rounded-md bg-background focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
              placeholder="Type your answer here..."
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              disabled={isPaused}
            />
            
            <div className="flex justify-end">
              <Button
                onClick={submitResponse}
                disabled={!userResponse.trim() || isLoading || isPaused}
                isLoading={isLoading}
                loadingText="Analyzing..."
                iconRight={<Send className="h-4 w-4" />}
              >
                Submit Answer
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 border border-border rounded-md bg-background">
              <h4 className="text-sm font-medium mb-2">Your Answer:</h4>
              <p className="text-sm text-muted-foreground">{userResponse}</p>
            </div>
            
            <div className="p-4 border border-primary/30 rounded-md bg-primary/5">
              <h4 className="text-sm font-medium flex items-center mb-2">
                <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-2">
                  <Mic className="h-3 w-3" />
                </span>
                Interview Feedback:
              </h4>
              <p className="text-sm">{feedback}</p>
            </div>
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Previous Question
              </Button>
              
              <Button
                onClick={nextQuestion}
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Interview'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}