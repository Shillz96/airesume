import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Loader2, X, ChevronDown, ChevronUp, Save, Download, PenSquare, Star, Plus, Trash, FilePlus, Bot, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Resume, useResumeData } from "@/hooks/use-resume-data";
import { useTheme } from "@/contexts/ThemeContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ResumeAIAssistant } from "@/components/resume/ResumeAIAssistant";

import PageHeader from "@/components/page-header";
import { 
  ResumeExperienceSection, 
  ResumeEducationSection, 
  ResumeSkillsSection, 
  ResumeProjectsSection 
} from "@/components/resume-section";
import ResumePreviewComponent from "@/components/resume-builder/ResumePreviewComponent";

// Function component
export default function ResumeBuilder() {
  // States for resume data and UI controls
  const [activeSection, setActiveSection] = useState<string>("contact");
  const [aiSuggestionType, setAiSuggestionType] = useState<"short" | "medium" | "long">("medium");
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [skillSearchQuery, setSkillSearchQuery] = useState<string>("");
  const [skillSuggestions, setSkillSuggestions] = useState<string[]>([]);
  const { toast } = useToast();
  const { 
    resume, 
    setResume,
    isLoading, 
    saveResume, 
    isDirty,
    updatePersonalInfo,
    updateExperienceList,
    updateEducationList,
    updateSkillsList,
    updateProjectsList,
    updateResumeTemplate,
    updateResumeTitle,
    addExperience,
    addEducation,
    addSkill,
    addProject
  } = useResumeData();
  
  // Helper function to update the entire resume at once
  const updateResume = (newResumeData: Resume) => {
    setResume(newResumeData);
  };
  
  // Generate new suggestions when active section changes
  useEffect(() => {
    // Only show AI assistant for Summary, Experience, and Skills tabs
    if (activeSection === 'summary' || activeSection === 'experience') {
      generateSuggestions(aiSuggestionType);
    } else if (activeSection === 'skills') {
      generateSkillSuggestions();
    } else {
      // Clear suggestions for other tabs
      setSuggestions([]);
      setSkillSuggestions([]);
    }
  }, [activeSection]);
  
  // All available skills across multiple industries
  const allSkills = [
    // Technology & Software Development
    "JavaScript", "TypeScript", "Python", "Java", "C#", "C++", "Go", "Ruby", "PHP", "Swift",
    "React", "Angular", "Vue.js", "Node.js", "HTML/CSS", "SQL", "NoSQL", "MongoDB", "AWS", "Azure",
    "Docker", "Kubernetes", "DevOps", "CI/CD", "Git", "REST APIs", "GraphQL", "Microservices",
    "Agile", "Scrum", "Test-Driven Development", "Unit Testing", "Full-Stack Development",
    "Mobile App Development", "Cloud Computing", "System Design", "Database Design", "Data Modeling",
    "Web Accessibility", "SEO", "Performance Optimization", "Cybersecurity", "Network Security",
    
    // Healthcare & Medical
    "Patient Care", "Clinical Documentation", "Electronic Medical Records (EMR)", "Medical Coding",
    "Medical Billing", "HIPAA Compliance", "Vital Signs Monitoring", "Medication Administration",
    "Phlebotomy", "Triage", "Case Management", "Patient Advocacy", "Disease Management",
    "Diagnostic Imaging", "Laboratory Testing", "Rehabilitation Therapy", "Patient Education",
    "Infection Control", "Emergency Response", "Nursing Informatics", "Telehealth", "Clinical Research",
    "Medical Terminology", "Pharmacology", "Pain Management", "Wound Care", "Geriatric Care",
    
    // Business & Management
    "Strategic Planning", "Business Development", "Market Analysis", "Competitive Analysis",
    "Financial Analysis", "Budgeting", "Forecasting", "P&L Management", "Risk Management",
    "Process Improvement", "Change Management", "Team Leadership", "Performance Management",
    "Cross-functional Collaboration", "Stakeholder Management", "Vendor Management",
    "Contract Negotiation", "Business Intelligence", "KPI Tracking", "Corporate Governance",
    "Mergers & Acquisitions", "Due Diligence", "Business Model Innovation", "ROI Analysis",
    
    // Marketing & Communications
    "Digital Marketing", "Content Marketing", "Social Media Marketing", "Email Marketing",
    "SEO/SEM", "PPC Advertising", "Marketing Automation", "Campaign Management", "Brand Development", 
    "Market Research", "Audience Segmentation", "Customer Journey Mapping", "CRM", "Lead Generation",
    "Conversion Rate Optimization", "Google Analytics", "A/B Testing", "Copywriting", "Content Strategy",
    "Marketing Analytics", "Public Relations", "Crisis Communications", "Media Relations",
    "Internal Communications", "Event Planning", "Video Production", "Podcast Production",
    
    // Finance & Accounting
    "Financial Reporting", "Generally Accepted Accounting Principles (GAAP)", "Accounts Payable",
    "Accounts Receivable", "General Ledger", "Financial Statement Analysis", "Audit Preparation",
    "Tax Preparation", "Cash Flow Management", "Fixed Asset Accounting", "Cost Accounting",
    "Variance Analysis", "Regulatory Compliance", "Financial Modeling", "QuickBooks", "SAP",
    "Oracle Financials", "Microsoft Dynamics", "Sarbanes-Oxley Compliance", "Revenue Recognition", 
    "Expense Management", "Payroll Processing", "Financial Forecasting", "Treasury Management",
    
    // Sales & Customer Service
    "Consultative Selling", "Solution Selling", "Sales Pipeline Management", "CRM Management",
    "Customer Needs Analysis", "Relationship Building", "Account Management", "Territory Management",
    "Contract Negotiation", "Closing Techniques", "Objection Handling", "Upselling", "Cross-selling",
    "Customer Retention", "Conflict Resolution", "Active Listening", "Product Knowledge",
    "Service Level Agreement Management", "Quality Assurance", "Call Center Operations",
    "Customer Experience Management", "Voice of Customer Programs", "Customer Feedback Analysis",
    
    // Education & Training
    "Curriculum Development", "Lesson Planning", "Instructional Design", "Learning Management Systems",
    "Student Assessment", "Differentiated Instruction", "Classroom Management", "Distance Learning",
    "E-Learning", "Educational Technology", "Special Education", "IEP Development", "STEM Education",
    "Student Engagement", "Group Facilitation", "Adult Learning Theory", "Training Needs Analysis",
    "Learning Outcome Measurement", "Experiential Learning", "Educational Research", "Academic Advising",
    "Tutoring", "Student Support Services", "Behavior Management", "Multicultural Education",
    
    // Human Resources
    "Talent Acquisition", "Recruitment", "Employee Onboarding", "Performance Evaluation",
    "Compensation Planning", "Benefits Administration", "Employee Relations", "Conflict Resolution",
    "Employment Law Compliance", "HRIS Management", "Succession Planning", "Workforce Planning",
    "Diversity & Inclusion", "Training & Development", "Employee Engagement", "Policy Development",
    "Change Management", "Organizational Development", "HR Analytics", "Payroll Administration",
    "Retention Strategies", "Exit Interviews", "Labor Relations", "Collective Bargaining",
    
    // Legal
    "Legal Research", "Legal Writing", "Case Management", "Document Review", "Contract Drafting",
    "Contract Review", "Legal Compliance", "Regulatory Affairs", "Due Diligence", "Litigation Support",
    "eDiscovery", "Legal Project Management", "Intellectual Property", "Patent Law", "Trademark Law",
    "Copyright Law", "Corporate Law", "Employment Law", "Environmental Law", "Immigration Law",
    "Family Law", "Criminal Law", "Real Estate Law", "Tax Law", "Mergers & Acquisitions",
    
    // Creative & Design
    "Graphic Design", "UI/UX Design", "Web Design", "Mobile Design", "User Research",
    "Wireframing", "Prototyping", "Adobe Creative Suite", "Photoshop", "Illustrator",
    "InDesign", "After Effects", "Figma", "Sketch", "Brand Design", "Typography",
    "Color Theory", "Visual Communication", "Advertising Design", "Package Design",
    "Animation", "Video Editing", "Photography", "Art Direction", "3D Modeling",
    
    // Manufacturing & Operations
    "Lean Manufacturing", "Six Sigma", "Process Optimization", "Quality Control",
    "Quality Assurance", "Supply Chain Management", "Inventory Management", "Logistics",
    "Warehouse Management", "Production Planning", "Production Scheduling", "Materials Management",
    "Equipment Maintenance", "Preventive Maintenance", "Root Cause Analysis", "Safety Compliance",
    "OSHA Regulations", "ISO Standards", "5S Methodology", "Continuous Improvement",
    "Just-in-Time (JIT)", "Total Quality Management (TQM)", "Enterprise Resource Planning (ERP)",
    
    // Construction & Engineering
    "Project Management", "Blueprint Reading", "AutoCAD", "Building Information Modeling (BIM)",
    "Construction Planning", "Cost Estimation", "Structural Analysis", "Civil Engineering",
    "Mechanical Engineering", "Electrical Engineering", "HVAC Systems", "Plumbing Systems",
    "Building Codes", "Safety Standards", "Construction Supervision", "Contract Administration",
    "Site Inspection", "Quality Control", "Permit Processing", "Material Procurement",
    "Sustainability Design", "LEED Certification", "Energy Efficient Design", "Soil Mechanics",
    
    // Hospitality & Tourism
    "Hotel Management", "Restaurant Management", "Event Planning", "Guest Relations",
    "Front Desk Operations", "Reservation Systems", "Revenue Management", "Food & Beverage Management",
    "Menu Development", "Catering Management", "Housekeeping Operations", "Facilities Management",
    "Tourism Development", "Travel Planning", "Tour Guide Services", "Concierge Services",
    "Customer Service Excellence", "Property Management Systems", "Hospitality Law",
    "Health & Safety Compliance", "Crisis Management", "Sustainable Tourism",
    
    // Retail & Merchandising
    "Retail Management", "Store Operations", "Visual Merchandising", "Inventory Control",
    "Loss Prevention", "Point of Sale Systems", "Retail Analytics", "Merchandising Planning",
    "Product Selection", "Pricing Strategy", "Promotional Planning", "Retail Marketing",
    "Category Management", "Assortment Planning", "Vendor Negotiations", "Supply Chain Optimization",
    "Customer Experience Design", "E-commerce Management", "Omnichannel Strategy", "Retail Compliance",
    "Sales Training", "Staff Development", "Shrinkage Control", "Fashion Merchandising",
    
    // Environmental & Sustainability
    "Environmental Impact Assessment", "Sustainability Planning", "Carbon Footprint Analysis",
    "Waste Management", "Recycling Programs", "Water Conservation", "Energy Efficiency",
    "Renewable Energy", "Environmental Compliance", "LEED Certification", "Green Building",
    "Environmental Remediation", "Habitat Conservation", "Wildlife Management", "Natural Resource Management",
    "Climate Change Mitigation", "Environmental Policy", "Stakeholder Engagement", "Corporate Social Responsibility",
    "Life Cycle Assessment", "Circular Economy", "Sustainable Supply Chain", "Environmental Education",
    
    // Agriculture & Farming
    "Crop Management", "Livestock Management", "Soil Conservation", "Irrigation Systems",
    "Pest Management", "Integrated Pest Management", "Organic Farming", "Sustainable Agriculture",
    "Farm Equipment Operation", "Harvest Management", "Post-harvest Handling", "Agricultural Planning",
    "Agricultural Economics", "Farm Business Management", "Precision Agriculture", "Hydroponics",
    "Aquaponics", "Animal Husbandry", "Plant Breeding", "Seed Production", "Agricultural Research",
    "Agribusiness", "Farm-to-Table Operations", "Agricultural Marketing", "Food Safety Compliance",
    
    // Transportation & Logistics
    "Supply Chain Management", "Logistics Planning", "Transportation Management", "Route Optimization",
    "Fleet Management", "Warehouse Operations", "Inventory Control", "Distribution Management",
    "Freight Forwarding", "Customs Compliance", "International Shipping", "Import/Export Regulations",
    "Carrier Relations", "Transportation Safety", "Hazardous Materials Handling", "Cold Chain Logistics",
    "Last Mile Delivery", "Logistics Software", "Demand Forecasting", "Order Fulfillment",
    "Reverse Logistics", "Cross-docking", "Intermodal Transportation", "3PL Management",
    
    // Soft Skills (Universal)
    "Communication", "Teamwork", "Problem Solving", "Critical Thinking", "Time Management",
    "Leadership", "Conflict Resolution", "Decision Making", "Adaptability", "Emotional Intelligence",
    "Active Listening", "Negotiation", "Persuasion", "Presentation Skills", "Public Speaking",
    "Cultural Awareness", "Empathy", "Stress Management", "Work Ethic", "Attention to Detail",
    "Creativity", "Analytical Thinking", "Strategic Planning", "Customer Service", "Networking"
  ];
  
  // Function to generate 10 random skills
  const generateSkillSuggestions = () => {
    setIsLoadingSuggestions(true);
    
    // In a real implementation, this would call an API
    setTimeout(() => {
      // Shuffle the skills array and take 10 random skills
      const shuffled = [...allSkills].sort(() => 0.5 - Math.random());
      const randomSkills = shuffled.slice(0, 10);
      
      setSkillSuggestions(randomSkills);
      setIsLoadingSuggestions(false);
    }, 600);
  };
  
  // Function to get AI-based skill suggestions for a search query
  const getFilteredSkillSuggestions = () => {
    // If no search query, just return the random suggestions
    if (!skillSearchQuery) return skillSuggestions;
    
    // This would normally call an AI API with the search query
    // For now, we'll simulate an AI response by finding all matching skills from our full list
    const matches = allSkills.filter(skill => 
      skill.toLowerCase().includes(skillSearchQuery.toLowerCase())
    );
    
    // Take up to 10 matches
    return matches.slice(0, 10);
  };

  // Function to handle download
  const handleDownload = () => {
    toast({
      title: "Resume downloaded",
      description: "Your resume has been downloaded successfully."
    });
  };

  // Function to handle save
  const handleSaveResume = async () => {
    try {
      await saveResume();
      toast({
        title: "Resume saved",
        description: "Your resume has been saved successfully."
      });
    } catch (error) {
      toast({
        title: "Error saving resume",
        description: "There was an error saving your resume. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Function to apply a suggestion from the AI Assistant to the resume
  const applySuggestion = (suggestion: string) => {
    if (activeSection === "summary") {
      updateResume({
        ...resume,
        personalInfo: {
          ...resume.personalInfo,
          summary: suggestion
        }
      });
    } else if (activeSection === "experience") {
      // For simplicity, we'll just add this as a new experience item
      const newExp = {
        id: `exp-${Date.now()}`,
        title: "Position Title",
        company: "Company Name",
        startDate: "Jan 2020",
        endDate: "Present",
        description: suggestion
      };
      updateResume({
        ...resume,
        experience: [...resume.experience, newExp]
      });
    } else if (activeSection === "skills") {
      // Add as a skill
      const newSkill = {
        id: `skill-${Date.now()}`,
        name: suggestion,
        proficiency: 80
      };
      updateResume({
        ...resume,
        skills: [...resume.skills, newSkill]
      });
      
      toast({
        title: "Skill added",
        description: `${suggestion} has been added to your skills.`
      });
    }
  };
  
  // Old functions for AI suggestions are now in the ResumeAIAssistant component
      if (activeSection === "summary") {
        // Based on the detected industry/role (here we're providing multiple industries)
        if (type === "short") {
          newSuggestions = [
            // Technology
            "Dedicated software engineer with 5+ years experience in web development, specializing in React and Node.js.",
            // Healthcare
            "Compassionate Registered Nurse with 6+ years of acute care experience, specializing in emergency medicine and patient advocacy.",
            // Marketing
            "Creative Marketing Specialist with proven success developing innovative campaigns that increase brand visibility and drive conversion rates.",
            // Finance
            "Detail-oriented Financial Analyst with expertise in data-driven forecasting, budgeting, and financial modeling for business growth strategies.",
            // Education
            "Dedicated Elementary Educator with 8+ years experience fostering student growth through differentiated instruction and technology integration.",
            // Hospitality
            "Customer-focused Hospitality Manager with extensive experience in guest relations, staff development, and operational excellence."
          ];
        } else if (type === "medium") {
          newSuggestions = [
            // Technology
            "Seasoned software engineer with 5+ years of experience building responsive web applications. Expertise in JavaScript frameworks (React, Vue) and backend technologies (Node.js, Express). Delivered solutions that improved customer engagement by 40%.",
            // Healthcare
            "Dedicated Registered Nurse with 6+ years of experience in emergency and critical care settings. Expertise in trauma assessment, medication administration, and patient advocacy. Consistently recognized for compassionate care and quick decision-making in high-pressure situations.",
            // Sales/Business
            "Results-driven Sales Manager with 7+ years experience exceeding targets in competitive markets. Skilled in team leadership, client relationship management, and strategic territory planning. Proven track record of increasing regional sales by 35% and implementing effective sales training programs.",
            // Legal
            "Detail-oriented Paralegal with 4+ years supporting corporate litigation teams. Proficient in legal research, document preparation, and client communications. Experienced in managing complex case files and coordinating with multiple stakeholders while ensuring strict confidentiality and compliance.",
            // Human Resources
            "Strategic HR Professional with 8+ years experience spanning talent acquisition, employee relations, and organizational development. Skilled in implementing effective retention programs and developing comprehensive training initiatives that improved employee satisfaction by 25%.",
            // Construction
            "Experienced Construction Manager with 10+ years overseeing residential and commercial projects. Expertise in project planning, cost estimation, and regulatory compliance. Successfully completed over 25 major projects on time and under budget while maintaining exceptional quality standards."
          ];
        } else {
          newSuggestions = [
            // Technology
            "Senior Software Engineer with 5+ years of experience architecting and implementing scalable web applications. Proficient in the entire development lifecycle from concept to deployment. Core expertise includes React, Node.js, GraphQL, and AWS. Successfully reduced API response times by 65% and implemented CI/CD pipelines that decreased deployment times from days to minutes. Known for mentoring junior developers and promoting best practices across development teams.",
            // Healthcare
            "Compassionate and versatile Registered Nurse with 6+ years of progressive experience in emergency medicine and critical care settings. Advanced certifications in ACLS, PALS, and Trauma Nursing. Recognized for exceptional patient care, having maintained 98% patient satisfaction scores while managing high-volume trauma cases. Experienced in implementing new triage protocols that reduced wait times by 30% and improved patient outcomes. Actively contributes to cross-departmental initiatives and mentors new nursing staff on best practices in emergency care protocols.",
            // Marketing
            "Strategic Marketing Director with 8+ years of experience developing comprehensive marketing campaigns across digital and traditional channels. Expert in market analysis, brand development, and performance metrics. Spearheaded company rebrand that increased market share by 15% and customer engagement by 43%. Successfully managed $2.5M annual marketing budget, consistently achieving ROI targets while exploring innovative marketing technologies. Skilled team leader who has built and mentored high-performing marketing teams, implementing streamlined workflows that improved campaign delivery times by 35%.",
            // Finance
            "Results-driven Financial Controller with 10+ years of progressive experience in corporate finance and accounting operations. Expert in financial reporting, audit management, and regulatory compliance (GAAP, SOX). Successfully led the implementation of a new ERP system that streamlined financial operations and reduced month-end close time from 10 days to 3 days. Managed accounting team of 12 professionals while overseeing $50M annual budget. Developed comprehensive financial analysis models that identified $1.2M in cost-saving opportunities and supported strategic decision-making for C-suite executives.",
            // Education
            "Dedicated Educational Leader with 12+ years experience as a classroom teacher and curriculum specialist. Master's in Educational Technology with focus on innovative teaching methodologies. Developed and implemented district-wide literacy program that improved reading proficiency scores by 27% across 15 schools. Recipient of State Teacher of the Year award for creating inclusive learning environments that support diverse student needs. Expert in data-driven instruction, having trained over 100 educators in assessment strategies and personalized learning techniques that measurably increase student achievement.",
            // Hospitality
            "Dynamic Hospitality Executive with 15+ years of progressive experience managing luxury hotel operations and guest services. Expert in revenue management, staff development, and creating exceptional guest experiences with 97% satisfaction rates. Successfully directed $4M property renovation while maintaining operations and exceeding revenue targets by 18%. Implemented innovative training programs that reduced staff turnover by 40% and improved service consistency across five departments. Recognized industry leader in sustainability practices, having developed eco-friendly initiatives that reduced operational costs by $250K annually while enhancing brand reputation."
          ];
        }
      } else if (activeSection === "experience") {
        if (type === "short") {
          newSuggestions = [
            // Technology
            "Led development of a customer-facing web application that increased user engagement by 45%.",
            // Healthcare
            "Managed care for 15-20 patients daily in high-volume emergency department while maintaining 98% satisfaction rating.",
            // Sales
            "Exceeded quarterly sales targets by 32% through strategic account management and effective client relationship building.",
            // Finance
            "Analyzed financial statements and identified cost-saving measures that reduced operational expenses by 18%.",
            // Marketing
            "Created and implemented social media campaign that increased brand engagement by 75% and generated 2,500+ qualified leads.",
            // Hospitality
            "Supervised team of 15 staff members while maintaining high service standards and reducing turnover by 40%.",
            // Education 
            "Developed innovative curriculum that improved standardized test scores by 27% among previously underperforming students.",
            // Manufacturing
            "Streamlined production process that reduced assembly time by 15% while improving overall product quality.",
            // Retail
            "Managed $2M annual merchandise budget and increased store profitability by 22% through strategic inventory planning."
          ];
        } else if (type === "medium") {
          newSuggestions = [
            // Technology
            "Spearheaded the development of a React-based customer portal that improved user engagement by 45% and reduced support tickets by 30%. Implemented state management using Redux and integrated with RESTful APIs to streamline data flow and enhance application performance.",
            // Healthcare
            "Coordinated patient care for 15-20 individuals daily in high-volume emergency department, implementing new triage protocols that reduced wait times by 25%. Collaborated with interdisciplinary teams to ensure comprehensive treatment plans and maintained 98% patient satisfaction rating.",
            // Finance 
            "Conducted detailed financial analysis of operational expenses across 5 departments, identifying inefficiencies and implementing cost-saving measures that reduced overhead by 18%. Developed improved forecasting models that increased budget accuracy by 40% and supported strategic decision-making.",
            // Marketing
            "Designed and executed comprehensive social media strategy across multiple platforms (Instagram, LinkedIn, TikTok) that increased brand engagement by 75% and follower growth by 120%. Created data-driven content calendar that generated 2,500+ qualified leads and contributed to 28% revenue growth.",
            // Education
            "Developed and implemented student-centered learning curriculum for diverse classrooms of 25-30 students, incorporating technology and differentiated instruction methods. Created assessment strategies that improved standardized test scores by 27% among previously underperforming students.",
            // Retail Management
            "Managed store operations with annual revenue of $3.5M, including supervision of 25 employees across sales, visual merchandising, and inventory teams. Implemented new customer service protocols that increased customer retention by 35% and boosted average transaction value by 22%."
          ];
        } else {
          newSuggestions = [
            // Technology
            "Led a cross-functional team of 5 developers to redesign the company's flagship customer portal using React and GraphQL, resulting in a 45% increase in user engagement and 30% reduction in support tickets. Implemented sophisticated state management with Redux, integrated with 12 internal microservices, and established comprehensive testing protocols that caught 95% of bugs before production. Collaborated with UX designers to optimize user workflows that reduced average task completion time by 40%, receiving recognition for exceptional project delivery from the CTO.",
            // Healthcare
            "Served as Charge Nurse in Level I Trauma Center managing the care of 100+ daily patients and supervising a team of 12 nurses and 4 technicians. Implemented evidence-based protocols for sepsis identification that improved early detection by 65% and reduced mortality rates by 15%. Led interdisciplinary initiative to streamline documentation processes, reducing charting time by 25% and increasing direct patient care time. Recognized with Hospital Excellence Award for leadership during COVID-19 surge capacity implementation that maintained high standards of care while accommodating 40% patient volume increase.",
            // Finance
            "Directed comprehensive financial analysis for multinational corporation with $500M annual revenue, overseeing team of 8 financial analysts. Developed sophisticated financial models that improved forecast accuracy by 40% and provided critical insights for C-suite decision-making. Led company-wide cost optimization initiative that identified $12M in annual savings through process improvements and strategic vendor renegotiations. Implemented new budgeting system that reduced month-end close process from 10 days to 3 days while improving data accuracy and departmental accountability across 15 business units.",
            // Marketing
            "Orchestrated end-to-end rebranding campaign for established B2B company, including market research, positioning strategy, visual identity development, and omnichannel implementation. Managed $1.2M marketing budget and cross-functional team of 12 specialists across creative, digital, and content departments. Campaign resulted in 85% brand recognition improvement, 130% increase in qualified leads, and 45% growth in conversion rates. Implemented sophisticated marketing attribution model that provided granular ROI analysis across 20+ channels, optimizing budget allocation that drove 28% increase in marketing-attributed revenue while maintaining same spend level.",
            // Education
            "Transformed underperforming inner-city high school English department as Department Chair, developing comprehensive curriculum redesign incorporating project-based learning and technology integration. Managed team of 12 teachers, implementing mentorship program and professional development initiatives that reduced teacher turnover from 40% to 5%. Created innovative assessment strategies aligned with state standards that improved standardized test passing rates from 65% to 92% over three years. Secured $250,000 grant to establish digital literacy lab serving 1,200+ students annually, which became model program replicated across the district.",
            // Hospitality
            "Directed operations for luxury resort property with 350 rooms, 3 restaurants, and conference facilities generating $25M annual revenue. Orchestrated comprehensive service excellence initiative that improved guest satisfaction scores from 85% to 98% and earned property its first Five-Star rating. Led team of 175 staff across departments, implementing career development program that reduced turnover by 45% and promoted 35 employees to leadership positions. Managed $5M renovation project on-time and under budget while maintaining full operations, resulting in 30% ADR increase and 22% boost in group bookings following completion."
          ];
        }
      } else if (activeSection === "skills") {
        if (type === "short") {
          newSuggestions = [
            // Technology
            "JavaScript, React, Node.js, HTML5/CSS3, Git, SQL",
            // Healthcare
            "Patient Assessment, Medication Administration, Electronic Medical Records, Critical Care, CPR/ACLS",
            // Marketing
            "Digital Marketing, SEO/SEM, Social Media Management, Content Creation, Google Analytics",
            // Finance
            "Financial Analysis, Budgeting, Forecasting, Excel Advanced, Risk Assessment",
            // Education
            "Curriculum Development, Differentiated Instruction, Assessment Design, Classroom Management, EdTech",
            // Legal
            "Legal Research, Document Preparation, Case Management, Client Communication, Regulatory Compliance",
            // Retail/Hospitality
            "Inventory Management, POS Systems, Team Leadership, Customer Experience, Scheduling",
            // Manufacturing
            "Quality Control, Lean Manufacturing, Six Sigma, Process Optimization, Safety Protocols",
            // Creative
            "Adobe Creative Suite, UI/UX Design, Video Production, Typography, Content Strategy"
          ];
        } else if (type === "medium") {
          newSuggestions = [
            // Technology
            "Frontend: JavaScript, TypeScript, React, Vue.js, HTML5/CSS3, Responsive Design\nBackend: Node.js, Express, RESTful APIs, GraphQL, SQL/NoSQL Databases\nDevOps: Git, Docker, CI/CD, Cloud Services, Agile Methodologies",
            
            // Healthcare
            "Clinical Skills: Patient Assessment, Wound Care, IV Management, Medication Administration, Vital Signs\nTechnical: Electronic Medical Records, Medical Equipment Operation, Telehealth Platforms\nSpecialty: Critical Care, Emergency Response, Patient Education, Infection Control, Case Management",
            
            // Business/Finance
            "Financial Analysis: Budget Management, Financial Modeling, Risk Assessment, Cost Reduction\nSoftware: Advanced Excel, QuickBooks, SAP, Tableau, PowerBI\nOperations: Process Improvement, Strategic Planning, Data-Driven Decision Making, Compliance Reporting",
            
            // Education/Training
            "Instructional: Curriculum Development, Lesson Planning, Assessment Design, Differentiated Instruction\nLeadership: Program Management, Student Mentoring, Parent Communication, IEP Development\nTechnology: Learning Management Systems, Educational Technology, Virtual Learning Environments",
            
            // Hospitality/Customer Service
            "Management: Team Leadership, Training & Development, Scheduling, Inventory Control, Budgeting\nCustomer Experience: Conflict Resolution, VIP Services, Reservation Systems, Event Planning\nOperations: Food & Beverage Management, Front Desk Operations, Revenue Management, Quality Assurance"
          ];
        } else {
          newSuggestions = [
            // Technology
            "Programming: JavaScript, TypeScript, Python, Java, Go, PHP, Swift, Kotlin\nFrontend: React, Redux, Vue.js, Angular, Next.js, HTML5, CSS3/SCSS, Webpack, Jest\nBackend: Node.js, Express, Django, Spring Boot, Laravel, .NET Core, GraphQL\nDatabases: SQL, PostgreSQL, MySQL, MongoDB, Redis, Elasticsearch, DynamoDB\nDevOps: AWS, Azure, GCP, Docker, Kubernetes, Terraform, CI/CD, Infrastructure as Code\nMobile: React Native, Flutter, iOS (Swift), Android (Kotlin), Cross-platform Development\nAI/ML: TensorFlow, PyTorch, Natural Language Processing, Computer Vision, Data Science\nSecurity: OWASP, Authentication/Authorization, Encryption, Security Auditing, Penetration Testing",
            
            // Healthcare
            "Clinical Expertise: Advanced Patient Assessment, Critical Care Interventions, Emergency Response Protocols, Pain Management, Wound Care, Diagnostic Procedures\nMedical Knowledge: Pharmacology, Pathophysiology, Medical Terminology, Anatomy, Disease Management, Treatment Planning\nTechnical Skills: Electronic Medical Records (Epic, Cerner), Medical Equipment Operation, Telemedicine Platforms, Point-of-Care Testing, Diagnostic Imaging Interpretation\nSpecialty Areas: Emergency Medicine, Intensive Care, Surgical Services, Pediatrics, Oncology, Geriatrics, Psychiatric Care\nAdministrative: Case Management, Care Coordination, Quality Improvement, Patient Advocacy, Regulatory Compliance, Staff Education\nCertifications: BLS, ACLS, PALS, TNCC, Specialty Certifications (CCRN, CEN, etc.), Infection Control, Pain Management",
            
            // Business/Finance
            "Financial Analysis: Advanced Financial Modeling, Variance Analysis, Risk Assessment, Capital Budgeting, Cost-Benefit Analysis, ROI Evaluation, Cash Flow Management, Financial Forecasting\nAccounting Expertise: GAAP Compliance, Financial Reporting, Audit Preparation, Tax Planning, Revenue Recognition, Fixed Asset Management, General Ledger Reconciliation\nSoftware Proficiency: Advanced Excel (Macros, VBA, Pivot Tables), SAP, Oracle Financials, QuickBooks, Tableau, Power BI, Bloomberg Terminal, Microsoft Dynamics\nRegulatory Knowledge: SOX Compliance, SEC Reporting, IFRS, Banking Regulations, Risk Management Frameworks, Internal Controls, Compliance Documentation\nLeadership: Team Management, Cross-functional Collaboration, Executive Presentations, Change Management, Strategic Planning, Process Improvement, Stakeholder Communication\nSpecialized Skills: Merger & Acquisition Analysis, Treasury Management, Investment Analysis, Portfolio Management, Derivatives Valuation, Foreign Exchange Risk Management, Credit Analysis",
            
            // Marketing/Communications
            "Digital Marketing: SEO/SEM Strategy, Paid Media Campaigns, Social Media Management, Email Marketing Automation, Content Marketing, Conversion Rate Optimization, Attribution Modeling, A/B Testing\nAnalytics & Tools: Google Analytics, Google Tag Manager, Search Console, Data Studio, Hotjar, SEMrush, Ahrefs, Moz, Mailchimp, HubSpot, Salesforce Marketing Cloud, Adobe Analytics\nContent Creation: Copywriting, Blog Management, Video Production, Podcast Development, Graphic Design, Email Sequence Creation, UX Writing, Technical Documentation, Brand Storytelling\nBrand Development: Brand Strategy, Visual Identity Systems, Brand Guidelines, Positioning, Messaging Architecture, Competitive Analysis, Consumer Research, Product Naming, Go-to-Market Planning\nPublic Relations: Media Relations, Press Release Development, Crisis Communications, Thought Leadership Programs, Influencer Partnerships, Executive Communications, Public Speaking, Speech Writing\nMarketing Strategy: Audience Segmentation, Customer Journey Mapping, Funnel Optimization, Product Marketing, Pricing Strategy, Launch Planning, Channel Strategy, Growth Marketing, International Marketing"
          ];
        }
      } else if (activeSection === "education") {
        if (type === "short") {
          newSuggestions = [
            "Bachelor of Science in Computer Science, University of Technology, 2018",
            "Associate's Degree in Web Development, Community College, 2016",
            "Full-Stack Web Development Bootcamp, Tech Academy, 2020"
          ];
        } else if (type === "medium") {
          newSuggestions = [
            "Bachelor of Science in Computer Science\nUniversity of Technology\n2014 - 2018\nGPA: 3.8/4.0",
            "Associate's Degree in Web Development\nCommunity College\n2014 - 2016\nRelevant Coursework: Web Design, Database Management",
            "Full-Stack Web Development Bootcamp\nTech Academy\nJanuary - June 2020\nCompleted 800+ hours of intensive coding training"
          ];
        } else {
          newSuggestions = [
            "Bachelor of Science in Computer Science\nUniversity of Technology\n2014 - 2018\nGPA: 3.8/4.0\nRelevant Coursework: Data Structures & Algorithms, Database Systems, Web Development, Software Engineering\nAchievements: Dean's List (all semesters), Senior Project Award for Innovative Web Application",
            "Associate's Degree in Web Development\nCommunity College\n2014 - 2016\nGPA: 3.9/4.0\nRelevant Coursework: Web Design, Database Management, JavaScript Programming, User Experience Design\nAchievements: President of Web Development Club, Created college's student portal",
            "Full-Stack Web Development Bootcamp\nTech Academy\nJanuary - June 2020\nCompleted 800+ hours of intensive coding training\nTechnologies learned: JavaScript, React, Node.js, Express, MongoDB\nCapstone Project: Developed a full-stack e-commerce platform with payment processing and inventory management"
          ];
        }
      } else if (activeSection === "projects") {
        if (type === "short") {
          newSuggestions = [
            "E-commerce Platform: Developed a full-stack online store with payment processing using React and Node.js.",
            "Task Management App: Built a productivity tool with drag-and-drop interface using Vue.js and Firebase.",
            "Portfolio Website: Designed and implemented a responsive personal website showcasing projects and skills."
          ];
        } else if (type === "medium") {
          newSuggestions = [
            "E-commerce Platform\nDeveloped a full-stack online store using React, Node.js, and MongoDB. Implemented secure payment processing with Stripe, product search, and user authentication.\nTechnologies: React, Redux, Node.js, Express, MongoDB, Stripe API",
            "Task Management Application\nBuilt a productivity tool with drag-and-drop interface, real-time updates, and team collaboration features.\nTechnologies: Vue.js, Vuex, Firebase, CSS Grid, Moment.js",
            "Portfolio Website\nDesigned and implemented a responsive personal website showcasing projects and skills. Implemented animations and contact form with email integration.\nTechnologies: HTML5, CSS3/SCSS, JavaScript, GreenSock Animation"
          ];
        } else {
          newSuggestions = [
            "E-commerce Platform\nDeveloped a comprehensive full-stack online store with advanced features for both shoppers and administrators. Implemented secure payment processing with Stripe, product search with filters, user authentication, wishlist functionality, and an admin dashboard for inventory management.\n\nTechnologies: React, Redux, Node.js, Express, MongoDB, Stripe API, JWT authentication, Docker\n\nResults: Processed 500+ test transactions with 0% error rate. Achieved 98% performance score on Google Lighthouse.",
            "Task Management Application\nArchitected and built a productivity tool aimed at remote teams with drag-and-drop interface, real-time updates, and comprehensive team collaboration features. Implemented user roles, task dependencies, time tracking, file attachments, and analytics dashboard.\n\nTechnologies: Vue.js, Vuex, Firebase, CSS Grid, Moment.js, Chart.js, Socket.io, Cloud Storage\n\nResults: Reduced team's meeting time by 30% during beta testing. Application currently used by 15+ teams.",
            "Portfolio Website\nDesigned and implemented a responsive personal website showcasing projects and skills with a focus on accessibility and performance. Created advanced animations, interactive project showcase, theme switching, and contact form with email integration and spam protection.\n\nTechnologies: HTML5, CSS3/SCSS, JavaScript, GreenSock Animation, Netlify Functions, reCAPTCHA\n\nResults: Achieved 100% score on accessibility audit. Loads in under 2 seconds on 3G connections."
          ];
        }
      } else if (activeSection === "contact") {
        // For contact info, we'll provide professional headline suggestions
        if (type === "short") {
          newSuggestions = [
            "Senior Software Engineer",
            "Full-Stack Web Developer",
            "Frontend Development Specialist"
          ];
        } else if (type === "medium") {
          newSuggestions = [
            "Senior Software Engineer | React Specialist",
            "Full-Stack Web Developer | JavaScript Expert",
            "Frontend Development Specialist | UI/UX Enthusiast"
          ];
        } else {
          newSuggestions = [
            "Senior Software Engineer | React & Node.js Expert | Cloud Solutions Architect",
            "Full-Stack Web Developer | JavaScript Ecosystem Specialist | Agile Team Lead",
            "Frontend Development Specialist | UI/UX Enthusiast | Performance Optimization Guru"
          ];
        }
      }
      
      setSuggestions(newSuggestions);
      setIsLoadingSuggestions(false);
    }, 600);
  };
  
  // Function to apply a suggestion to the appropriate field based on the active section
  const applySuggestion = (suggestion: string) => {
    if (activeSection === "summary") {
      updateResume({
        ...resume,
        personalInfo: {
          ...resume.personalInfo,
          summary: suggestion
        }
      });
    } else if (activeSection === "experience") {
      // For simplicity, we'll just add this as a new experience item
      // In a real implementation, you'd want to handle this differently
      const newExp = {
        id: `exp-${Date.now()}`,
        title: "Position Title",
        company: "Company Name",
        startDate: "Jan 2020",
        endDate: "Present",
        description: suggestion
      };
      updateResume({
        ...resume,
        experience: [...resume.experience, newExp]
      });
    } else if (activeSection === "skills") {
      // Add as a skill or skills
      const skillParts = suggestion.split('\n');
      const newSkills = skillParts.map((skill, index) => ({
        id: `skill-${Date.now()}-${index}`,
        name: skill,
        proficiency: 80
      }));
      updateResume({
        ...resume,
        skills: [...resume.skills, ...newSkills]
      });
    } else if (activeSection === "education") {
      // Parse the education suggestion
      const lines = suggestion.split('\n');
      const degree = lines[0] || "Degree";
      const institution = lines[1] || "Institution";
      const years = lines[2] || "2018 - 2022";
      
      const newEdu = {
        id: `edu-${Date.now()}`,
        degree,
        institution,
        startDate: years.split(' - ')[0] || "2018",
        endDate: years.split(' - ')[1] || "2022",
        description: lines.slice(3).join('\n')
      };
      
      updateResume({
        ...resume,
        education: [...resume.education, newEdu]
      });
    } else if (activeSection === "projects") {
      // Parse the project suggestion
      const lines = suggestion.split('\n');
      const title = lines[0] || "Project Title";
      
      const newProject = {
        id: `proj-${Date.now()}`,
        title,
        description: lines.slice(1).join('\n'),
        technologies: ["React", "JavaScript", "CSS"],
        link: ""
      };
      
      updateResume({
        ...resume,
        projects: [...resume.projects, newProject]
      });
    } else if (activeSection === "contact") {
      updateResume({
        ...resume,
        personalInfo: {
          ...resume.personalInfo,
          headline: suggestion
        }
      });
    }
    
    toast({
      title: "Suggestion applied",
      description: "The AI suggestion has been added to your resume."
    });
  };

  return (
    <div className="cosmic-app-container flex flex-col min-h-screen">
      
      <div className="cosmic-main-content container  pb-20 px-4 md:px-6 max-w-7xl mx-auto relative z-10">
        {/* Page Header */}
        <PageHeader 
          title={<span className="cosmic-text-gradient">Resume Builder</span>}
          subtitle="Create a professional resume that passes ATS systems and gets you hired."
          actions={
            <div className="flex space-x-3">
              {/* Simple actions */}
              <Button 
                variant="outline" 
                onClick={handleSaveResume} 
                disabled={isLoading || !isDirty}
                className="border-white/10 text-gray-200 hover:bg-white/10 hover:text-white"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save
              </Button>
              <Button 
                onClick={handleDownload}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          }
        />

        {/* Main Content */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resume Editor Section */}
          <div className="lg:col-span-2 space-y-6">

            {/* Tabs Navigation */}
            <Tabs 
              defaultValue="contact" 
              value={activeSection} 
              onValueChange={setActiveSection}
              className="space-y-4"
            >
              <TabsList className="w-full max-w-full flex-nowrap bg-[#131c36] border-b border-[#2a325a] flex justify-between overflow-hidden">
                <TabsTrigger className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none bg-transparent hover:bg-[#212b52] text-gray-300 data-[state=active]:text-white data-[state=active]:bg-transparent transition-colors" value="contact">Contact</TabsTrigger>
                <TabsTrigger className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none bg-transparent hover:bg-[#212b52] text-gray-300 data-[state=active]:text-white data-[state=active]:bg-transparent transition-colors" value="summary">Summary</TabsTrigger>
                <TabsTrigger className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none bg-transparent hover:bg-[#212b52] text-gray-300 data-[state=active]:text-white data-[state=active]:bg-transparent transition-colors" value="experience">Experience</TabsTrigger>
                <TabsTrigger className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none bg-transparent hover:bg-[#212b52] text-gray-300 data-[state=active]:text-white data-[state=active]:bg-transparent transition-colors" value="education">Education</TabsTrigger>
                <TabsTrigger className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none bg-transparent hover:bg-[#212b52] text-gray-300 data-[state=active]:text-white data-[state=active]:bg-transparent transition-colors" value="skills">Skills</TabsTrigger>
                <TabsTrigger className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none bg-transparent hover:bg-[#212b52] text-gray-300 data-[state=active]:text-white data-[state=active]:bg-transparent transition-colors" value="projects">Projects</TabsTrigger>
                <TabsTrigger className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none bg-transparent hover:bg-[#212b52] text-gray-300 data-[state=active]:text-white data-[state=active]:bg-transparent transition-colors" value="preview">Preview</TabsTrigger>
              </TabsList>

              {/* Contact/Personal Info Tab */}
              <TabsContent value="contact" className="space-y-4 p-6 bg-[#161f36] rounded-md border border-[#2a325a] mt-4 shadow-md">
                <h3 className="text-lg font-medium">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <input
                      type="text"
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={resume.personalInfo.firstName || ""}
                      onChange={(e) => updateResume({
                        ...resume,
                        personalInfo: {
                          ...resume.personalInfo,
                          firstName: e.target.value
                        }
                      })}
                      placeholder="First Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <input
                      type="text"
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={resume.personalInfo.lastName || ""}
                      onChange={(e) => updateResume({
                        ...resume,
                        personalInfo: {
                          ...resume.personalInfo,
                          lastName: e.target.value
                        }
                      })}
                      placeholder="Last Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <input
                      type="email"
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={resume.personalInfo.email || ""}
                      onChange={(e) => updateResume({
                        ...resume,
                        personalInfo: {
                          ...resume.personalInfo,
                          email: e.target.value
                        }
                      })}
                      placeholder="Email"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <input
                      type="tel"
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={resume.personalInfo.phone || ""}
                      onChange={(e) => updateResume({
                        ...resume,
                        personalInfo: {
                          ...resume.personalInfo,
                          phone: e.target.value
                        }
                      })}
                      placeholder="Phone"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Professional Headline</label>
                    <input
                      type="text"
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={resume.personalInfo.headline || ""}
                      onChange={(e) => updateResume({
                        ...resume,
                        personalInfo: {
                          ...resume.personalInfo,
                          headline: e.target.value
                        }
                      })}
                      placeholder="e.g., Senior Software Engineer | AI Specialist | Project Manager"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Summary Tab */}
              <TabsContent value="summary" className="space-y-4 p-6 bg-[#161f36] rounded-md border border-[#2a325a] mt-4 shadow-md">
                <div className="mb-4">
                  <h3 className="text-lg font-medium">Professional Summary</h3>
                </div>
                <div className="space-y-4">
                  <textarea
                    className="w-full min-h-[200px] rounded-md border border-input bg-background px-3 py-2"
                    value={resume.personalInfo.summary || ""}
                    onChange={(e) => updateResume({
                      ...resume,
                      personalInfo: {
                        ...resume.personalInfo,
                        summary: e.target.value
                      }
                    })}
                    placeholder="Write a compelling professional summary that highlights your expertise, experience, and key strengths."
                  />
                  <div className="bg-[#1a2442] border border-[#2a325a] p-5 rounded-md shadow-inner">
                    <h4 className="text-sm font-medium mb-3 flex items-center text-white">
                      <Star className="h-4 w-4 mr-2 text-blue-400" />
                      Pro Tips for a Great Summary
                    </h4>
                    <ul className="text-xs space-y-2 text-gray-300">
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        <span>Keep it between 3-5 sentences for optimal ATS scanning</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        <span>Mention years of experience and key specializations</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        <span>Include notable achievements with measurable results</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        <span>Tailor it to match the job descriptions you're targeting</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              {/* Experience Tab */}
              <TabsContent value="experience" className="space-y-4 p-6 bg-[#161f36] rounded-md border border-[#2a325a] mt-4 shadow-md">
                <ResumeExperienceSection
                  experiences={resume.experience}
                  onUpdate={(experiences) => updateResume({...resume, experience: experiences})}
                />
              </TabsContent>

              {/* Education Tab */}
              <TabsContent value="education" className="space-y-4 p-6 bg-[#161f36] rounded-md border border-[#2a325a] mt-4 shadow-md">
                <ResumeEducationSection
                  education={resume.education}
                  onUpdate={(education) => updateResume({...resume, education: education})}
                />
              </TabsContent>

              {/* Skills Tab */}
              <TabsContent value="skills" className="space-y-4 p-6 bg-[#161f36] rounded-md border border-[#2a325a] mt-4 shadow-md">
                <ResumeSkillsSection
                  skills={resume.skills}
                  onUpdate={(skills) => updateResume({...resume, skills: skills})}
                />
              </TabsContent>

              {/* Projects Tab */}
              <TabsContent value="projects" className="space-y-4 p-6 bg-[#161f36] rounded-md border border-[#2a325a] mt-4 shadow-md">
                <ResumeProjectsSection
                  projects={resume.projects}
                  onUpdate={(projects) => updateResume({...resume, projects: projects})}
                />
              </TabsContent>
              
              {/* Preview Tab */}
              <TabsContent value="preview" className="space-y-4 p-6 bg-[#161f36] rounded-md border border-[#2a325a] mt-4 shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Resume Preview</h3>
                  <Button 
                    onClick={handleDownload} 
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <ResumePreviewComponent
                    resume={resume}
                    onTemplateChange={(template) => updateResume({...resume, template})}
                    onDownload={handleDownload}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar - AI Assistant - Only visible on large screens and only for non-preview tabs */}
          <div className={`hidden lg:block lg:col-span-1 ${activeSection === 'preview' || activeSection === 'contact' || activeSection === 'education' || activeSection === 'projects' ? 'hidden' : ''}`}>
            <div className="sticky top-4">
              <div className="bg-[#161f36] rounded-md border border-[#2a325a] p-5 shadow-md">
                <div className="flex items-center gap-2 mb-4">
                  <Bot className="h-5 w-5 text-blue-400" />
                  <h3 className="text-lg font-medium">AI Assistant</h3>
                </div>
                
                {/* Using our new ResumeAIAssistant component */}
                <ResumeAIAssistant 
                  activeSection={activeSection}
                  skillSearchQuery={skillSearchQuery}
                  setSkillSearchQuery={setSkillSearchQuery}
                  onApplySuggestion={applySuggestion}
                  isHidden={activeSection === 'preview' || activeSection === 'contact' || activeSection === 'education' || activeSection === 'projects'}
                />
              </div>
            </div>
          </div>
        </div>




      </div>
    </div>
  );
}