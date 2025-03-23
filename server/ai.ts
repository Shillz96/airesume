import OpenAI from "openai";
import { Resume, Job } from "@shared/schema";
import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
export const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "",
  // Add a default timeout
  timeout: 30000
});

export interface ResumeSuggestions {
  suggestions: string[];
}

// Career path definitions for tailored advice
export type CareerPath = 
  | 'software_engineering'
  | 'data_science'
  | 'design'
  | 'marketing'
  | 'sales'
  | 'product_management'
  | 'finance'
  | 'healthcare'
  | 'education'
  | 'customer_service'
  | 'general';

// Interface for career-specific resume advice
export interface CareerSpecificAdvice {
  suggestedSkills: string[];
  industryKeywords: string[];
  resumeTips: string[];
  careerPathDescription: string;
  certifications: string[];
}

/**
 * Generate AI-powered suggestions to improve a resume
 */
export async function generateResumeSuggestions(resume: Resume, careerPath?: CareerPath): Promise<string[]> {
  try {
    // If no API key is provided, return sample suggestions
    if (!process.env.OPENAI_API_KEY) {
      return getSampleResumeSuggestions(resume, careerPath);
    }
    
    // Safely extract resume content for AI analysis
    const resumeContent = resume.content || {};
    const personalInfo = (resumeContent as any).personalInfo || {};
    const experience = Array.isArray((resumeContent as any).experience) ? (resumeContent as any).experience : [];
    const education = Array.isArray((resumeContent as any).education) ? (resumeContent as any).education : [];
    const skills = Array.isArray((resumeContent as any).skills) ? (resumeContent as any).skills : [];
    const projects = Array.isArray((resumeContent as any).projects) ? (resumeContent as any).projects : [];
    
    const resumeContext = {
      personalInfo,
      experience,
      education,
      skills,
      projects
    };
    
    // Determine career path from resume if not provided
    let detectedCareerPath = careerPath;
    if (!detectedCareerPath) {
      detectedCareerPath = await detectCareerPath(resumeContext);
    }
    
    // Get career-specific system prompt
    const systemPrompt = getCareerSpecificSystemPrompt(detectedCareerPath);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Please analyze this resume and provide suggestions for improvement in JSON format. The response should be a JSON object with a 'suggestions' array containing string recommendations, focusing specifically on the ${detectedCareerPath.replace('_', ' ')} career path: ${JSON.stringify(resumeContext)}`
        }
      ],
      response_format: { type: "json_object" }
    });
    
    // Safely handle the response
    const contentStr = response.choices[0].message.content || "{}";
    let result;
    try {
      result = JSON.parse(contentStr);
    } catch (parseError) {
      console.error("Error parsing suggestions JSON:", parseError);
      result = { suggestions: [] };
    }
    
    return Array.isArray(result.suggestions) ? result.suggestions : [];
  } catch (error) {
    console.error("Error generating resume suggestions:", error);
    return getSampleResumeSuggestions(resume, careerPath);
  }
}

/**
 * Detect the likely career path based on resume content
 */
export async function detectCareerPath(resumeContext: any): Promise<CareerPath> {
  try {
    // Extract relevant information from the resume context with safeguards
    const experience = resumeContext.experience || [];
    const skills = resumeContext.skills || [];
    const personalInfo = resumeContext.personalInfo || {};
    
    // Create safe strings for each field
    const jobTitles = Array.isArray(experience) 
      ? experience.map((exp: any) => (exp && exp.title) || '').join(', ')
      : '';
      
    const skillNames = Array.isArray(skills)
      ? skills.map((skill: any) => (skill && skill.name) || '').join(', ')
      : '';
      
    const summary = personalInfo && typeof personalInfo === 'object' && personalInfo.summary 
      ? personalInfo.summary 
      : '';
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a career assessment expert. Your task is to analyze resume data and determine the most likely career path from this list: software_engineering, data_science, design, marketing, sales, product_management, finance, healthcare, education, customer_service. Return just the single most appropriate career path as a string value."
        },
        {
          role: "user",
          content: `Based on the following resume information, identify the most likely career path:
          Job Titles: ${jobTitles}
          Skills: ${skillNames}
          Summary: ${summary}
          
          Return only one of these values: software_engineering, data_science, design, marketing, sales, product_management, finance, healthcare, education, customer_service, general`
        }
      ],
      response_format: { type: "text" }
    });
    
    // Safely handle null content
    const contentStr = response.choices[0].message.content || "";
    const result = contentStr.trim().toLowerCase();
    
    // Check if the result matches one of our career paths
    const validPaths: CareerPath[] = [
      'software_engineering', 'data_science', 'design', 'marketing', 
      'sales', 'product_management', 'finance', 'healthcare', 
      'education', 'customer_service', 'general'
    ];
    
    if (validPaths.includes(result as CareerPath)) {
      return result as CareerPath;
    }
    
    return 'general';
  } catch (error) {
    console.error("Error detecting career path:", error);
    return 'general';
  }
}

/**
 * Get career-specific advice for a particular career path
 */
export async function getCareerAdvice(careerPath: CareerPath): Promise<CareerSpecificAdvice> {
  try {
    // If no API key is provided, return sample career advice
    if (!process.env.OPENAI_API_KEY) {
      return getSampleCareerAdvice(careerPath);
    }
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a career advisor specializing in the ${careerPath.replace('_', ' ')} field. Provide detailed, specific, and actionable advice for someone pursuing this career path.`
        },
        {
          role: "user",
          content: `Provide career-specific advice for the ${careerPath.replace('_', ' ')} field in JSON format with these fields:
          {
            "suggestedSkills": ["skill1", "skill2", ...], // List 10-15 most valuable skills for this career
            "industryKeywords": ["keyword1", "keyword2", ...], // List 10-15 important keywords for ATS systems and job descriptions
            "resumeTips": ["tip1", "tip2", ...], // List 5-7 specific resume tips for this career
            "careerPathDescription": "A detailed description of this career path", // 2-3 paragraphs
            "certifications": ["cert1", "cert2", ...] // List 5-7 valuable certifications for this career
          }`
        }
      ],
      response_format: { type: "json_object" }
    });
    
    // Safely handle the response
    const contentStr = response.choices[0].message.content || "{}";
    try {
      const result = JSON.parse(contentStr);
      return {
        suggestedSkills: Array.isArray(result.suggestedSkills) ? result.suggestedSkills : [],
        industryKeywords: Array.isArray(result.industryKeywords) ? result.industryKeywords : [],
        resumeTips: Array.isArray(result.resumeTips) ? result.resumeTips : [],
        careerPathDescription: result.careerPathDescription || "",
        certifications: Array.isArray(result.certifications) ? result.certifications : []
      };
    } catch (parseError) {
      console.error("Error parsing career advice JSON:", parseError);
      return getSampleCareerAdvice(careerPath);
    }
  } catch (error) {
    console.error("Error generating career advice:", error);
    return getSampleCareerAdvice(careerPath);
  }
}

/**
 * Get sample career-specific advice when API is unavailable
 */
function getSampleCareerAdvice(careerPath: CareerPath): CareerSpecificAdvice {
  // Generic career advice that could apply to most fields
  const genericAdvice: CareerSpecificAdvice = {
    suggestedSkills: [
      "Communication", "Leadership", "Problem-solving", "Critical thinking",
      "Project management", "Time management", "Team collaboration",
      "Microsoft Office", "Adaptability", "Attention to detail"
    ],
    industryKeywords: [
      "Professional", "Experienced", "Team player", "Self-motivated",
      "Results-oriented", "Strategic", "Innovative", "Analytical",
      "Collaborative", "Organized", "Dedicated", "Efficient"
    ],
    resumeTips: [
      "Quantify your achievements with metrics and specific results",
      "Tailor your resume for each job application",
      "Use action verbs to begin bullet points",
      "Keep your resume concise and focused on relevant experience",
      "Include keywords from the job description for ATS compatibility"
    ],
    careerPathDescription: "This career path offers opportunities for professionals with diverse skills and experience levels. Success in this field typically requires a combination of technical knowledge, soft skills, and industry awareness. Professionals can advance by developing specialized expertise, taking on leadership roles, or expanding their skill set to adapt to changing industry demands.",
    certifications: [
      "Basic industry certification",
      "Advanced professional certification",
      "Leadership certification",
      "Project management certification",
      "Industry-specific software certification"
    ]
  };
  
  // Career-specific advice for each path
  const careerAdvice: Record<CareerPath, CareerSpecificAdvice> = {
    software_engineering: {
      suggestedSkills: [
        "JavaScript", "Python", "React", "Node.js", "RESTful APIs",
        "Git/GitHub", "SQL/NoSQL databases", "Cloud services (AWS/Azure/GCP)",
        "Docker/Kubernetes", "CI/CD pipelines", "System design",
        "Test-driven development", "Microservices architecture",
        "Data structures & algorithms", "DevOps practices"
      ],
      industryKeywords: [
        "Full-stack", "Backend", "Frontend", "API", "Microservices",
        "Agile", "Scrum", "DevOps", "Cloud-native", "Containerization",
        "Scalability", "Distributed systems", "Object-oriented", "CI/CD",
        "Version control", "Test automation", "Code review"
      ],
      resumeTips: [
        "Include links to your GitHub profile and deployed projects",
        "Highlight specific programming languages, frameworks, and tools you've mastered",
        "Quantify performance improvements or optimizations you've implemented",
        "Mention experience with specific methodologies (Agile, Scrum, Kanban)",
        "Showcase problem-solving skills with specific technical challenges you've overcome",
        "Include both personal projects and professional experience to demonstrate passion for coding"
      ],
      careerPathDescription: "Software engineering is a dynamic field focused on designing, developing, and maintaining software systems and applications. Engineers work across various domains, from web and mobile applications to systems software and embedded systems. The field rewards continuous learning, problem-solving abilities, and adaptability as technologies rapidly evolve.\n\nCareer progression typically moves from junior developer to senior engineer, and then potentially to technical lead, architect, or engineering management roles. Specialization in areas like frontend, backend, full-stack, DevOps, or specific domains (fintech, healthtech, etc.) is common. The field offers excellent remote work opportunities and competitive compensation.",
      certifications: [
        "AWS Certified Developer",
        "Microsoft Certified: Azure Developer Associate",
        "Google Cloud Professional Developer",
        "Certified Kubernetes Administrator (CKA)",
        "Oracle Certified Professional: Java SE Programmer",
        "Certified Scrum Developer",
        "CompTIA Security+"
      ]
    },
    data_science: {
      suggestedSkills: [
        "Python", "R", "SQL", "Machine Learning", "Statistical Analysis",
        "Data Visualization (Tableau/PowerBI)", "Deep Learning",
        "Natural Language Processing", "Big Data (Hadoop/Spark)",
        "Data Cleaning & Preprocessing", "Feature Engineering",
        "A/B Testing", "Predictive Modeling", "Time Series Analysis",
        "Data Ethics & Privacy"
      ],
      industryKeywords: [
        "Machine Learning", "Predictive Analytics", "Statistical Modeling",
        "Data Mining", "Big Data", "Artificial Intelligence", "Neural Networks",
        "Data Pipelines", "ETL", "Business Intelligence", "Regression Analysis",
        "Clustering", "Classification", "Hypothesis Testing", "Data Warehousing"
      ],
      resumeTips: [
        "Describe data science projects with their business impact and metrics",
        "Include specific algorithms and models you've implemented",
        "Quantify improvements in accuracy, efficiency, or business metrics",
        "Mention experience with large datasets and big data technologies",
        "Highlight domain expertise in specific industries (fintech, healthcare, retail, etc.)",
        "Showcase both technical skills and business acumen"
      ],
      careerPathDescription: "Data science combines statistics, mathematics, programming, and domain expertise to extract actionable insights from data. Professionals in this field analyze complex datasets to solve business problems, develop predictive models, and drive data-informed decision making. The field requires both technical prowess and strong communication skills to translate findings for non-technical stakeholders.\n\nCareer progression typically moves from data analyst to data scientist, then to senior data scientist or specialized roles like machine learning engineer, AI researcher, or data science manager. Many professionals specialize in particular industries (healthcare, finance, retail) or techniques (computer vision, NLP, time series analysis).",
      certifications: [
        "IBM Data Science Professional Certificate",
        "Microsoft Certified: Azure Data Scientist Associate",
        "Google Professional Data Engineer",
        "AWS Certified Data Analytics - Specialty",
        "TensorFlow Developer Certificate",
        "Cloudera Certified Associate: Data Analyst",
        "SAS Certified Data Scientist"
      ]
    },
    design: {
      suggestedSkills: [
        "UI/UX Design", "Adobe Creative Suite", "Figma/Sketch", "Typography",
        "Color Theory", "Responsive Design", "Prototyping", "Wireframing",
        "User Research", "Information Architecture", "Interaction Design",
        "Visual Communication", "Design Systems", "Accessibility (WCAG)",
        "Design Thinking"
      ],
      industryKeywords: [
        "User-centered", "Responsive", "Wireframes", "Mockups", "Prototypes",
        "User Experience", "User Interface", "Usability Testing", "A/B Testing",
        "Information Architecture", "Interaction Design", "Visual Design",
        "Mobile-first", "Accessibility", "Design Systems"
      ],
      resumeTips: [
        "Include a link to your portfolio showcasing your best design work",
        "Describe design challenges and your process for solving them",
        "Quantify the impact of your designs on user engagement, conversion rates, or satisfaction",
        "Highlight collaboration with cross-functional teams (developers, product managers, etc.)",
        "Mention experience with user research and implementing feedback",
        "Showcase both aesthetic skills and problem-solving abilities"
      ],
      careerPathDescription: "Design encompasses various disciplines focused on creating visually appealing, functional, and user-friendly products and experiences. From graphic design to user experience design, professionals in this field combine creativity with technical skills to communicate effectively and solve problems. The field rewards both artistic talent and strategic thinking about user needs and business goals.\n\nCareer progression may move from junior designer to senior designer, and then to design lead, art director, or creative director. Specialization in UI/UX, product design, brand design, or motion design is common. The industry increasingly values designers who understand technical constraints and can collaborate effectively with development teams.",
      certifications: [
        "Adobe Certified Professional",
        "Google UX Design Professional Certificate",
        "Certified User Experience Professional (CUXP)",
        "Interaction Design Foundation Certification",
        "Nielsen Norman Group UX Certification",
        "Certified Web Accessibility Specialist (WAS)",
        "InVision Design System Certification"
      ]
    },
    marketing: {
      suggestedSkills: [
        "Digital Marketing", "Content Strategy", "SEO/SEM", "Social Media Marketing",
        "Email Marketing", "Marketing Analytics", "A/B Testing",
        "CRM Management", "Copywriting", "Brand Development",
        "Campaign Management", "Marketing Automation", "Google Analytics",
        "Data Visualization", "Customer Journey Mapping"
      ],
      industryKeywords: [
        "ROI", "Conversion Rate", "Lead Generation", "Customer Acquisition",
        "KPI", "Market Research", "Brand Awareness", "Target Audience",
        "Engagement Rate", "Funnel Optimization", "Growth Hacking",
        "Customer Segmentation", "Retention", "CRM", "Attribution"
      ],
      resumeTips: [
        "Quantify marketing achievements with specific metrics (ROI, conversion rates, subscriber growth)",
        "Highlight experience with specific marketing platforms and tools",
        "Showcase successful campaigns and their business impact",
        "Demonstrate experience across multiple marketing channels",
        "Include examples of data-driven decisions and their outcomes",
        "Mention experience with marketing budgets and resource allocation"
      ],
      careerPathDescription: "Marketing is focused on promoting products, services, and brands to attract and retain customers. Professionals in this field develop strategies to understand customer needs, communicate value propositions, and drive sales or engagement. The field combines creativity with analytical thinking and increasingly relies on digital tools and data analysis to optimize campaigns.\n\nCareer paths include specializations in digital marketing, content marketing, social media, SEO/SEM, marketing analytics, or brand management. Progression typically moves from marketing coordinator to marketing manager, and potentially to marketing director or CMO. The most successful marketers blend creative communication skills with data literacy and strategic thinking.",
      certifications: [
        "Google Analytics Certification",
        "HubSpot Content Marketing Certification",
        "Facebook Blueprint Certification",
        "Google Ads Certification",
        "Hootsuite Social Marketing Certification",
        "American Marketing Association Professional Certified Marketer",
        "Digital Marketing Institute Certification"
      ]
    },
    sales: {
      suggestedSkills: [
        "Consultative Selling", "Negotiation", "CRM Software (Salesforce)",
        "Pipeline Management", "Needs Assessment", "Solution Selling",
        "Relationship Building", "Customer Success", "Sales Analytics",
        "Territory Management", "Objection Handling", "Cold Calling/Outreach",
        "Account Management", "Value Proposition Development", "Sales Enablement"
      ],
      industryKeywords: [
        "Revenue Generation", "Quota Attainment", "Pipeline", "Lead Qualification",
        "Closing Rate", "Customer Acquisition", "Account Management",
        "Upselling", "Cross-selling", "Client Relationship", "Solution Selling",
        "B2B", "B2C", "SaaS", "Enterprise Sales"
      ],
      resumeTips: [
        "Quantify sales achievements as percentages above quota or revenue generated",
        "Highlight experience with specific CRM systems and sales technologies",
        "Showcase your largest deals or accounts and how you won them",
        "Demonstrate consistent performance across different sales cycles",
        "Include examples of relationship building and long-term customer success",
        "Mention experience training or mentoring other sales professionals"
      ],
      careerPathDescription: "Sales professionals drive business growth by identifying prospects, understanding their needs, and convincing them of the value of products or services. The field requires strong interpersonal skills, resilience, strategic thinking, and increasingly, technical knowledge of complex products and CRM systems. Successful salespeople balance relationship building with systematic processes to consistently achieve results.\n\nCareer progression typically includes roles like sales development representative, account executive, senior account executive, and eventually sales manager, director, or VP. Specialization by industry, product type (SaaS, hardware, services), or sales approach (inside sales, field sales, enterprise) is common.",
      certifications: [
        "Certified Professional Sales Person (CPSP)",
        "Certified Inside Sales Professional (CISP)",
        "Salesforce Certified Administrator",
        "MEDDIC Sales Methodology Certification",
        "Challenger Sales Certification",
        "Sandler Training Certification",
        "HubSpot Sales Software Certification"
      ]
    },
    product_management: {
      suggestedSkills: [
        "Product Strategy", "Roadmap Planning", "Agile/Scrum", "User Stories",
        "Market Research", "Competitive Analysis", "Product Analytics",
        "A/B Testing", "Stakeholder Management", "User Interviews",
        "Product Lifecycle Management", "Prioritization Frameworks",
        "Technical Communication", "Product Marketing", "Feature Specification"
      ],
      industryKeywords: [
        "Product-Market Fit", "MVP", "User Story", "Backlog", "Sprint",
        "KPI", "OKR", "Customer Journey", "Feature Prioritization",
        "Agile", "Scrum", "Kanban", "User Feedback", "Roadmap",
        "Product Vision", "Go-to-Market"
      ],
      resumeTips: [
        "Describe products you've managed with metrics on user growth or revenue impact",
        "Highlight experience with product development methodologies (Agile, Scrum, etc.)",
        "Showcase how you prioritized features based on user needs and business goals",
        "Include examples of cross-functional team leadership and stakeholder management",
        "Quantify the business impact of product decisions you've made",
        "Mention experience with both technical and business aspects of product development"
      ],
      careerPathDescription: "Product management sits at the intersection of business, technology, and user experience, focusing on guiding products from conception to market success. Product managers identify opportunities, define requirements, and coordinate cross-functional teams to deliver solutions that meet customer needs while achieving business objectives. The role requires a blend of strategic thinking, technical understanding, and excellent communication skills.\n\nCareer progression typically moves from associate product manager to product manager, senior product manager, and potentially to director of product, VP of product, or CPO. Some product managers specialize in particular industries, product types (B2B vs. B2C), or aspects of product management (technical, growth, or innovation).",
      certifications: [
        "Certified Scrum Product Owner (CSPO)",
        "Product Management Certificate (PMC)",
        "Professional Scrum Product Owner (PSPO)",
        "Pragmatic Marketing Certified",
        "Product School Certification",
        "Agile Certified Product Manager",
        "Google Product Management Certificate"
      ]
    },
    finance: {
      suggestedSkills: [
        "Financial Analysis", "Excel/Advanced Modeling", "Financial Reporting",
        "Budgeting & Forecasting", "Risk Assessment", "Investment Analysis",
        "Accounting Principles", "Financial Statement Analysis", "Tax Planning",
        "Portfolio Management", "Regulatory Compliance", "Financial Software",
        "Cash Flow Management", "Business Valuation", "Financial Strategy"
      ],
      industryKeywords: [
        "ROI", "P&L", "Balance Sheet", "Cash Flow", "GAAP", "IFRS",
        "Variance Analysis", "Capital Expenditure", "Liquidity", "Solvency",
        "Financial Planning", "Risk Management", "Due Diligence", 
        "Asset Management", "Profit Optimization", "Cost Reduction"
      ],
      resumeTips: [
        "Highlight financial models or analysis that led to significant business decisions",
        "Quantify the financial impact of your recommendations or initiatives",
        "Showcase experience with specific financial software or systems",
        "Mention experience with regulatory compliance and risk management",
        "Demonstrate both analytical skills and strategic financial thinking",
        "Include examples of effectively communicating complex financial information"
      ],
      careerPathDescription: "Finance professionals manage, analyze, and optimize financial resources for individuals, organizations, or institutions. The field encompasses various specializations including corporate finance, investment banking, financial planning, risk management, and accounting. Success requires analytical rigor, attention to detail, ethical judgment, and increasingly, technological proficiency as financial systems become more complex and automated.\n\nCareer progression often begins with analyst roles, advancing to senior analyst, manager, director, and eventually CFO or other executive positions. Specialization in areas like investment banking, corporate finance, risk management, or financial technology is common. Many roles require professional certifications and continuing education to stay current with regulations and best practices.",
      certifications: [
        "Certified Public Accountant (CPA)",
        "Chartered Financial Analyst (CFA)",
        "Certified Financial Planner (CFP)",
        "Financial Risk Manager (FRM)",
        "Chartered Alternative Investment Analyst (CAIA)",
        "Certified Management Accountant (CMA)",
        "Certified Treasury Professional (CTP)"
      ]
    },
    healthcare: {
      suggestedSkills: [
        "Medical Terminology", "Patient Care", "Electronic Health Records (EHR)",
        "Healthcare Regulations (HIPAA)", "Clinical Documentation",
        "Health Insurance & Billing", "Patient Assessment", "Care Coordination",
        "Medical Software Systems", "Infection Control", "Case Management",
        "Medical Ethics", "Quality Improvement", "Healthcare Analytics",
        "Interprofessional Collaboration"
      ],
      industryKeywords: [
        "Patient-centered", "Evidence-based", "Clinical Outcomes", "Quality of Care",
        "Preventive Care", "Continuity of Care", "Healthcare Compliance",
        "Population Health", "Value-based Care", "Integrated Care",
        "Patient Safety", "Medical Coding", "Treatment Planning",
        "Healthcare Informatics", "Telehealth"
      ],
      resumeTips: [
        "Highlight specific medical systems or EHR platforms you're experienced with",
        "Showcase patient care improvements or efficiency measures you've implemented",
        "Mention experience with healthcare regulations and compliance",
        "Include examples of interdisciplinary team collaboration",
        "Quantify achievements with patient outcomes or healthcare metrics",
        "Demonstrate both technical healthcare knowledge and soft skills for patient interaction"
      ],
      careerPathDescription: "Healthcare encompasses a wide range of roles focused on patient care, health promotion, and medical services. From direct clinical roles to healthcare administration and support functions, professionals in this field work to improve health outcomes and deliver quality care. The industry combines scientific knowledge with compassion and increasingly relies on technology to enhance efficiency and patient experience.\n\nCareer paths vary widely depending on specialization – clinical practitioners may advance through increasing specialization and expertise, while administrators might progress from department management to executive leadership. The field offers stability, purpose-driven work, and opportunities to make meaningful impacts on individual and community health.",
      certifications: [
        "Registered Nurse (RN)",
        "Certified Medical Assistant (CMA)",
        "Certified Professional in Healthcare Quality (CPHQ)",
        "Certified Healthcare Information Systems Professional (CHISP)",
        "Certified Case Manager (CCM)",
        "Certified Professional in Healthcare Risk Management (CPHRM)",
        "Certified in Public Health (CPH)"
      ]
    },
    education: {
      suggestedSkills: [
        "Curriculum Development", "Instructional Design", "Assessment Methods",
        "Classroom Management", "Differentiated Instruction", "Educational Technology",
        "Learning Management Systems", "Student Engagement Strategies",
        "Special Education Principles", "Lesson Planning", "Educational Psychology",
        "Cultural Competence", "Data-Driven Instruction", "Project-Based Learning",
        "Formative Assessment"
      ],
      industryKeywords: [
        "Student-centered", "Differentiated Learning", "Formative Assessment",
        "Summative Assessment", "Pedagogy", "Andragogy", "Blended Learning",
        "E-Learning", "Learning Outcomes", "Curriculum Standards",
        "Instructional Strategies", "Educational Leadership", "Professional Development",
        "Classroom Management", "Academic Achievement"
      ],
      resumeTips: [
        "Highlight specific teaching methodologies and educational technologies you utilize",
        "Quantify student achievement or improvement under your instruction",
        "Showcase curriculum development or educational materials you've created",
        "Include examples of adapting teaching strategies for diverse learners",
        "Mention experience with assessment design and data-driven instruction",
        "Demonstrate both subject matter expertise and effective teaching skills"
      ],
      careerPathDescription: "Education professionals facilitate learning and development for students of all ages in various settings. From classroom teaching to educational administration, curriculum design, and educational technology, this field focuses on effective knowledge transfer, skill development, and fostering critical thinking. Successful educators combine subject matter expertise with understanding of learning processes and strong communication skills.\n\nCareer paths include K-12 teaching, higher education, corporate training, educational technology, administration, and curriculum development. Progression may include moving from teacher to department head, instructional coach, principal, or other administrative roles. Many educators also develop specializations in areas like special education, educational technology, or specific subject domains.",
      certifications: [
        "Teaching Certification/License (state-specific)",
        "National Board for Professional Teaching Standards Certification",
        "Google Certified Educator",
        "Microsoft Certified Educator",
        "TESOL/TEFL Certification (for ESL teaching)",
        "International Baccalaureate Educator Certificates",
        "Certified Higher Education Professional (CHEP)"
      ]
    },
    customer_service: {
      suggestedSkills: [
        "Communication", "Active Listening", "Problem Resolution",
        "CRM Software", "De-escalation Techniques", "Product Knowledge",
        "Empathy", "Ticket Management", "Multichannel Support",
        "Customer Success Principles", "Technical Troubleshooting",
        "Quality Assurance", "Process Improvement", "Customer Feedback Analysis",
        "Service Level Agreement Management"
      ],
      industryKeywords: [
        "Customer Satisfaction", "First Contact Resolution", "Service Level Agreement",
        "Customer Experience", "Call Handling", "Ticket Resolution",
        "Quality Assurance", "Upselling/Cross-selling", "Customer Retention",
        "Voice of Customer", "Support Tiers", "Complaint Management",
        "Customer Journey", "Knowledge Base", "Customer Loyalty"
      ],
      resumeTips: [
        "Quantify your customer service performance with metrics (CSAT, NPS, resolution time)",
        "Highlight experience with specific CRM systems and customer service tools",
        "Showcase successful handling of difficult situations or de-escalations",
        "Include examples of process improvements that enhanced customer experience",
        "Mention experience training or mentoring other customer service representatives",
        "Demonstrate both technical knowledge and strong interpersonal skills"
      ],
      careerPathDescription: "Customer service professionals represent organizations to their customers, providing assistance, resolving issues, and ensuring positive experiences. From frontline support to customer success management, these roles focus on building customer relationships, addressing concerns efficiently, and gathering feedback to improve products and services. The field requires excellent communication skills, problem-solving abilities, and emotional intelligence.\n\nCareer paths may progress from customer service representative to senior representative, team lead, supervisor, and potentially to customer service manager or director of customer experience. Specialization in technical support, customer success, quality assurance, or specific industries is common. As businesses increasingly prioritize customer experience as a competitive advantage, customer service roles have gained strategic importance.",
      certifications: [
        "Certified Customer Service Professional (CCSP)",
        "HDI Customer Service Representative",
        "Certified Customer Experience Professional (CCXP)",
        "ICMI Certified Contact Center Professional",
        "Salesforce Service Cloud Consultant",
        "Customer Service Institute of America Certification",
        "Support Center Institute Service Desk Analyst"
      ]
    },
    general: genericAdvice
  };
  
  return careerAdvice[careerPath] || genericAdvice;
}

/**
 * Get career-specific system prompt for tailored resume advice
 */
function getCareerSpecificSystemPrompt(careerPath: CareerPath): string {
  const basePrompt = "You are an expert resume consultant who helps job seekers improve their resumes. Provide specific, actionable suggestions to enhance this resume. Focus on improvements related to content, structure, achievements, and keywords. Limit your suggestions to 3-5 concise, bullet-point style recommendations. Return the result as JSON.";
  
  const careerPrompts: Record<CareerPath, string> = {
    software_engineering: `${basePrompt} Focus on technical skills, developer tools, programming languages, frameworks, and software development methodologies. Emphasize quantifiable improvements to code, systems, or processes. Suggest industry-specific technical certifications if applicable.`,
    
    data_science: `${basePrompt} Focus on data analysis tools, programming languages for data (Python, R), statistical methods, machine learning frameworks, and data visualization techniques. Emphasize quantifiable insights derived from data and business impact. Suggest skills related to big data technologies and domain-specific data expertise.`,
    
    design: `${basePrompt} Focus on design tools (Adobe Creative Suite, Figma, Sketch), user experience methodologies, and portfolio presentation. Emphasize the impact of designs on users, conversions, or business metrics. Suggest ways to incorporate design thinking and user-centered approaches.`,
    
    marketing: `${basePrompt} Focus on marketing platforms, analytical tools, campaign performance metrics, and content creation skills. Emphasize measurable results like growth percentages, engagement rates, or ROI. Suggest digital marketing certifications and multi-channel expertise.`,
    
    sales: `${basePrompt} Focus on sales methodologies, CRM software experience, negotiation techniques, and client relationship management. Emphasize quantifiable achievements like revenue growth, quota attainment, and client acquisition. Suggest industry-specific sales certifications.`,
    
    product_management: `${basePrompt} Focus on product development methodologies, stakeholder management, and product metrics. Emphasize product launches, feature adoption rates, and business impact. Suggest skills related to user research, roadmapping, and cross-functional team leadership.`,
    
    finance: `${basePrompt} Focus on financial analysis tools, accounting software, regulatory knowledge, and financial modeling skills. Emphasize quantifiable financial achievements, cost savings, or revenue growth. Suggest relevant certifications like CFA, CPA, or financial software expertise.`,
    
    healthcare: `${basePrompt} Focus on medical terminology, healthcare systems/software, patient care metrics, and compliance requirements. Emphasize patient outcomes, quality improvements, or operational efficiencies. Suggest relevant certifications and continuing education credentials.`,
    
    education: `${basePrompt} Focus on instructional methodologies, curriculum development, assessment techniques, and educational technologies. Emphasize student achievement metrics, program development, and innovative teaching approaches. Suggest relevant teaching certifications or specialized educational training.`,
    
    customer_service: `${basePrompt} Focus on CRM systems, communication techniques, problem-resolution metrics, and customer satisfaction tools. Emphasize measurable improvements in customer satisfaction, retention rates, or issue resolution times. Suggest customer service certifications and conflict resolution training.`,
    
    general: basePrompt
  };
  
  return careerPrompts[careerPath] || basePrompt;
}

/**
 * Match jobs with a user's resume, calculating match percentages
 */
export async function matchJobsWithResume(jobs: Job[], resume: Resume): Promise<Job[]> {
  try {
    // If no API key is provided, calculate simple keyword matches
    if (!process.env.OPENAI_API_KEY) {
      return calculateSimpleMatchScores(jobs, resume);
    }
    
    // Safely extract resume content for job matching
    const resumeContent = resume.content || {};
    const personalInfo = (resumeContent as any).personalInfo || {};
    const experience = Array.isArray((resumeContent as any).experience) ? (resumeContent as any).experience : [];
    const skills = Array.isArray((resumeContent as any).skills) ? (resumeContent as any).skills : [];
    
    // Detect career path for more accurate matching
    const careerPath = await detectCareerPath({
      personalInfo,
      experience,
      skills
    });
    
    // For each job, calculate match score using OpenAI
    const enhancedJobs = await Promise.all(jobs.map(async (job) => {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are an expert job matching algorithm specializing in ${careerPath.replace('_', ' ')} careers. You will analyze a job description and a candidate's resume to calculate a match percentage between 0-100. Consider skills, experience, and fit. Return your response as JSON.`
            },
            {
              role: "user",
              content: `Analyze the following job and resume information and return a JSON object with a "match" field containing a number from 0-100 representing the match percentage.
              
              Job: ${JSON.stringify(job)}
              
              Candidate Resume: 
              Skills: ${JSON.stringify(skills)}
              Experience: ${JSON.stringify(experience)}
              Personal Info: ${JSON.stringify(personalInfo)}
              Career Path: ${careerPath}
              
              Return your response in JSON format with a match field, for example: {"match": 85}`
            }
          ],
          response_format: { type: "json_object" }
        });
        
        // Safely parse the response with fallback
        const contentStr = response.choices[0].message.content || "{}";
        let result;
        try {
          result = JSON.parse(contentStr);
        } catch (parseError) {
          console.error("Error parsing JSON response:", parseError);
          result = { match: 70 }; // Default value if parsing fails
        }
        
        const matchPercentage = Math.min(Math.max(result.match || 0, 0), 100);
        
        return {
          ...job,
          match: matchPercentage,
          isNew: isNewJob(job.postedAt)
        };
      } catch (error) {
        console.error(`Error matching job ${job.id}:`, error);
        // Fallback to simple match if OpenAI fails
        const matchScore = calculateSimpleMatch(job, resume);
        return {
          ...job,
          match: matchScore,
          isNew: isNewJob(job.postedAt)
        };
      }
    }));
    
    // Sort jobs by match percentage (highest first)
    return enhancedJobs.sort((a, b) => (b.match || 0) - (a.match || 0));
  } catch (error) {
    console.error("Error matching jobs with resume:", error);
    return calculateSimpleMatchScores(jobs, resume);
  }
}

// Helper function to determine if a job is new (posted within the last 3 days)
function isNewJob(postedAt: Date): boolean {
  const now = new Date();
  const threeDaysAgo = new Date(now);
  threeDaysAgo.setDate(now.getDate() - 3);
  
  return new Date(postedAt) >= threeDaysAgo;
}

// Calculate a simple match score based on keyword overlap
function calculateSimpleMatch(job: Job, resume: Resume): number {
  // Safely extract resume content
  const resumeContent = resume.content || {};
  
  // Extract keywords from resume
  const resumeKeywords = new Set<string>();
  
  // Add skills
  if (Array.isArray((resumeContent as any).skills)) {
    (resumeContent as any).skills.forEach((skill: any) => {
      if (skill && skill.name) {
        resumeKeywords.add(skill.name.toLowerCase());
      }
    });
  }
  
  // Add experience keywords
  if (Array.isArray((resumeContent as any).experience)) {
    (resumeContent as any).experience.forEach((exp: any) => {
      if (exp && exp.title) {
        exp.title.toLowerCase().split(/\s+/).forEach((word: string) => {
          if (word.length > 3) resumeKeywords.add(word);
        });
      }
      if (exp && exp.description) {
        exp.description.toLowerCase().split(/\s+/).forEach((word: string) => {
          if (word.length > 3) resumeKeywords.add(word);
        });
      }
    });
  }
  
  // Count matches in job posting
  let matchCount = 0;
  const jobText = `${job.title} ${job.description} ${job.skills.join(' ')}`.toLowerCase();
  
  resumeKeywords.forEach(keyword => {
    if (jobText.includes(keyword)) {
      matchCount++;
    }
  });
  
  // Calculate percentage based on number of matches
  // Floor at 50% and cap at 95% for simple matching
  const baseMatch = Math.min(matchCount * 5, 95);
  return Math.max(baseMatch, 50);
}

// Apply simple match scores to a list of jobs
function calculateSimpleMatchScores(jobs: Job[], resume: Resume): Job[] {
  return jobs.map(job => ({
    ...job,
    match: calculateSimpleMatch(job, resume),
    isNew: isNewJob(job.postedAt)
  })).sort((a, b) => (b.match || 0) - (a.match || 0));
}

// Provide sample resume suggestions when API key is not available
function getSampleResumeSuggestions(resume: Resume, careerPath?: CareerPath): string[] {
  // General suggestions for all career paths
  const generalSuggestions = [
    "Add more measurable achievements to your work experience with specific metrics and results.",
    "Include keywords from the job descriptions you're targeting to improve ATS compatibility.",
    "Strengthen your professional summary to highlight your unique value proposition.",
    "Add relevant certifications or training to showcase your continuous learning.",
    "Consider reorganizing your skills section to prioritize the most in-demand technologies."
  ];
  
  // Career-specific suggestions
  const careerSuggestions: Record<CareerPath, string[]> = {
    software_engineering: [
      "Highlight specific programming languages, frameworks, and development tools you've mastered.",
      "Quantify your coding achievements with metrics like performance improvements or reduced bug rates.",
      "Include links to your GitHub profile or portfolio of projects.",
      "Mention specific software methodologies you're proficient in (Agile, Scrum, etc.).",
      "Add technical certifications like AWS, Microsoft, or language-specific credentials."
    ],
    data_science: [
      "Emphasize your experience with data analysis tools like Python, R, SQL, and visualization libraries.",
      "Quantify the impact of your data analysis with business results and metrics.",
      "Showcase machine learning models you've built and their accuracy rates.",
      "Mention experience with big data technologies like Hadoop, Spark, or cloud platforms.",
      "Include relevant certifications in data science, statistics, or machine learning."
    ],
    design: [
      "Create a visually appealing portfolio link that demonstrates your design capabilities.",
      "Specify design tools you're proficient in (Adobe Creative Suite, Figma, Sketch, etc.).",
      "Quantify design impacts with engagement metrics, conversion improvements, or user feedback.",
      "Include examples of design problems you've solved and your approach.",
      "Mention experience with different design methodologies (UI/UX, design thinking, etc.)."
    ],
    marketing: [
      "Quantify your marketing achievements with specific metrics like ROI, growth rates, or conversion improvements.",
      "List specific marketing platforms and tools you're experienced with.",
      "Highlight your expertise across different marketing channels (social, email, content, etc.).",
      "Include relevant marketing certifications (Google Ads, HubSpot, etc.).",
      "Demonstrate your experience with analytics and data-driven marketing strategies."
    ],
    sales: [
      "Quantify your sales achievements with specific revenue numbers and percentage over targets.",
      "Highlight your experience with CRM platforms and sales technology.",
      "Showcase your closing rates, customer retention, or account growth metrics.",
      "Mention specific sales methodologies you've mastered.",
      "Include relevant sales certifications or training."
    ],
    product_management: [
      "Highlight product launches and improvements you've led with specific metrics.",
      "Detail your experience with product development methodologies.",
      "Quantify the business impact of your product decisions.",
      "Showcase your cross-functional team leadership abilities.",
      "Mention your experience with product analytics and user feedback integration."
    ],
    finance: [
      "Include specific financial models, software, and analysis tools you're proficient with.",
      "Quantify financial improvements you've contributed to.",
      "Highlight relevant certifications (CFA, CPA, etc.).",
      "Mention your experience with financial regulations and compliance.",
      "Showcase your experience with financial planning, analysis, or investment strategies."
    ],
    healthcare: [
      "List relevant medical software systems you're experienced with.",
      "Include any specialized medical training or certifications.",
      "Highlight patient care improvements or healthcare metrics you've influenced.",
      "Mention experience with healthcare regulations and compliance.",
      "Showcase your knowledge of medical terminology and procedures."
    ],
    education: [
      "Highlight teaching methodologies and educational technologies you're experienced with.",
      "Quantify educational outcomes and student achievement metrics.",
      "Include curriculum development or instructional design experience.",
      "Mention educational certifications and specialized training.",
      "Showcase your experience with learning management systems and educational software."
    ],
    customer_service: [
      "Quantify customer satisfaction improvements and resolution rates.",
      "Highlight experience with customer service platforms and CRM systems.",
      "Showcase conflict resolution and problem-solving achievements.",
      "Include relevant customer service certifications.",
      "Mention experience with customer feedback implementation and service improvements."
    ],
    general: generalSuggestions
  };
  
  // Return career-specific suggestions if a career path is provided, otherwise return general suggestions
  return careerPath && careerSuggestions[careerPath] ? careerSuggestions[careerPath] : generalSuggestions;
}

/**
 * Parse a resume file (PDF, DOCX, TXT) and extract structured information
 */
export async function parseResumeFile(filePath: string, fileName: string): Promise<any> {
  // Define a fallback structure to return in case of API errors
  const fallbackResumeData = {
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      headline: "",
      summary: ""
    },
    experience: [],
    education: [],
    skills: [],
    projects: []
  };
  
  try {
    // If no API key is provided, return empty data structure
    if (!process.env.OPENAI_API_KEY) {
      console.warn("OpenAI API key not provided, cannot parse resume file");
      return { success: false, error: "API key not configured" };
    }
    
    // Read the file
    const fileBuffer = fs.readFileSync(filePath);
    const fileExtension = path.extname(fileName).toLowerCase();
    
    let fileContent = "";
    
    // Process files based on their extension using appropriate libraries
    if (fileExtension === '.pdf' || fileExtension === '.docx' || fileExtension === '.txt') {
      try {
        // For PDF files, use pdf-parse to extract the text
        if (fileExtension === '.pdf') {
          try {
            console.log("Parsing PDF file using pdf-parse...");
            const pdfData = await pdfParse(fileBuffer);
            fileContent = pdfData.text || "";
            console.log("PDF text extracted successfully, length:", fileContent.length);
            
            // If extraction failed or returned empty content, provide feedback
            if (!fileContent || fileContent.trim().length < 10) {
              console.log("PDF extraction returned minimal content, may need OCR for scanned documents");
              return { 
                success: true,
                data: fallbackResumeData,
                warning: "Could not extract text from this PDF. It may be a scanned document that requires OCR. Please try a different file format or enter your details manually." 
              };
            }
          } catch (pdfError) {
            console.error("PDF parsing failed:", pdfError);
            return { 
              success: true,
              data: fallbackResumeData,
              warning: "This PDF file could not be parsed. Please try a different format or enter your details manually." 
            };
          }
        } 
        else if (fileExtension === '.docx') {
          // For DOCX, we'd use a library like mammoth, but for now use a placeholder
          console.log("DOCX support requires additional libraries. Using fallback.");
          return { 
            success: true,
            data: fallbackResumeData,
            warning: "DOCX parsing is currently in development. Please upload a PDF or TXT file instead, or enter your details manually." 
          };
        } 
        else {
          // Text files can be read directly
          fileContent = fileBuffer.toString('utf-8');
        }
      } catch (extractionError) {
        console.error("Text extraction error:", extractionError);
        return { 
          success: true,
          data: fallbackResumeData,
          warning: "Could not extract text from the file. Please try a different format or enter details manually." 
        };
      }
      
      // Now parse the extracted text to structure the resume data
      const structureResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert resume parser. Extract structured information from the resume text and format it according to the application's schema. Include personal information, work experience, education, skills, and projects. Return the result as JSON."
          },
          {
            role: "user",
            content: `Parse this resume text and structure it according to the following JSON format:
            {
              "personalInfo": {
                "firstName": "",
                "lastName": "",
                "email": "",
                "phone": "",
                "headline": "",
                "summary": ""
              },
              "experience": [
                {
                  "id": "1",
                  "title": "",
                  "company": "",
                  "startDate": "YYYY-MM",
                  "endDate": "YYYY-MM or 'Present'",
                  "description": ""
                }
              ],
              "education": [
                {
                  "id": "1",
                  "degree": "",
                  "institution": "",
                  "startDate": "YYYY-MM",
                  "endDate": "YYYY-MM",
                  "description": ""
                }
              ],
              "skills": [
                {
                  "id": "1", 
                  "name": "",
                  "proficiency": 1-5
                }
              ],
              "projects": [
                {
                  "id": "1",
                  "title": "",
                  "description": "",
                  "technologies": ["tech1", "tech2"],
                  "link": ""
                }
              ]
            }
            
            Make sure to return valid JSON that matches the structure above.
            
            Resume text:
            ${fileContent}`
          }
        ],
        response_format: { type: "json_object" }
      });
      
      try {
        // Safely handle the response content which could be null
        const contentStr = structureResponse.choices[0].message.content || "{}";
        const parsedData = JSON.parse(contentStr);
        return { success: true, data: parsedData };
      } catch (err) {
        console.error("Error parsing resume structure:", err);
        return { success: false, error: "Failed to parse resume structure" };
      }
    } else {
      return { success: false, error: "Unsupported file format. Please upload PDF, DOCX, or TXT files." };
    }
  } catch (error: any) {
    console.error("Error parsing resume file:", error);
    
    // Check if this is a quota or rate limit error
    if (error?.status === 429 || error?.code === 'insufficient_quota' || 
        (error?.message && error.message.includes('quota'))) {
      return { 
        success: true, // Return success but with minimal data
        data: fallbackResumeData,
        warning: "Using simplified resume format due to API quota limitations. Manual editing required."
      };
    }
    
    // Check for various OpenAI API errors and provide meaningful responses
    if (error?.code === 'invalid_image_format' || 
        (error?.message && (error.message.includes('Invalid MIME type') || error.message.includes('image')))) {
      console.log("Detected format/image error but continuing with text-based extraction");
      // Return fallback data with a warning
      return { 
        success: true,
        data: fallbackResumeData,
        warning: "PDF processing is currently in development. Using template data - please edit manually."
      };
    }
    
    if (error?.type === 'invalid_request_error') {
      console.log("Detected invalid request error:", error.message);
      // Return fallback data with appropriate warning
      return { 
        success: true,
        data: fallbackResumeData,
        warning: "Could not process this file format automatically. Using template - please edit manually."
      };
    }
    
    // Handle errors related to messages and JSON format
    if (error?.message && error.message.includes('messages') && error.message.includes('json')) {
      console.log("Detected JSON format error in messages");
      // Attempt to fix this by using the fallback data with a warning
      return { 
        success: true,
        data: fallbackResumeData,
        warning: "Resume processing is available but encountered a temporary error. Using template - please edit manually."
      };
    }
    
    return { success: false, error: "Failed to parse resume file" };
  }
}
