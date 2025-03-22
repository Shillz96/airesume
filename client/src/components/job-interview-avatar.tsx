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
  level?: string; // e.g., Junior, Senior
  industry?: string; // e.g., Tech, Finance
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
  const [customJobLevel, setCustomJobLevel] = useState("");
  const [customIndustry, setCustomIndustry] = useState("");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const defaultJob: Job = {
    id: "default",
    title: "Software Engineer",
    company: "Tech Innovators Inc.",
    level: "Mid-level",
    industry: "Technology",
  };

  const activeJob: Job = job || {
    ...defaultJob,
    title: customJobTitle || defaultJob.title,
    company: customCompanyName || defaultJob.company,
    level: customJobLevel || defaultJob.level,
    industry: customIndustry || defaultJob.industry,
  };

  useEffect(() => {
    // Initial animation
    gsap.fromTo(titleRef.current, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" });
    gsap.fromTo(cardRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, delay: 0.4, ease: "power2.out" });
    gsap.fromTo(avatarRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, delay: 0.8, ease: "back.out" });

    // Generate initial questions
    if (!questions.length) regenerateQuestions();
  }, []);

  useEffect(() => {
    if (customJobTitle || customCompanyName || customJobLevel || customIndustry) {
      regenerateQuestions();
    }
  }, [customJobTitle, customCompanyName, customJobLevel, customIndustry]);

  const handleSpeak = () => {
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(questions[currentQuestion]);
    speechSynthesis.speak(utterance);
    utterance.onend = () => setIsSpeaking(false);
  };

  const handleSubmitResponse = async () => {
    if (!userResponse.trim()) return;

    setIsRegenerating(true);
    try {
      // Simulate AI feedback (replace with actual API call)
      const feedbackResponse = await generateFeedback(userResponse, questions[currentQuestion], activeJob);
      setFeedback(feedbackResponse);

      if (currentQuestion < questions.length - 1) {
        setTimeout(() => {
          setCurrentQuestion(currentQuestion + 1);
          setUserResponse("");
          setFeedback("");
        }, 3000);
      }
    } catch (err) {
      setError("Failed to generate feedback. Please try again.");
    } finally {
      setIsRegenerating(false);
    }
  };

  const regenerateQuestions = async () => {
    setIsRegenerating(true);
    setError(null);

    try {
      // Simulate API call to AI service (e.g., Grok API)
      const newQuestions = await fetchInterviewQuestions(activeJob);
      setQuestions(newQuestions);
      setCurrentQuestion(0);
      setUserResponse("");
      setFeedback("");
    } catch (err) {
      setError("Failed to generate questions. Using defaults.");
      setQuestions([
        `Tell me about your experience as a ${activeJob.title}.`,
        `What challenges have you faced in ${activeJob.industry} roles?`,
        `Why do you want to work at ${activeJob.company}?`,
      ]);
    } finally {
      setIsRegenerating(false);
    }
  };

  // Simulated AI service calls (replace with real API integration)
  const fetchInterviewQuestions = async (job: Job): Promise<string[]> => {
    // Example prompt for an AI like Grok
    const prompt = `Generate 3 unique, professional interview questions for a ${job.level} ${job.title} position at ${job.company} in the ${job.industry} industry.`;
    // Simulate API response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          `Can you describe a specific situation where you utilized your skills as a ${job.title} to solve a problem at a ${job.industry} company?`,
          `How do you stay updated with the latest trends in ${job.industry}, and how would you apply them at ${job.company}?`,
          `What unique value do you bring to ${job.company} as a ${job.level} ${job.title}?`,
        ]);
      }, 1000);
    });
  };

  const generateFeedback = async (response: string, question: string, job: Job): Promise<string> => {
    // Example prompt for feedback
    const prompt = `Analyze this response to the question "${question}" for a ${job.title} role: "${response}". Provide constructive feedback on clarity, relevance, and detail.`;
    // Simulate API response
    return new Promise((resolve) => {
      setTimeout(() => {
        if (response.length < 50) {
          resolve("Your response is too short. Provide more details and examples to demonstrate your expertise.");
        } else if (response.length > 500) {
          resolve("Your response is detailed but overly long. Aim for concise, focused answers (1-2 minutes when speaking).");
        } else {
          resolve("Well-structured response! It’s clear and relevant. Consider adding a specific example to strengthen it further.");
        }
      }, 500);
    });
  };

  const resetInterview = () => {
    setCurrentQuestion(0);
    setUserResponse("");
    setFeedback("");
    setError(null);
  };

  return (
    <div className="h-full flex flex-col">
      <h2 ref={titleRef} className="cosmic-page-title text-2xl flex items-center">
        <Bot className="mr-2 h-5 w-5 text-blue-400" />
        Interview Practice AI
      </h2>

      <Card className="cosmic-card border border-white/10 bg-black/30 mt-4 flex-1 flex flex-col hover:border-blue-500/50 transition-all duration-300" ref={cardRef}>
        <CardHeader className="pb-2 flex-shrink-0">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg text-white font-medium">Practice Session</CardTitle>
            <div className="flex space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="text-gray-400 border-gray-700 hover:text-blue-300">
                    <Settings className="h-3.5 w-3.5 mr-1" />
                    Customize
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 cosmic-card border-white/10 bg-black/30">
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
                    <div className="space-y-2">
                      <Label htmlFor="job-level">Job Level</Label>
                      <Input
                        id="job-level"
                        placeholder="e.g. Senior"
                        value={customJobLevel}
                        onChange={(e) => setCustomJobLevel(e.target.value)}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Input
                        id="industry"
                        placeholder="e.g. Technology"
                        value={customIndustry}
                        onChange={(e) => setCustomIndustry(e.target.value)}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <Button onClick={regenerateQuestions} className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                      <Zap className="h-3.5 w-3.5 mr-1" />
                      Generate Questions
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              <Button
                variant="outline"
                size="sm"
                className="text-gray-400 border-gray-700 hover:text-blue-300"
                onClick={regenerateQuestions}
                disabled={isRegenerating}
              >
                <RefreshCcw className={`h-3.5 w-3.5 mr-1 ${isRegenerating ? "animate-spin" : ""}`} />
                New Questions
              </Button>
            </div>
          </div>
          <CardDescription className="text-gray-300">
            Practice your interview skills for {activeJob.title} at {activeJob.company}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-4 flex-1 overflow-auto">
          {error && <p className="text-red-400">{error}</p>}
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
                ) : questions.length ? (
                  questions[currentQuestion]
                ) : (
                  "No questions available."
                )}
              </p>
              <Button
                onClick={handleSpeak}
                variant="outline"
                size="sm"
                className="text-blue-400 border-blue-800/50 hover:bg-blue-900/30"
                disabled={isRegenerating || !questions.length}
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
            disabled={isRegenerating || !questions.length}
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
            className="bg-gradient-to-r from-blue-600 to-purple-600"
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