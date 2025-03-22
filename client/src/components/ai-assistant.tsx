import { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { Cpu, Lightbulb, Briefcase, ArrowRight, Sparkles, RefreshCw, Send, X, MessageSquare, ChevronDown, ChevronUp, PlusCircle, Code, Check, Copy, RotateCcw } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
 Dialog,
 DialogContent,
 DialogHeader,
 DialogTitle,
 DialogTrigger,
} from "@/components/ui/dialog";
import {
 Tabs,
 TabsContent,
 TabsList,
 TabsTrigger,
} from "@/components/ui/tabs";
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/select";
import { debounce } from "lodash";

interface AIAssistantProps {
 resumeId?: string;
 onApplySuggestions?: (suggestions: string[]) => void;
 onApplySummary?: (summary: string) => void;
 onApplyBulletPoint?: (bulletPoint: string) => void;
 onApplySkill?: (skill: string) => void;
 onApplyTailoredContent?: (content: TailoredContent) => void;
 resume?: any;
 activeTab?: string;
}

interface TailoredContent {
 summary?: string;
 skills?: string[];
 experienceImprovements?: Array<{
 id: string;
 improvedDescription: string;
 }>;
}

interface ChatMessage {
 sender: "AI" | "User";
 message: string;
 type?: "summary" | "bullet" | "skill" | "tailoring" | "general" | "option" | "education" | "project" | "custom";
 options?: string[];
 section?: string;
 isTyping?: boolean;
}

// Global state to ensure only one AI Assistant is visible
let globalAssistantVisible = false;

export default function AIAssistant({
 resumeId,
 onApplySuggestions,
 onApplySummary,
 onApplyBulletPoint,
 onApplySkill,
 onApplyTailoredContent,
 resume,
 activeTab = "profile",
}: AIAssistantProps) {
 const { toast } = useToast();
 const [suggestions, setSuggestions] = useState<string[]>([]);
 const [company, setCompany] = useState("");
 const [jobDescription, setJobDescription] = useState("");
 const [tailoredContent, setTailoredContent] = useState<TailoredContent | null>(null);
 const [isVisible, setIsVisible] = useState(false);
 const [chatMode, setChatMode] = useState<"general" | "job-specific">("general");
 const [userInput, setUserInput] = useState("");
 const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
 const [targetPosition, setTargetPosition] = useState("");
 const [highlightSkills, setHighlightSkills] = useState("");
 const [generatedSummary, setGeneratedSummary] = useState("");
 const [isGenerating, setIsGenerating] = useState(false);
 const [minimized, setMinimized] = useState(false);
 const chatEndRef = useRef<HTMLDivElement>(null);
 const aiButtonRef = useRef<HTMLButtonElement>(null);
 const dialogRef = useRef<HTMLDivElement>(null);

 // Mock job positions
 const jobPositions = [
 "Junior Sales Analyst",
 "Senior Software Engineer",
 "Data Scientist",
 "Product Manager",
 "UX Designer",
 "Marketing Specialist",
 "Frontend Developer",
 "Backend Developer",
 "Full Stack Developer",
 "Project Manager",
 ];

 // Custom setter for visibility
 const setAssistantVisibility = (visible: boolean) => {
 if (visible && globalAssistantVisible) {
 toast({
 title: "AI Assistant already open",
 description: "Please close the other AI assistant window first.",
 variant: "default",
 });
 return;
 }
 globalAssistantVisible = visible;
 setIsVisible(visible);
 };

 // Animations
 useEffect(() => {
 if (aiButtonRef.current) {
 gsap.to(aiButtonRef.current, {
 scale: 1.05,
 duration: 1.5,
 repeat: -1,
 yoyo: true,
 ease: "power1.inOut",
 });
 }
 }, []);

 useEffect(() => {
 if (isVisible && dialogRef.current) {
 gsap.fromTo(
 dialogRef.current,
 { opacity: 0, y: 50 },
 { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
 );
 }
 }, [isVisible]);

 // Clean up global state on unmount
 useEffect(() => {
 return () => {
 if (isVisible) {
 globalAssistantVisible = false;
 }
 };
 }, [isVisible]);

 // Welcome message based on active tab
 useEffect(() => {
 if (isVisible && chatMessages.length === 0) {
 const welcomeMessages = {
 profile: "Welcome! I can help you craft a professional summary or headline. What would you like to improve?",
 experience: "Let's make your experience shine! I can suggest achievement-focused bullet points. What role are you describing?",
 education: "Need help with your education section? I can suggest formatting or additions like GPA or honors.",
 skills: "I can suggest in-demand skills for your field. What job roles are you targeting?",
 projects: "Let's enhance your project descriptions! I can suggest impactful ways to describe your contributions.",
 preview: "Your resume is looking good! I can provide final optimization tips for ATS systems.",
 jobs: "I can help with your job search! I can provide tips for matching with employers, tailoring applications, or finding relevant opportunities.",
 interview: "Preparing for an interview? I can provide common questions for your target role and tips for answering them effectively.",
 };

 setChatMessages([
 {
 sender: "AI",
 message: welcomeMessages[activeTab as keyof typeof welcomeMessages] || welcomeMessages.profile,
 },
 ]);
 }
 }, [isVisible, activeTab]);

 // Scroll to bottom of chat
 useEffect(() => {
 if (chatEndRef.current) {
 chatEndRef.current.scrollIntoView({ behavior: "smooth" });
 }
 }, [chatMessages]);

 // General suggestions mutation
 const { mutate: generateSuggestions, isPending: isGeneratingSuggestions } = useMutation({
 mutationFn: async () => {
 if (!resumeId) return null;
 const res = await apiRequest("GET", `/api/resumes/${resumeId}/suggestions`);
 return await res.json();
 },
 onSuccess: (data) => {
 if (data?.success && data.suggestions) {
 setSuggestions(data.suggestions);
 const newMessages: ChatMessage[] = data.suggestions.map((suggestion: string) => ({
 sender: "AI",
 message: suggestion,
 type: "general",
 }));
 setChatMessages((prev) => [
 ...prev,
 { sender: "AI", message: "Here are some suggestions to improve your resume:", isTyping: true },
 ...newMessages,
 ]);
 } else if (data?.fallbackSuggestions) {
 setSuggestions(data.fallbackSuggestions);
 const newMessages: ChatMessage[] = data.fallbackSuggestions.map((suggestion: string) => ({
 sender: "AI",
 message: suggestion,
 type: "general",
 }));
 setChatMessages((prev) => [
 ...prev,
 { sender: "AI", message: "Here are some suggestions to improve your resume:", isTyping: true },
 ...newMessages,
 ]);
 toast({
 title: "Using generic suggestions",
 description: data.error || "AI service unavailable. Using general resume tips.",
 variant: "default",
 });
 } else if (!data?.success) {
 setChatMessages((prev) => [
 ...prev,
 { sender: "AI", message: "I'm having trouble generating suggestions right now. Please try again later." },
 ]);
 toast({
 title: "Could not generate suggestions",
 description: data?.error || "Something went wrong. Please try again later.",
 variant: "destructive",
 });
 }
 },
 onError: (error: Error) => {
 setChatMessages((prev) => [
 ...prev,
 { sender: "AI", message: `I encountered an error: ${error.message}. Please try again later.` },
 ]);
 toast({
 title: "Failed to generate suggestions",
 description: error.message,
 variant: "destructive",
 });
 },
 });

 // Generate summary mutation
 const { mutate: generateSummary, isPending: isGeneratingSummary } = useMutation({
 mutationFn: async () => {
 if (!resumeId) return null;
 
 // Extract current summary from resume if available to avoid repetition
 let existingSummary = "";
 if (resume?.personalInfo?.summary) {
   existingSummary = encodeURIComponent(resume.personalInfo.summary);
 }
 
 // Build query with context parameters
 let url = `/api/resumes/${resumeId}/suggestions?summaryOnly=true`;
 if (existingSummary) {
   url += `&existingSummary=${existingSummary}`;
 }
 
 const res = await apiRequest("GET", url);
 return await res.json();
 },
 onSuccess: (data) => {
 if (data?.success && data.suggestions && Array.isArray(data.suggestions)) {
 const summaries = data.suggestions.slice(0, 2);
 const newMessages: ChatMessage[] = summaries.map((summary: string) => ({
 sender: "AI",
 message: summary,
 type: "summary",
 }));
 setChatMessages((prev) => [
 ...prev,
 { sender: "AI", message: "Here are some professional summary suggestions:", isTyping: true },
 ...newMessages,
 ]);
 } else {
 setChatMessages((prev) => [
 ...prev,
 { sender: "AI", message: "I'm having trouble generating a summary right now. Please try again later." },
 ]);
 }
 },
 onError: (error: Error) => {
 setChatMessages((prev) => [
 ...prev,
 { sender: "AI", message: `I encountered an error: ${error.message}. Please try again later.` },
 ]);
 },
 });

 // Generate targeted summary mutation
 const { mutate: generateTargetedSummary, isPending: isGeneratingTargetedSummary } = useMutation({
 mutationFn: async () => {
 if (!resumeId) return null;
 let url = `/api/resumes/${resumeId}/suggestions?summaryOnly=true`;
 if (targetPosition) {
 url += `&jobTitle=${encodeURIComponent(targetPosition)}`;
 }
 if (highlightSkills) {
 url += `&highlightSkills=${encodeURIComponent(highlightSkills)}`;
 }
 const res = await apiRequest("GET", url);
 return await res.json();
 },
 onSuccess: (data) => {
 if (data?.success && data.suggestions && Array.isArray(data.suggestions)) {
 const summary = data.suggestions[0];
 setGeneratedSummary(summary);
 setIsGenerating(false);
 } else {
 setGeneratedSummary(
 "Dynamic professional with extensive experience in your field, skilled in adapting to various roles and responsibilities. Ready to leverage expertise to contribute to innovative projects and drive success."
 );
 setIsGenerating(false);
 }
 },
 onError: (error: Error) => {
 toast({
 title: "Error generating summary",
 description: error.message,
 variant: "destructive",
 });
 setGeneratedSummary(
 "Dynamic professional with extensive experience in your field, skilled in adapting to various roles and responsibilities. Ready to leverage expertise to contribute to innovative projects and drive success."
 );
 setIsGenerating(false);
 },
 });

 // Generate bullet points mutation
 const { mutate: generateBulletPoints, isPending: isGeneratingBullets } = useMutation({
  mutationFn: async () => {
    if (!resumeId) return null;
    
    // Extract existing experience descriptions to avoid repetition
    let existingBulletPoints: string[] = [];
    let currentRole = "";
    
    if (resume?.experience && Array.isArray(resume.experience)) {
      existingBulletPoints = resume.experience
        .map(exp => exp.description || "")
        .filter(Boolean);
      
      // Get current role from most recent experience
      const sortedExperience = [...resume.experience].sort((a, b) => 
        new Date(b.startDate || 0).getTime() - new Date(a.startDate || 0).getTime()
      );
      
      if (sortedExperience[0]?.title) {
        currentRole = sortedExperience[0].title;
      }
    }
    
    // Build query with context parameters
    let url = `/api/resumes/${resumeId}/suggestions?experienceOnly=true`;
    
    if (currentRole) {
      url += `&currentRole=${encodeURIComponent(currentRole)}`;
    }
    
    if (existingBulletPoints.length > 0) {
      url += `&existingBulletPoints=${encodeURIComponent(existingBulletPoints.join('||'))}`;
    }
    
    const res = await apiRequest("GET", url);
    return await res.json();
  },
 onSuccess: (data) => {
 if (data?.success && data.suggestions && Array.isArray(data.suggestions)) {
 const bullets = data.suggestions.slice(0, 2);
 const newMessages: ChatMessage[] = bullets.map((bullet: string) => ({
 sender: "AI",
 message: bullet,
 type: "bullet",
 }));
 setChatMessages((prev) => [
 ...prev,
 { sender: "AI", message: "Here are some achievement-focused bullet points:", isTyping: true },
 ...newMessages,
 ]);
 } else {
 setChatMessages((prev) => [
 ...prev,
 { sender: "AI", message: "I'm having trouble generating bullet points right now. Please try again later." },
 ]);
 }
 },
 onError: (error: Error) => {
 setChatMessages((prev) => [
 ...prev,
 { sender: "AI", message: `I encountered an error: ${error.message}. Please try again later.` },
 ]);
 },
 });

 // Generate skills mutation
 const { mutate: generateSkills, isPending: isGeneratingSkills } = useMutation({
 mutationFn: async () => {
 if (!resumeId) return null;
 const res = await apiRequest("GET", `/api/resumes/${resumeId}/suggestions?skillsOnly=true`);
 return await res.json();
 },
 onSuccess: (data) => {
 if (data?.success && data.suggestions && Array.isArray(data.suggestions)) {
 const skills = data.suggestions.slice(0, 5);
 setChatMessages((prev) => [
 ...prev,
 { sender: "AI", message: "Here are some in-demand skills you might want to add:", isTyping: true },
 { sender: "AI", message: skills.join(", "), type: "skill" },
 ]);
 } else {
 setChatMessages((prev) => [
 ...prev,
 { sender: "AI", message: "I'm having trouble generating skill suggestions right now. Please try again later." },
 ]);
 }
 },
 onError: (error: Error) => {
 setChatMessages((prev) => [
 ...prev,
 { sender: "AI", message: `I encountered an error: ${error.message}. Please try again later.` },
 ]);
 },
 });

 // Tailor resume mutation
 const { mutate: tailorResume, isPending: isTailoring } = useMutation({
 mutationFn: async (data: { company?: string; jobDescription?: string }) => {
 if (!resumeId) return null;
 const res = await apiRequest("POST", `/api/resumes/${resumeId}/tailor`, data);
 return await res.json();
 },
 onSuccess: (data) => {
 if (data?.success && data.tailoredContent) {
 setTailoredContent(data.tailoredContent);
 setChatMessages((prev) => [
 ...prev,
 { sender: "AI", message: "I've tailored your resume for the job. Here's an improved summary:", isTyping: true },
 { sender: "AI", message: data.tailoredContent.summary || "", type: "summary" },
 ]);
 if (data.tailoredContent.skills && data.tailoredContent.skills.length > 0) {
 setChatMessages((prev) => [
 ...prev,
 { sender: "AI", message: "Key skills to highlight:" },
 { sender: "AI", message: data.tailoredContent.skills.join(", "), type: "skill" },
 ]);
 }
 } else if (!data?.success) {
 setChatMessages((prev) => [
 ...prev,
 { sender: "AI", message: "I couldn't tailor your resume. Please try again with more details." },
 ]);
 toast({
 title: "Could not tailor resume",
 description: data?.error || "Something went wrong. Please try again later.",
 variant: "destructive",
 });
 }
 },
 onError: (error: Error) => {
 setChatMessages((prev) => [
 ...prev,
 { sender: "AI", message: `I encountered an error: ${error.message}. Please try again later.` },
 ]);
 toast({
 title: "Failed to tailor resume",
 description: error.message,
 variant: "destructive",
 });
 },
 });

 // Debounced user input handler
 const debouncedHandleUserMessage = useCallback(
 debounce(() => {
 if (!userInput.trim()) return;
 setChatMessages((prev) => [...prev, { sender: "User", message: userInput }]);
 const input = userInput.trim().toLowerCase();
 let section = "";
 if (input.includes("summary") || input.includes("profile") || input.includes("about me")) {
 section = "profile";
 } else if (input.includes("experience") || input.includes("work") || input.includes("job")) {
 section = "experience";
 } else if (input.includes("education") || input.includes("school") || input.includes("degree") || input.includes("university")) {
 section = "education";
 } else if (input.includes("skill")) {
 section = "skills";
 } else if (input.includes("project")) {
 section = "projects";
 }
 setUserInput("");
 setTimeout(() => {
 if (input.includes("summary") || input.includes("profile")) {
 generateSummary();
 } else if (input.includes("experience") || input.includes("bullet") || input.includes("achievement")) {
 generateBulletPoints();
 } else if (input.includes("skill") || input.includes("add skill")) {
 generateSkills();
 } else if (input.includes("tailor") || input.includes("job") || input.includes("position")) {
 setChatMessages((prev) => [
 ...prev,
 { sender: "AI", message: "I can help tailor your resume. Please provide a company name or paste a job description." },
 ]);
 setChatMode("job-specific");
 } else if (input.includes("help") || input.includes("can you") || input.includes("how")) {
 setChatMessages((prev) => [
 ...prev,
 { sender: "AI", message: "I can help with your resume in several ways. I can:" },
 { sender: "AI", message: "• Generate professional summaries" },
 { sender: "AI", message: "• Create achievement-focused bullet points" },
 { sender: "AI", message: "• Suggest relevant skills for your field" },
 { sender: "AI", message: "• Tailor your resume to specific jobs" },
 { sender: "AI", message: "• Provide ATS optimization tips" },
 { sender: "AI", message: "Just tell me what you'd like help with!" },
 ]);
 } else {
 generateSuggestions();
 }
 }, 500);
 }, 300),
 [userInput, generateSummary, generateBulletPoints, generateSkills, generateSuggestions]
 );

 const handleGenerateSummary = () => {
 if (!targetPosition && !highlightSkills) {
 toast({
 title: "Input needed",
 description: "Please select a target position or enter skills to highlight.",
 variant: "destructive",
 });
 return;
 }
 setIsGenerating(true);
 generateTargetedSummary();
 };

 const handleRegenerateSummary = () => {
 setIsGenerating(true);
 generateTargetedSummary();
 };

 const handleSaveSummary = () => {
 if (onApplySummary && generatedSummary) {
 onApplySummary(generatedSummary);
 toast({
 title: "Summary Saved",
 description: "Your professional summary has been updated.",
 });
 setGeneratedSummary("");
 setTargetPosition("");
 setHighlightSkills("");
 }
 };

 const handleApplySuggestions = () => {
 if (onApplySuggestions && suggestions.length > 0) {
 onApplySuggestions(suggestions);
 toast({
 title: "Suggestions applied",
 description: "Your resume has been updated with AI suggestions.",
 });
 }
 };

 const handleApplyTailoredContent = () => {
 if (onApplyTailoredContent && tailoredContent) {
 onApplyTailoredContent(tailoredContent);
 toast({
 title: "Tailored content applied",
 description: "Your resume has been updated for the target position.",
 });
 } else if (tailoredContent?.summary && onApplySummary) {
 onApplySummary(tailoredContent.summary);
 toast({
 title: "Summary updated",
 description: "Your professional summary has been tailored for the target position.",
 });
 }
 };

 const handleTailorSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 if (!company && !jobDescription) {
 toast({
 title: "Information needed",
 description: "Please provide either a company name or job description.",
 variant: "destructive",
 });
 return;
 }
 setChatMessages((prev) => [
 ...prev,
 { sender: "User", message: `Tailor my resume for ${company || "this job description"}.` },
 ]);
 tailorResume({
 company: company.trim() || undefined,
 jobDescription: jobDescription.trim() || undefined,
 });
 };

 const handleApplyMessage = (message: string, type?: string) => {
 if (!type) return;
 if (type === "summary" && onApplySummary) {
 onApplySummary(message);
 toast({
 title: "Summary applied",
 description: "Your professional summary has been updated.",
 });
 } else if (type === "bullet" && onApplyBulletPoint) {
 onApplyBulletPoint(message);
 toast({
 title: "Bullet point applied",
 description: "The bullet point has been added to your experience.",
 });
 } else if (type === "skill" && onApplySkill) {
 if (message.includes(",")) {
 const skills = message.split(",").map((s) => s.trim());
 skills.forEach((skill) => {
 if (skill) onApplySkill(skill);
 });
 toast({
 title: "Skills applied",
 description: `${skills.length} skills have been added to your resume.`,
 });
 } else {
 onApplySkill(message);
 toast({
 title: "Skill applied",
 description: "The skill has been added to your resume.",
 });
 }
 }
 };

 const handleCopyToClipboard = (text: string) => {
 navigator.clipboard.writeText(text).then(() => {
 toast({
 title: "Copied to clipboard",
 description: "The text has been copied to your clipboard.",
 });
 });
 };

 const handleClearChat = () => {
 setChatMessages([]);
 setChatMode("general");
 setUserInput("");
 setCompany("");
 setJobDescription("");
 setTailoredContent(null);
 setSuggestions([]);
 setGeneratedSummary("");
 setTargetPosition("");
 setHighlightSkills("");
 toast({
 title: "Chat cleared",
 description: "The conversation has been reset.",
 });
 };

 const handleQuickAction = (action: string) => {
 switch (action) {
 case "summary":
 setChatMessages((prev) => [...prev, { sender: "User", message: "Generate a professional summary" }]);
 generateSummary();
 break;
 case "bullet":
 setChatMessages((prev) => [...prev, { sender: "User", message: "Generate achievement bullet points" }]);
 generateBulletPoints();
 break;
 case "skills":
 setChatMessages((prev) => [...prev, { sender: "User", message: "Suggest relevant skills" }]);
 generateSkills();
 break;
 case "tailor":
 setChatMessages((prev) => [
 ...prev,
 { sender: "User", message: "Help me tailor my resume" },
 { sender: "AI", message: "I can help tailor your resume. Please provide a company name or paste a job description." },
 ]);
 setChatMode("job-specific");
 break;
 }
 };

 const getActiveSection = () => {
 switch (activeTab) {
 case "profile":
 return "profile";
 case "experience":
 return "experience";
 case "education":
 return "education";
 case "skills":
 return "skills";
 case "projects":
 return "projects";
 default:
 return "profile";
 }
 };

 const activeSection = getActiveSection();

 return (
 <>
 {/* Floating Button */}
 <div className="fixed bottom-6 right-6 z-50">
 {!isVisible ? (
 <Button
 ref={aiButtonRef}
 onClick={() => setAssistantVisibility(true)}
 className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transition-all hover:bg-gradient-to-r hover:from-blue-700 hover:to-purple-700"
 aria-label="Open AI Assistant"
 >
 <Cpu className="h-6 w-6" />
 </Button>
 ) : minimized ? (
 <div className="flex flex-col items-end space-y-2">
 <Button
 onClick={() => setMinimized(false)}
 className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg flex items-center"
 aria-label="Maximize AI Assistant"
 >
 <Cpu className="h-4 w-4 mr-2" />
 <span>AI Assistant</span>
 <ChevronUp className="h-4 w-4 ml-2" />
 </Button>
 </div>
 ) : (
 <div
 ref={dialogRef}
 className="w-80 bg-[#0c101b] border border-[#252a47] rounded-lg shadow-xl overflow-hidden"
 >
 {/* Chat header */}
 <div className="p-3 border-b border-[#252a47] flex justify-between items-center bg-[#1a203c]">
 <div className="flex items-center">
 <Cpu className="h-5 w-5 text-blue-400 mr-2" />
 <h3 className="text-white font-medium">
 {activeSection === "profile" ? "AI Summary Writer" : "Cosmic AI Assistant"}
 </h3>
 </div>
 <div className="flex items-center space-x-1">
 <Button
 variant="ghost"
 size="icon"
 className="h-7 w-7 text-gray-400 hover:text-white hover:bg-white/10"
 onClick={() => setMinimized(true)}
 aria-label="Minimize AI Assistant"
 >
 <ChevronDown className="h-4 w-4" />
 </Button>
 <Button
 variant="ghost"
 size="icon"
 className="h-7 w-7 text-gray-400 hover:text-white hover:bg-white/10"
 onClick={() => setAssistantVisibility(false)}
 aria-label="Close AI Assistant"
 >
 <X className="h-4 w-4" />
 </Button>
 </div>
 </div>

 {/* Interactive UI based on the active tab */}
 {activeSection === "profile" ? (
 <div className="p-3 bg-[rgba(0,0,15,0.3)]">
 <div className="space-y-3">
 <div>
 <Label className="text-sm text-gray-300">Target Job Position</Label>
 <Select value={targetPosition} onValueChange={setTargetPosition}>
 <SelectTrigger className="mt-1 bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white">
 <SelectValue placeholder="Select position" />
 </SelectTrigger>
 <SelectContent className="bg-[rgba(10,15,30,0.9)] border-[rgba(255,255,255,0.1)] text-white">
 {jobPositions.map((position) => (
 <SelectItem key={position} value={position} className="text-gray-200 hover:bg-blue-900/30">
 {position}
 </SelectItem>
 ))}
 </SelectContent>
 </Select>
 </div>

 <div>
 <Label className="text-sm text-gray-300">Skills to Highlight</Label>
 <Textarea
 placeholder="Enter skills to highlight, separated by commas (e.g. JavaScript, React, Node.js)"
 value={highlightSkills}
 onChange={(e) => setHighlightSkills(e.target.value)}
 className="mt-1 bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white resize-none h-24"
 />
 </div>

 <Button
 onClick={handleGenerateSummary}
 disabled={(!targetPosition && !highlightSkills) || isGenerating}
 className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
 >
 {isGenerating ? (
 <>
 <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
 Generating...
 </>
 ) : (
 <>
 <Sparkles className="h-4 w-4 mr-2" />
 Generate Summary
 </>
 )}
 </Button>
 </div>

 {generatedSummary && (
 <div className="mt-4 p-3 bg-[rgba(59,130,246,0.1)] border border-blue-800 rounded-md">
 <h4 className="text-sm font-medium text-blue-400 mb-2">Generated Summary</h4>
 <p className="text-sm text-gray-200 mb-3">{generatedSummary}</p>
 <div className="flex gap-2">
 <Button
 onClick={handleSaveSummary}
 className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
 >
 <Check className="h-4 w-4 mr-2" />
 Save Summary
 </Button>
 <Button
 onClick={handleRegenerateSummary}
 className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
 disabled={isGenerating}
 >
 <RefreshCw className="h-4 w-4 mr-2" />
 Regenerate
 </Button>
 </div>
 <Button
 size="sm"
 variant="ghost"
 className="mt-2 w-full text-xs text-blue-300 hover:text-blue-100 hover:bg-blue-900/30"
 onClick={() => handleCopyToClipboard(generatedSummary)}
 >
 <Copy className="h-3 w-3 mr-1" />
 Copy to Clipboard
 </Button>
 </div>
 )}
 </div>
 ) : (
 <>
 {/* Chat messages */}
 <div className="h-80 overflow-y-auto p-3 space-y-3 relative" style={{ scrollBehavior: "smooth" }}>
 <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
 <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>

 {chatMessages.map((msg, index) => (
 <div key={index} className={`flex ${msg.sender === "User" ? "justify-end" : "justify-start"} relative z-10`}>
 <div
 className={`max-w-[80%] p-2 rounded-lg border border-transparent hover:border-blue-500/30 transition-all ${
 msg.sender === "User"
 ? "bg-blue-600 text-white"
 : "bg-[rgba(255,255,255,0.05)] text-gray-200"
 } text-sm`}
 >
 {msg.isTyping ? (
 <div className="flex items-center space-x-1">
 <span className="h-2 w-2 bg-blue-400 rounded-full animate-bounce"></span>
 <span className="h-2 w-2 bg-blue-400 rounded-full animate-bounce delay-100"></span>
 <span className="h-2 w-2 bg-blue-400 rounded-full animate-bounce delay-200"></span>
 </div>
 ) : (
 <>
 <p>{msg.message}</p>
 {msg.sender === "AI" && msg.type && (
 <div className="flex gap-1 mt-1">
 <Button
 size="sm"
 variant="ghost"
 className="h-6 text-xs text-blue-300 hover:text-blue-100 hover:bg-blue-900/30 px-2"
 onClick={() => handleApplyMessage(msg.message, msg.type)}
 >
 <PlusCircle className="h-3 w-3 mr-1" />
 Apply to Resume
 </Button>
 <Button
 size="sm"
 variant="ghost"
 className="h-6 text-xs text-blue-300 hover:text-blue-100 hover:bg-blue-900/30 px-2"
 onClick={() => handleCopyToClipboard(msg.message)}
 >
 <Copy className="h-3 w-3 mr-1" />
 Copy
 </Button>
 </div>
 )}
 </>
 )}
 </div>
 </div>
 ))}
 <div ref={chatEndRef} />
 </div>

 {/* Quick actions */}
 {chatMode === "general" ? (
 <div className="p-2 border-t border-[#252a47] flex flex-wrap gap-1 bg-[#1a203c]">
 <Button
 size="sm"
 variant="ghost"
 className="h-7 text-xs text-blue-300 hover:text-blue-100 hover:bg-[rgba(59,130,246,0.1)]"
 onClick={() => handleQuickAction("summary")}
 >
 <Sparkles className="h-3 w-3 mr-1" />
 Summary
 </Button>
 <Button
 size="sm"
 variant="ghost"
 className="h-7 text-xs text-blue-300 hover:text-blue-100 hover:bg-[rgba(59,130,246,0.1)]"
 onClick={() => handleQuickAction("bullet")}
 >
 <Briefcase className="h-3 w-3 mr-1" />
 Bullet Points
 </Button>
 <Button
 size="sm"
 variant="ghost"
 className="h-7 text-xs text-blue-300 hover:text-blue-100 hover:bg-[rgba(59,130,246,0.1)]"
 onClick={() => handleQuickAction("skills")}
 >
 <Code className="h-3 w-3 mr-1" />
 Skills
 </Button>
 <Button
 size="sm"
 variant="ghost"
 className="h-7 text-xs text-blue-300 hover:text-blue-100 hover:bg-[rgba(59,130,246,0.1)]"
 onClick={() => handleQuickAction("tailor")}
 >
 <ArrowRight className="h-3 w-3 mr-1" />
 Tailor Resume
 </Button>
 <Button
 size="sm"
 variant="ghost"
 className="h-7 text-xs text-red-400 hover:text-red-300 hover:bg-red-900/20"
 onClick={handleClearChat}
 >
 <RotateCcw className="h-3 w-3 mr-1" />
 Clear Chat
 </Button>
 </div>
 ) : (
 <form onSubmit={(e) => { e.preventDefault(); handleTailorSubmit(e); }} className="p-2 border-t border-[#252a47] space-y-2 bg-[#1a203c]">
 <Input
 placeholder="Company name (optional)"
 value={company}
 onChange={(e) => setCompany(e.target.value)}
 className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white text-xs h-7"
 />
 <Textarea
 placeholder="Job description (optional)"
 value={jobDescription}
 onChange={(e) => setJobDescription(e.target.value)}
 className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white text-xs min-h-[60px] resize-none"
 />
 <div className="flex space-x-2">
 <Button
 type="button"
 variant="ghost"
 size="sm"
 className="text-gray-400 text-xs hover:text-gray-200"
 onClick={() => setChatMode("general")}
 >
 Back
 </Button>
 <Button
 type="submit"
 size="sm"
 className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs ml-auto"
 disabled={(!company && !jobDescription) || isTailoring}
 >
 {isTailoring ? (
 <>
 <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
 Tailoring...
 </>
 ) : (
 <>
 <ArrowRight className="h-3 w-3 mr-1" />
 Tailor Resume
 </>
 )}
 </Button>
 </div>
 </form>
 )}

 {/* Chat input */}
 {chatMode === "general" && (
 <div className="p-2 border-t border-[#252a47] flex items-center gap-2 bg-[#1a203c]">
 <Input
 value={userInput}
 onChange={(e) => setUserInput(e.target.value)}
 onKeyPress={(e) => e.key === "Enter" && debouncedHandleUserMessage()}
 placeholder="Ask me anything..."
 className="bg-[#0c101b] border-[#252a47] text-white text-sm h-8"
 aria-label="Chat input"
 />
 <Button
 onClick={debouncedHandleUserMessage}
 size="icon"
 className="h-8 w-8 bg-blue-600 hover:bg-blue-700 text-white"
 aria-label="Send message"
 >
 <Send className="h-4 w-4" />
 </Button>
 </div>
 )}
 </>
 )}
 </div>
 )}
 </div>

 {/* Full screen dialog for larger screens */}
 <Dialog open={isVisible} onOpenChange={(open) => {
 setAssistantVisibility(open);
 if (!open) setMinimized(false);
 }}>
 <DialogContent
 ref={dialogRef}
 className="sm:max-w-[500px] bg-[rgba(10,12,24,0.95)] backdrop-blur-md border-[rgba(255,255,255,0.1)] text-white"
 style={{
 padding: "var(--space-6)",
 gap: "var(--space-4)",
 }}
 >
 <DialogHeader>
 <DialogTitle className="flex items-center text-white">
 <Cpu className="h-5 w-5 text-blue-400 mr-2" />
 {activeSection === "profile" ? "AI Summary Writer" : "Cosmic AI Assistant"}
 </DialogTitle>
 </DialogHeader>

 {activeSection === "profile" ? (
 <div className="space-y-4">
 <div>
 <Label className="text-sm text-gray-300">Target Job Position</Label>
 <Select value={targetPosition} onValueChange={setTargetPosition}>
 <SelectTrigger className="mt-1 bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white">
 <SelectValue placeholder="Select position" />
 </SelectTrigger>
 <SelectContent className="bg-[rgba(10,15,30,0.9)] border-[rgba(255,255,255,0.1)] text-white">
 {jobPositions.map((position) => (
 <SelectItem key={position} value={position} className="text-gray-200 hover:bg-blue-900/30">
 {position}
 </SelectItem>
 ))}
 </SelectContent>
 </Select>
 </div>

 <div>
 <Label htmlFor="skills-dialog" className="text-sm text-gray-300">Skills to Highlight</Label>
 <Textarea
 id="skills-dialog"
 placeholder="Enter skills to highlight, separated by commas (e.g. JavaScript, React, Node.js)"
 value={highlightSkills}
 onChange={(e) => setHighlightSkills(e.target.value)}
 className="mt-1 bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white resize-none h-24"
 aria-label="Skills to highlight"
 />
 </div>

 <Button
 onClick={handleGenerateSummary}
 disabled={(!targetPosition && !highlightSkills) || isGenerating}
 className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
 >
 {isGenerating ? (
 <>
 <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
 Generating...
 </>
 ) : (
 <>
 <Sparkles className="h-4 w-4 mr-2" />
 Generate Summary
 </>
 )}
 </Button>

 {generatedSummary && (
 <div className="p-4 bg-[rgba(59,130,246,0.1)] border border-blue-800 rounded-md">
 <h4 className="text-sm font-medium text-blue-400 mb-2">Generated Summary</h4>
 <p className="text-sm text-gray-200 mb-4">{generatedSummary}</p>
 <div className="flex gap-2">
 <Button
 onClick={handleSaveSummary}
 className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover :to-emerald-700"
 >
 <Check className="h-4 w-4 mr-2" />
 Save Summary
 </Button>
 <Button
 onClick={handleRegenerateSummary}
 className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
 disabled={isGenerating}
 >
 <RefreshCw className="h-4 w-4 mr-2" />
 Regenerate
 </Button>
 </div>
 <Button
 size="sm"
 variant="ghost"
 className="mt-2 w-full text-xs text-blue-300 hover:text-blue-100 hover:bg-blue-900/30"
 onClick={() => handleCopyToClipboard(generatedSummary)}
 >
 <Copy className="h-3 w-3 mr-1" />
 Copy to Clipboard
 </Button>
 </div>
 )}
 </div>
 ) : (
 <Tabs value={chatMode} onValueChange={(value) => setChatMode(value as "general" | "job-specific")} className="w-full">
 <TabsList className="grid grid-cols-2 mb-4 bg-[rgba(255,255,255,0.05)]">
 <TabsTrigger value="general" className="text-sm text-gray-200 data-[state=active]:bg-blue-900/40 data-[state=active]:text-white">
 <Sparkles className="h-4 w-4 mr-1" /> General Assistance
 </TabsTrigger>
 <TabsTrigger value="job-specific" className="text-sm text-gray-200 data-[state=active]:bg-blue-900/40 data-[state=active]:text-white">
 <Briefcase className="h-4 w-4 mr-1" /> Job Targeting
 </TabsTrigger>
 </TabsList>

 <TabsContent value="general" className="mt-0 space-y-4">
 {/* Chat messages */}
 <div className="h-[300px] overflow-y-auto p-3 space-y-3 bg-[rgba(0,0,0,0.2)] rounded-md relative">
 <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
 <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>

 {chatMessages.map((msg, index) => (
 <div key={index} className={`flex ${msg.sender === "User" ? "justify-end" : "justify-start"} relative z-10`}>
 <div
 className={`max-w-[80%] p-3 rounded-lg border border-transparent hover:border-blue-500/30 transition-all ${
 msg.sender === "User"
 ? "bg-blue-600 text-white"
 : "bg-[rgba(255,255,255,0.05)] text-gray-200"
 }`}
 >
 {msg.isTyping ? (
 <div className="flex items-center space-x-1">
 <span className="h-2 w-2 bg-blue-400 rounded-full animate-bounce"></span>
 <span className="h-2 w-2 bg-blue-400 rounded-full animate-bounce delay-100"></span>
 <span className="h-2 w-2 bg-blue-400 rounded-full animate-bounce delay-200"></span>
 </div>
 ) : (
 <>
 <p>{msg.message}</p>
 {msg.sender === "AI" && msg.type && (
 <div className="flex gap-1 mt-1">
 <Button
 size="sm"
 variant="ghost"
 className="h-6 text-xs text-blue-300 hover:text-blue-100 hover:bg-blue-900/30 px-2"
 onClick={() => handleApplyMessage(msg.message, msg.type)}
 >
 <PlusCircle className="h-3 w-3 mr-1" />
 Apply to Resume
 </Button>
 <Button
 size="sm"
 variant="ghost"
 className="h-6 text-xs text-blue-300 hover:text-blue-100 hover:bg-blue-900/30 px-2"
 onClick={() => handleCopyToClipboard(msg.message)}
 >
 <Copy className="h-3 w-3 mr-1" />
 Copy
 </Button>
 </div>
 )}
 </>
 )}
 </div>
 </div>
 ))}
 <div ref={chatEndRef} />
 </div>

 {/* Quick actions */}
 <div className="flex flex-wrap gap-2">
 <Button
 size="sm"
 variant="outline"
 className="text-xs text-blue-400 border-blue-800 hover:bg-blue-900/20 hover:text-blue-300"
 onClick={() => handleQuickAction("summary")}
 >
 <Sparkles className="h-3 w-3 mr-1" />
 Generate Summary
 </Button>
 <Button
 size="sm"
 variant="outline"
 className="text-xs text-blue-400 border-blue-800 hover:bg-blue-900/20 hover:text-blue-300"
 onClick={() => handleQuickAction("bullet")}
 >
 <Briefcase className="h-3 w-3 mr-1" />
 Bullet Points
 </Button>
 <Button
 size="sm"
 variant="outline"
 className="text-xs text-blue-400 border-blue-800 hover:bg-blue-900/20 hover:text-blue-300"
 onClick={() => handleQuickAction("skills")}
 >
 <Code className="h-3 w-3 mr-1" />
 Skill
 </Button>
 <Button
 size="sm"
 variant="outline"
 className="text-xs text-red-400 border-red-800 hover:bg-red-900/20 hover:text-red-300"
 onClick={handleClearChat}
 >
 <RotateCcw className="h-3 w-3 mr-1" />
 Clear Chat
 </Button>
 </div>

 {/* Chat input */}
 <div className="flex items-center gap-2">
 <Input
 value={userInput}
 onChange={(e) => setUserInput(e.target.value)}
 onKeyPress={(e) => e.key === "Enter" && debouncedHandleUserMessage()}
 placeholder="Ask me anything..."
 className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
 aria-label="Chat input"
 />
 <Button
 onClick={debouncedHandleUserMessage}
 size="icon"
 className="bg-blue-600 hover:bg-blue-700 text-white"
 aria-label="Send message"
 >
 <Send className="h-4 w-4" />
 </Button>
 </div>
 </TabsContent>

 <TabsContent value="job-specific" className="mt-0">
 <form onSubmit={(e) => { e.preventDefault(); handleTailorSubmit(e); }} className="space-y-4">
 <div className="space-y-3">
 <div>
 <Label htmlFor="company-dialog" className="text-sm text-gray-300">Company (optional)</Label>
 <Input
 id="company-dialog"
 placeholder="Enter company name"
 value={company}
 onChange={(e) => setCompany(e.target.value)}
 className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white mt-1"
 aria-label="Company name"
 />
 </div>

 <div>
 <Label htmlFor="job-description-dialog" className="text-sm text-gray-300">Job Description (optional)</Label>
 <Textarea
 id="job-description-dialog"
 placeholder="Paste job description here"
 value={jobDescription}
 onChange={(e) => setJobDescription(e.target.value)}
 className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white h-32 resize-none mt-1"
 aria-label="Job description"
 />
 </div>
 </div>

 <div className="pt-2">
 <Button
 type="submit"
 className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
 disabled={(!company && !jobDescription) || isTailoring}
 >
 {isTailoring ? (
 <>
 <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
 Tailoring Resume...
 </>
 ) : (
 <>
 <Sparkles className="h-4 w-4 mr-2" />
 Tailor Resume for This Job
 </>
 )}
 </Button>
 </div>

 {tailoredContent && (
 <div className="mt-4 space-y-3">
 <div className="bg-[rgba(59,130,246,0.1)] border border-blue-800 rounded-md p-3">
 <h4 className="text-sm font-medium text-blue-400 mb-2">Tailored Summary</h4>
 <p className="text-sm text-gray-200">{tailoredContent.summary}</p>
 <div className="flex gap-2 mt-2">
 <Button
 size="sm"
 variant="ghost"
 className="text-xs text-blue-300 hover:text-blue-100 hover:bg-blue-900/30"
 onClick={handleApplyTailoredContent}
 >
 <PlusCircle className="h-3 w-3 mr-1" />
 Apply to Resume
 </Button>
 <Button
 size="sm"
 variant="ghost"
 className="text-xs text-blue-300 hover:text-blue-100 hover:bg-blue-900/30"
 onClick={() => handleCopyToClipboard(tailoredContent.summary || "")}
 >
 <Copy className="h-3 w-3 mr-1" />
 Copy
 </Button>
 </div>
 </div>
 </div>
 )}
 </form>
 </TabsContent>
 </Tabs>
 )}
 </DialogContent>
 </Dialog>
 </>
 );
}