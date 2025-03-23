import { useState, useEffect, useRef } from 'react';
import { 
  Mic, Play, Pause, RotateCcw, ArrowRight, ArrowLeft, 
  Send, ChevronDown, Briefcase, Sparkles, BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/ui/core/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/ui/core/Card';
import { CareerPath } from '@/features/career/types';
import { useToast } from '@/hooks/use-toast';

// Basic UI components - we'll customize these since not all shadcn components may be available
const Textarea = ({ 
  id, value, onChange, placeholder, className, disabled, ref 
}: any) => (
  <textarea
    id={id}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    disabled={disabled}
    ref={ref}
  />
);

const Label = ({ htmlFor, className, children }: any) => (
  <label
    htmlFor={htmlFor}
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
  >
    {children}
  </label>
);

// Simple select component
const Select = ({ value, onValueChange, children }: any) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      >
        {children}
      </select>
      <div className="absolute right-3 top-2.5 pointer-events-none">
        <ChevronDown className="h-4 w-4 opacity-50" />
      </div>
    </div>
  );
};

const SelectTrigger = ({ id, className, children }: any) => (
  <div id={id} className={`flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}>
    {children}
  </div>
);

const SelectValue = ({ placeholder }: any) => <span>{placeholder}</span>;

const SelectContent = ({ children }: any) => (
  <div className="relative mt-1 max-h-60 overflow-auto rounded-md bg-popover p-1 text-popover-foreground shadow-md">
    {children}
  </div>
);

const SelectItem = ({ value, children }: any) => (
  <option value={value}>{children}</option>
);

// Simple Popover components
const Popover = ({ children }: any) => (
  <div className="relative inline-block">{children}</div>
);

const PopoverTrigger = ({ asChild, children }: any) => (
  <div className="inline-block">{children}</div>
);

const PopoverContent = ({ className, align, children }: any) => (
  <div className={`absolute z-50 w-72 rounded-md border bg-popover p-4 shadow-md outline-none ${align === 'end' ? 'right-0' : 'left-0'} ${className}`}>
    {children}
  </div>
);

// Simplified tooltip components
const TooltipProvider = ({ children }: any) => <>{children}</>;
const Tooltip = ({ children }: any) => <>{children}</>;
const TooltipTrigger = ({ asChild, children }: any) => <>{children}</>;
const TooltipContent = ({ children }: any) => (
  <div className="z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95">
    {children}
  </div>
);

interface Job {
  id: string;
  title: string;
  company: string;
  level?: string;
  industry?: string;
}

interface EnhancedJobInterviewAvatarProps {
  job?: Job;
  className?: string;
}

// Map our career paths to readable names
const careerPathLabels: Record<CareerPath, string> = {
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

export default function EnhancedJobInterviewAvatar({ job, className }: EnhancedJobInterviewAvatarProps) {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [userResponse, setUserResponse] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedCareerPath, setSelectedCareerPath] = useState<CareerPath>('general');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState<'basic' | 'intermediate' | 'advanced'>('intermediate');
  const [interviewStage, setInterviewStage] = useState<'screening' | 'technical' | 'behavioral' | 'final'>('behavioral');
  
  const responseRef = useRef<HTMLTextAreaElement>(null);
  
  // Default job for demonstration if none provided
  const defaultJob: Job = {
    id: '1',
    title: 'Professional',
    company: 'Your Target Company',
    level: 'Mid-level',
    industry: 'General'
  };
  
  const activeJob: Job = job || defaultJob;
  
  useEffect(() => {
    if (job) {
      setJobTitle(job.title);
      setCompany(job.company);
      
      // Attempt to determine career path from job title
      if (job.title.toLowerCase().includes('software') || job.title.toLowerCase().includes('developer') || job.title.toLowerCase().includes('engineer')) {
        setSelectedCareerPath('software_engineering');
      } else if (job.title.toLowerCase().includes('data') || job.title.toLowerCase().includes('analytics')) {
        setSelectedCareerPath('data_science');
      } else if (job.title.toLowerCase().includes('design')) {
        setSelectedCareerPath('design');
      } else if (job.title.toLowerCase().includes('market')) {
        setSelectedCareerPath('marketing');
      } else if (job.title.toLowerCase().includes('sales')) {
        setSelectedCareerPath('sales');
      } else if (job.title.toLowerCase().includes('product')) {
        setSelectedCareerPath('product_management');
      } else if (job.title.toLowerCase().includes('finance') || job.title.toLowerCase().includes('account')) {
        setSelectedCareerPath('finance');
      } else if (job.title.toLowerCase().includes('health') || job.title.toLowerCase().includes('nurs') || job.title.toLowerCase().includes('doctor')) {
        setSelectedCareerPath('healthcare');
      } else if (job.title.toLowerCase().includes('teach') || job.title.toLowerCase().includes('education')) {
        setSelectedCareerPath('education');
      } else if (job.title.toLowerCase().includes('customer') || job.title.toLowerCase().includes('support') || job.title.toLowerCase().includes('service')) {
        setSelectedCareerPath('customer_service');
      }
    }
  }, [job]);
  
  useEffect(() => {
    // Generate new questions when career path, job title, or interview settings change
    const newQuestions = generateInterviewQuestions(selectedCareerPath, jobTitle, company, difficultyLevel, interviewStage);
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setUserResponse('');
    setFeedback('');
    setShowFeedback(false);
  }, [selectedCareerPath, jobTitle, company, difficultyLevel, interviewStage]);
  
  const generateInterviewQuestions = (
    careerPath: CareerPath, 
    jobTitle: string, 
    company: string,
    difficulty: 'basic' | 'intermediate' | 'advanced',
    stage: 'screening' | 'technical' | 'behavioral' | 'final'
  ): string[] => {
    // Common questions that apply to all paths
    const commonQuestions = [
      `Why are you interested in this ${jobTitle} role at ${company}?`,
      `Tell me about your most relevant experience for this position.`,
      `How do you handle tight deadlines and pressure?`,
      `Describe a challenge you faced in your previous role and how you overcame it.`,
      `Where do you see yourself professionally in the next 3-5 years?`
    ];
    
    // Career-specific questions
    let careerSpecificQuestions: string[] = [];
    
    switch (careerPath) {
      case 'software_engineering':
        careerSpecificQuestions = [
          `Tell me about a complex technical problem you've solved recently.`,
          `How do you stay updated with the latest technologies in your field?`,
          `Describe your approach to code reviews and quality assurance.`,
          `How would you explain a complex technical concept to a non-technical stakeholder?`,
          `Describe your experience with continuous integration and deployment.`
        ];
        break;
      case 'data_science':
        careerSpecificQuestions = [
          `Explain a data analysis project you've worked on and the insights you discovered.`,
          `How do you validate the accuracy of your data models?`,
          `Describe your experience with big data technologies.`,
          `How do you communicate data findings to non-technical team members?`,
          `What's your approach to handling missing or inconsistent data?`
        ];
        break;
      case 'design':
        careerSpecificQuestions = [
          `Walk me through your design process from concept to delivery.`,
          `How do you incorporate user feedback into your designs?`,
          `Tell me about a design project that didn't go as planned and what you learned.`,
          `How do you balance aesthetics with functionality?`,
          `Describe how you collaborate with developers to implement your designs.`
        ];
        break;
      case 'marketing':
        careerSpecificQuestions = [
          `Describe a successful marketing campaign you've led or contributed to.`,
          `How do you measure the success of marketing initiatives?`,
          `How do you stay current with digital marketing trends?`,
          `Tell me about your experience with content marketing and SEO.`,
          `How would you approach marketing to a new demographic?`
        ];
        break;
      case 'sales':
        careerSpecificQuestions = [
          `Describe your sales process from prospecting to closing.`,
          `How do you handle rejection and maintain motivation?`,
          `Tell me about a difficult client you won over.`,
          `How do you prioritize your sales pipeline?`,
          `What CRM tools have you used, and how did they enhance your sales process?`
        ];
        break;
      case 'product_management':
        careerSpecificQuestions = [
          `How do you prioritize product features?`,
          `Describe how you gather and incorporate user feedback.`,
          `Tell me about a product launch you managed.`,
          `How do you balance stakeholder requests with user needs?`,
          `Describe your experience with agile methodologies and sprint planning.`
        ];
        break;
      case 'finance':
        careerSpecificQuestions = [
          `How do you ensure accuracy in financial reporting?`,
          `Describe your experience with financial analysis and forecasting.`,
          `How do you explain complex financial concepts to non-finance colleagues?`,
          `Tell me about a time you identified a financial risk or opportunity.`,
          `What financial software or tools are you proficient with?`
        ];
        break;
      case 'healthcare':
        careerSpecificQuestions = [
          `How do you maintain patient confidentiality and compliance with regulations?`,
          `Describe a challenging patient/case situation and how you handled it.`,
          `How do you stay updated with medical research and best practices?`,
          `Tell me about your experience working in multidisciplinary healthcare teams.`,
          `How do you handle high-stress situations in a healthcare setting?`
        ];
        break;
      case 'education':
        careerSpecificQuestions = [
          `How do you adapt your teaching style for different learning needs?`,
          `Describe your approach to classroom management.`,
          `How do you incorporate technology into your teaching?`,
          `Tell me about a curriculum you've developed or improved.`,
          `How do you assess student progress and provide constructive feedback?`
        ];
        break;
      case 'customer_service':
        careerSpecificQuestions = [
          `Describe a situation where you turned an unhappy customer into a satisfied one.`,
          `How do you handle multiple customer inquiries simultaneously?`,
          `Tell me about a time you went above and beyond for a customer.`,
          `How do you stay positive in stressful customer interactions?`,
          `What CRM or ticketing systems have you used for customer support?`
        ];
        break;
      default:
        // General questions will be used from commonQuestions
        break;
    }
    
    // Add difficulty-specific questions
    let difficultyQuestions: string[] = [];
    if (difficulty === 'advanced') {
      difficultyQuestions = [
        `Describe a time when you had to make an important decision with incomplete information.`,
        `Tell me about a situation where you had to innovate to solve a complex problem.`,
        `How do you approach learning new skills that are outside your comfort zone?`
      ];
    }
    
    // Add stage-specific questions
    let stageQuestions: string[] = [];
    if (stage === 'technical') {
      if (careerPath === 'software_engineering') {
        stageQuestions = [
          `Describe how you would design a scalable API for a high-traffic application.`,
          `How would you optimize a slow database query?`,
          `Explain your testing strategy for a critical feature.`
        ];
      } else if (careerPath === 'data_science') {
        stageQuestions = [
          `How would you evaluate which machine learning algorithm is best for a specific problem?`,
          `Explain how you would handle a classification problem with highly imbalanced data.`,
          `Describe your approach to feature engineering and selection.`
        ];
      }
    } else if (stage === 'final') {
      stageQuestions = [
        `What unique qualities would you bring to our team that other candidates might not?`,
        `How would you describe your ideal work environment?`,
        `What questions do you have about our company or this role?`
      ];
    }
    
    // Combine and select questions based on career path, difficulty and stage
    let combinedQuestions = [...careerSpecificQuestions, ...commonQuestions, ...difficultyQuestions, ...stageQuestions];
    
    // Shuffle and select 5 questions
    combinedQuestions = shuffleArray(combinedQuestions).slice(0, 5);
    
    return combinedQuestions;
  };
  
  // Fisher-Yates shuffle algorithm
  const shuffleArray = (array: string[]): string[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  
  const startInterview = () => {
    if (!questions.length) {
      toast({
        title: "No questions available",
        description: "Please select a career path and job details first.",
        variant: "destructive"
      });
      return;
    }
    
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
      toast({
        title: "Interview Complete",
        description: "You've completed all interview questions. Great job!",
      });
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
    if (!userResponse.trim()) {
      toast({
        title: "Empty response",
        description: "Please provide an answer before submitting.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const feedbackText = await generateFeedback(userResponse, questions[currentQuestionIndex], {
        ...activeJob,
        title: jobTitle || activeJob.title,
        company: company || activeJob.company
      }, selectedCareerPath);
      setFeedback(feedbackText);
      setShowFeedback(true);
    } catch (error) {
      console.error('Error generating feedback:', error);
      setFeedback('Unable to generate feedback at this time. Please try again later.');
      toast({
        title: "Feedback Error",
        description: "There was an error generating feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateFeedback = async (
    response: string, 
    question: string, 
    job: Job, 
    careerPath: CareerPath
  ): Promise<string> => {
    // In a production app, this would be an API call to get AI feedback
    // For demonstration, we'll simulate different feedback based on the career path
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple feedback algorithm - look for keywords in the response
    const keywords = [
      'experience', 'skills', 'team', 'collaborated', 'achieved', 'learned',
      'improved', 'developed', 'implemented', 'analyzed', 'solved', 'created'
    ];
    
    // Add career path specific keywords
    switch (careerPath) {
      case 'software_engineering':
        keywords.push('code', 'debugging', 'testing', 'algorithm', 'architecture');
        break;
      case 'data_science':
        keywords.push('data', 'analysis', 'model', 'prediction', 'insights');
        break;
      case 'design':
        keywords.push('user experience', 'interface', 'prototype', 'usability', 'feedback');
        break;
      case 'marketing':
        keywords.push('campaign', 'audience', 'strategy', 'analytics', 'content');
        break;
      case 'sales':
        keywords.push('client', 'pipeline', 'closing', 'negotiation', 'prospect');
        break;
      // Add keywords for other career paths...
    }
    
    // Count keywords in response
    const keywordCount = keywords.filter(word => 
      response.toLowerCase().includes(word.toLowerCase())
    ).length;
    
    // Generate feedback based on keyword count and response length
    const responseWords = response.split(' ').length;
    let feedback = '';
    
    if (responseWords < 20) {
      feedback = `Your answer is quite brief. Consider providing more details and examples to fully demonstrate your experience and skills. A strong response to this question would include specific examples from your past work.`;
    } else if (keywordCount < 3) {
      feedback = `Your answer could be more focused on highlighting relevant skills and experiences. Try to include more specific examples that demonstrate your capabilities in ${careerPath.replace('_', ' ')}.`;
    } else if (keywordCount >= 5) {
      feedback = `Strong answer! You've provided good examples and highlighted relevant skills. Your response effectively communicates your experience in ${careerPath.replace('_', ' ')}. To further improve, you might also mention how these skills would benefit ${job.company} specifically.`;
    } else {
      feedback = `Good answer. You've included some relevant points, but could strengthen your response by providing more specific examples from your experience. Remember to tie your skills directly to the requirements of the ${job.title} position.`;
    }
    
    return feedback;
  };
  
  // Setup UI based on current state
  if (!isPlaying) {
    return (
      <Card className={cn("w-full h-full", className)}>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold flex items-center">
            <Mic className="mr-2 h-5 w-5 text-primary" />
            AI Interview Coach
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Practice interviews for your next job with our AI-powered coach.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="career-path">Career Path</Label>
            <Select 
              value={selectedCareerPath} 
              onValueChange={(value) => setSelectedCareerPath(value as CareerPath)}
            >
              <SelectTrigger id="career-path" className="w-full">
                <SelectValue placeholder="Select career path" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(careerPathLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="job-title">Job Title</Label>
              <input
                id="job-title"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="e.g. Senior Software Engineer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <input
                id="company"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="e.g. Google"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty-level">Difficulty Level</Label>
              <Select 
                value={difficultyLevel} 
                onValueChange={(value) => setDifficultyLevel(value as 'basic' | 'intermediate' | 'advanced')}
              >
                <SelectTrigger id="difficulty-level" className="w-full">
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
              <Label htmlFor="interview-stage">Interview Stage</Label>
              <Select 
                value={interviewStage} 
                onValueChange={(value) => setInterviewStage(value as 'screening' | 'technical' | 'behavioral' | 'final')}
              >
                <SelectTrigger id="interview-stage" className="w-full">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="screening">Initial Screening</SelectItem>
                  <SelectItem value="technical">Technical Interview</SelectItem>
                  <SelectItem value="behavioral">Behavioral Interview</SelectItem>
                  <SelectItem value="final">Final Round</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center p-3 border border-border rounded-md bg-primary/5">
            <div className="mr-3 h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-medium">Personalized Interview Practice</h4>
              <p className="text-xs text-muted-foreground">
                {questions.length} questions tailored for {selectedCareerPath === 'general' ? 'your career' : careerPathLabels[selectedCareerPath]}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={startInterview}
            variant="default"
            iconLeft={<Play className="h-4 w-4" />}
            fullWidth
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            Start Interview Practice
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold flex items-center">
          <span className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-2">
            <Mic className="h-4 w-4" />
          </span>
          Interview Practice
        </CardTitle>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={resetInterview}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset Interview</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2"
              >
                <BookOpen className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Question</span> {currentQuestionIndex + 1}/{questions.length}
                <ChevronDown className="h-3 w-3 ml-1 opacity-70" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-3 border-b border-border">
                <h4 className="font-medium">All Questions</h4>
                <p className="text-xs text-muted-foreground">Navigate directly to any question</p>
              </div>
              <div className="max-h-80 overflow-auto p-0">
                {questions.map((q, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "p-3 text-sm border-b border-border cursor-pointer hover:bg-muted/50 transition-colors",
                      currentQuestionIndex === index && "bg-primary/10"
                    )}
                    onClick={() => {
                      setCurrentQuestionIndex(index);
                      setUserResponse('');
                      setFeedback('');
                      setShowFeedback(false);
                    }}
                  >
                    <div className="flex">
                      <span className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2",
                        currentQuestionIndex === index 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted text-muted-foreground"
                      )}>
                        {index + 1}
                      </span>
                      <span className={currentQuestionIndex === index ? "font-medium" : ""}>
                        {q.length > 60 ? q.substring(0, 60) + "..." : q}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center">
          <div className="mr-3 h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Briefcase className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">{jobTitle || activeJob.title}</div>
            <div className="text-xs text-muted-foreground">{company || activeJob.company}</div>
          </div>
          <div className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
            {careerPathLabels[selectedCareerPath]}
          </div>
        </div>
        
        <div className="rounded-md border border-border p-4 bg-muted/20">
          <div className="font-medium text-sm mb-1">Question {currentQuestionIndex + 1}:</div>
          <div>{questions[currentQuestionIndex]}</div>
        </div>
        
        {!showFeedback ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="response" className="text-sm">Your Answer:</Label>
              <Textarea
                id="response"
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
                placeholder="Type your interview response here..."
                className="min-h-[120px] w-full"
                disabled={isLoading}
                ref={responseRef}
              />
              <div className="mt-1 text-xs text-right text-muted-foreground">
                {userResponse.split(' ').filter(Boolean).length} words
              </div>
            </div>
            
            <Button
              onClick={submitResponse}
              disabled={isLoading || !userResponse.trim()}
              iconLeft={isLoading ? undefined : <Send className="h-4 w-4" />}
              iconRight={isLoading ? undefined : undefined}
              isLoading={isLoading}
              loadingText="Analyzing response..."
              fullWidth
              variant="default"
            >
              {isLoading ? "Analyzing response..." : "Submit Answer"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-md border border-border p-4 bg-primary/5">
              <h4 className="font-medium text-sm flex items-center mb-2">
                <Sparkles className="h-4 w-4 mr-1 text-primary" />
                AI Feedback:
              </h4>
              <p className="text-sm">{feedback}</p>
            </div>
            
            <div className="flex justify-between gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFeedback(false)}
                className="flex-1"
              >
                Edit Response
              </Button>
              
              <Button
                onClick={nextQuestion}
                className="flex-1"
                variant="default"
              >
                {currentQuestionIndex < questions.length - 1 ? (
                  <>Next Question <ArrowRight className="h-4 w-4 ml-1" /></>
                ) : (
                  "Finish Interview"
                )}
              </Button>
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={previousQuestion}
            disabled={currentQuestionIndex === 0}
            className="h-8 px-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          
          <div className="text-xs text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={nextQuestion}
            className="h-8 px-2"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}