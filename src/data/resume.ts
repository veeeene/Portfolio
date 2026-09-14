export interface Project {
  id: string;
  title: string;
  role: string;
  period: string;
  description: string;
  tags: string[];
  link?: string;
  github?: string;
  featured?: boolean;
  award?: string;
  image?: string;
  details: string[];
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  year: string;
  verified?: boolean;
  link?: string;
  image?: string;
}

export interface StatItem {
  value: string;
  label: string;
  href: string;
  external?: boolean;
}

export interface ExperienceItem {
  year: string;
  role: string;
  organization: string;
  type: "project" | "work" | "education";
}

export const RESUME_DATA = {
  name: "JUSTINE T. VENERACION",
  shortName: "Justine Veneracion",
  pixelName: "Justine Veneracion",
  role: "Full-Stack Developer & IT Student",
  specialization: "Web & Mobile Application Development",
  location: "Bulacan, Philippines",
  address: "1385 Viceo Street, Caingin, San Rafael, Bulacan",
  phone: "09225611306",
  email: "veneracionjustine@gmail.com",
  github: "https://github.com/veeeene",
  githubHandle: "veeeene",
  
  objective:
    "Seeking an internship or junior developer role where I can apply my web development, offline-first engineering, and mobile app design skills to build impactful real-world digital products.",
  
  aboutLead:
    "I'm a full-stack developer and IT student at BulSU Bustos Campus. I build scalable web applications, explore 2D game physics, and develop offline-first platforms.",
  
  aboutSecondary:
    "Currently focused on modern React/Next.js architectures, Supabase backend integrations, and game environment design. I love taking complex workflows and turning them into intuitive, robust digital experiences.",

  stats: [
    { value: "5+", label: "Projects Shipped", href: "#projects" },
    { value: "4+", label: "Frameworks Mastered", href: "#stack" },
    { value: "BSIT", label: "BulSU Bustos", href: "#education" },
    { value: "480+", label: "GitHub Contributions", href: "#activity" },
  ] as StatItem[],

  education: [
    {
      degree: "Bachelor of Science in Information Technology",
      major: "Major in Web and Mobile Application Development",
      school: "Bulacan State University – Bustos Campus",
      period: "2023 – Present",
      location: "Bustos, Bulacan",
    },
    {
      degree: "Senior High School — STEM Strand",
      school: "San Rafael National Trade School",
      period: "2021 – 2023",
      location: "Caingin, San Rafael, Bulacan",
    },
  ],

  projects: [
    {
      id: "taleknow",
      title: "TaLE-Know: Gamified LMS",
      subtitle: "Gamified Learning Management System for Technology & Livelihood Education",
      role: "Full-Stack Developer & Git Administrator",
      period: "September 2026",
      tags: ["Next.js", "React", "Supabase", "TanStack Query", "PWA"],
      link: "https://www.taleknow-lms.site",
      featured: true,
      award: "#1 Capstone LMS",
      image: "/images/projects/taleknow.svg",
      description:
        "A gamified LMS with role-based access control, offline-first PWA caching, and optimized asynchronous data synchronization.",
      details: [
        "Managed the team's central GitHub repository and established standardized Git branching workflows.",
        "Developed the Next.js and Supabase backend with authentication and role-based access control (RBAC) across 4 roles.",
        "Enabled offline-first support using PWA service workers and IndexedDB for local data persistence.",
        "Integrated TanStack Query across all modules to optimize asynchronous data fetching and caching.",
      ],
    },
    {
      id: "campus-breakout",
      title: "Campus Breakout: 2D Horror",
      subtitle: "2D Top-Down Survival Horror Game",
      role: "Environment Artist",
      period: "April 2026",
      tags: ["Unity", "C#", "2D Physics", "Tilemaps"],
      link: "https://campusbreakout.vercel.app",
      featured: true,
      award: "Featured Game",
      image: "/images/projects/campusbreakout.svg",
      description:
        "Atmospheric 2D top-down survival horror with custom tilemaps, 2D physics layers, and strategic navigation choke points.",
      details: [
        "Built atmospheric 2D campus environments in Unity using custom tilemaps and sprite assets.",
        "Configured 2D physics layers, collision boundaries, and obstacle choke points for zombie navigation.",
        "Designed progressive difficulty levels and atmospheric lighting to maximize tension.",
      ],
    },
    {
      id: "tripstays",
      title: "TripStays: Booking Web App",
      subtitle: "Accommodation & Services Booking Platform",
      role: "Full-Stack Developer",
      period: "November 2025",
      tags: ["React", "Firebase", "Node.js", "PayPal API"],
      link: "https://tripstays-cba33.web.app",
      featured: true,
      award: "Full-Stack Platform",
      image: "/images/projects/tripstays.svg",
      description:
        "An end-to-end booking platform for discovering accommodations and local experiences with real-time Firebase persistence and PayPal checkout.",
      details: [
        "Built an end-to-end booking web platform for discovering and reserving accommodations and local experiences.",
        "Managed real-time persistence with Firebase Firestore and integrated the PayPal API for secure payments.",
        "Engineered responsive search filters and instant booking verification flows.",
      ],
    },
    {
      id: "clot",
      title: "Clot: E-Commerce Mobile App",
      subtitle: "Mobile App UI/UX Design & Prototyping",
      role: "UI/UX Designer",
      period: "November 2025",
      tags: ["Figma", "UI/UX", "Prototyping", "Smart Animate"],
      featured: false,
      image: "/images/projects/clot.svg",
      description:
        "Comprehensive Figma design system and high-fidelity prototype featuring brand visual styling, animated onboarding, and modal bottom sheets.",
      details: [
        "Customized a community UI kit in Figma by establishing a new brand color scheme and visual styling.",
        "Designed and integrated custom multi-frame animated splash screens and onboarding transition flows.",
        "Built interactive Figma prototypes featuring smart-animate transitions for auth screens and modal bottom sheets.",
      ],
    },
    {
      id: "parkease",
      title: "ParkEase: Parking Management",
      subtitle: "Desktop Parking Management System",
      role: "Team Lead & Core Developer",
      period: "May 2025",
      tags: ["Java", "NetBeans", "MySQL", "JDBC"],
      featured: false,
      image: "/images/projects/parkease.svg",
      description:
        "Desktop management software in Java connected via JDBC to MySQL for real-time slot allocation, billing, and vehicle logging.",
      details: [
        "Led team development of a desktop parking system in Java using NetBeans IDE.",
        "Integrated a MySQL database via JDBC to manage real-time slot allocation and vehicle logs.",
        "Designed an intuitive desktop GUI with strict input validation to streamline parking operations.",
      ],
    },
  ],

  experiences: [
    {
      year: "2026",
      role: "Full-Stack Developer & Git Admin",
      organization: "TaLE-Know LMS",
      type: "project",
    },
    {
      year: "2026",
      role: "Environment Artist & 2D Designer",
      organization: "Campus Breakout (Unity)",
      type: "project",
    },
    {
      year: "2025",
      role: "Full-Stack Developer",
      organization: "TripStays Booking Platform",
      type: "project",
    },
    {
      year: "2025",
      role: "UI/UX Designer",
      organization: "Clot Mobile E-Commerce",
      type: "project",
    },
    {
      year: "2025",
      role: "Team Lead & Desktop Developer",
      organization: "ParkEase Management System",
      type: "project",
    },
    {
      year: "2023",
      role: "BS Information Technology Student",
      organization: "Bulacan State University",
      type: "education",
    },
  ] as ExperienceItem[],

  skills: {
    system: ["Web Applications", "Mobile Applications", "2D Games", "Offline-First PWAs"],
    frontend: ["Next.js", "React.js", "HTML5 & CSS3", "Tailwind CSS", "JavaScript (ES6+)", "TypeScript"],
    backend: ["Node.js", "Next.js API Routes", "Supabase", "Firebase Firestore", "MySQL", "PostgreSQL"],
    tools: ["Git & GitHub", "AI-Assisted Dev", "Figma", "Unity", "NetBeans", "Postman"],
    soft: ["Problem Solving", "Adaptability", "Team Collaboration", "Communication", "Time Management"],
  },

  certifications: [
    {
      id: "html-essentials",
      title: "HTML Essentials",
      issuer: "Cisco Networking Academy / DICT-ITU DTC",
      year: "2025",
      verified: true,
    },
    {
      id: "packet-tracer",
      title: "Getting Started with Cisco Packet Tracer",
      issuer: "Cisco Networking Academy",
      year: "2025",
      verified: true,
    },
    {
      id: "azure-ai",
      title: "Azure AI Foundry & Retrieval Augmented Generation",
      issuer: "BulSU Bustos Campus",
      year: "2025",
      verified: true,
    },
    {
      id: "asics-summit-2",
      title: "2nd ASICS Summit: ReimAgine Tomorrow",
      issuer: "BulSU Bustos Campus",
      year: "2025",
      verified: true,
    },
    {
      id: "asics-summit-1",
      title: "1st ASICS Summit",
      issuer: "BulSU Bustos Campus",
      year: "2024",
      verified: true,
    },
  ],

  reference: {
    name: "Mr. Cyril N. Cahigas",
    title: "Information Technology Architect",
    company: "CMIT Inc.",
    contact: "0927-943-0287",
    quote:
      "A dedicated, adaptable, and forward-thinking developer with genuine problem-solving capability in modern application development and technical collaboration.",
  },
};
