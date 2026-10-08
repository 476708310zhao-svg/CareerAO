export type Job = {
  id: string;
  company: string;
  companyInitials: string;
  companyColor: string;
  title: string;
  location: string;
  region: "USA" | "Canada" | "UK" | "Singapore";
  type: "Intern" | "New Grad" | "Full Time" | "Research" | "Co-op";
  track: string;
  salary: string;
  match: number;
  visa: string[];
  posted: string;
  deadline: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  skills: string[];
  companyDescription: string;
  sponsorLevel: "Strong" | "Moderate" | "Limited";
  hiringTrend: string;
  interviewProcess: string[];
  officialUrl: string;
};

export const jobs: Job[] = [
  {
    id: "nvidia-ai-engineer-new-grad",
    company: "NVIDIA",
    companyInitials: "NV",
    companyColor: "#76b900",
    title: "AI Engineer — New Grad",
    location: "Santa Clara, CA",
    region: "USA",
    type: "New Grad",
    track: "AI Engineer",
    salary: "$128K–$198K",
    match: 92,
    visa: ["STEM OPT", "H1B Sponsor", "International Student Friendly"],
    posted: "Jul 10, 2026",
    deadline: "Aug 18, 2026",
    description: "Build and optimize production AI systems that help developers deploy accelerated computing workloads at scale.",
    responsibilities: ["Develop inference pipelines for large language models", "Partner with research and platform teams", "Profile and optimize GPU workloads"],
    qualifications: ["MS or BS in Computer Science or a related field", "Strong Python and C++ fundamentals", "Experience with PyTorch or TensorFlow"],
    skills: ["Python", "PyTorch", "LLM", "C++", "CUDA"],
    companyDescription: "NVIDIA pioneered accelerated computing and is shaping the next era of AI infrastructure.",
    sponsorLevel: "Strong",
    hiringTrend: "+18% AI roles over the last 6 months",
    interviewProcess: ["Recruiter screen", "Technical coding", "ML system design", "Team match"],
    officialUrl: "https://www.nvidia.com/en-us/about-nvidia/careers/",
  },
  {
    id: "stripe-software-engineer-intern",
    company: "Stripe",
    companyInitials: "ST",
    companyColor: "#635bff",
    title: "Software Engineer Intern",
    location: "Seattle, WA",
    region: "USA",
    type: "Intern",
    track: "Software Engineer",
    salary: "$58–$65/hr",
    match: 88,
    visa: ["CPT Friendly", "International Student Friendly"],
    posted: "Jul 8, 2026",
    deadline: "Aug 8, 2026",
    description: "Ship user-facing and infrastructure improvements for the economic infrastructure of the internet.",
    responsibilities: ["Design and ship production features", "Collaborate across engineering and product", "Improve system reliability"],
    qualifications: ["Pursuing a technical degree", "Programming experience in any modern language", "Clear written communication"],
    skills: ["Java", "Ruby", "Distributed Systems", "APIs"],
    companyDescription: "Stripe builds programmable financial services used by businesses around the world.",
    sponsorLevel: "Strong",
    hiringTrend: "Intern hiring remains selective and steady",
    interviewProcess: ["Online assessment", "Technical interview", "Manager conversation"],
    officialUrl: "https://stripe.com/jobs",
  },
  {
    id: "shopify-data-scientist",
    company: "Shopify",
    companyInitials: "SH",
    companyColor: "#008060",
    title: "Data Scientist",
    location: "Toronto, ON",
    region: "Canada",
    type: "Full Time",
    track: "Data Scientist",
    salary: "CA$118K–$162K",
    match: 84,
    visa: ["International Student Friendly"],
    posted: "Jul 6, 2026",
    deadline: "Aug 20, 2026",
    description: "Turn product and merchant data into decisions that help millions of businesses grow.",
    responsibilities: ["Build causal and predictive models", "Define product success metrics", "Communicate insights to product leaders"],
    qualifications: ["Degree in a quantitative field", "Advanced SQL and Python", "Experimentation experience"],
    skills: ["Python", "SQL", "Experimentation", "Causal Inference"],
    companyDescription: "Shopify provides essential internet infrastructure for commerce.",
    sponsorLevel: "Moderate",
    hiringTrend: "Data hiring concentrated in product analytics",
    interviewProcess: ["Craft assessment", "Technical deep dive", "Life story interview"],
    officialUrl: "https://www.shopify.com/careers",
  },
  {
    id: "anthropic-ml-research-intern",
    company: "Anthropic",
    companyInitials: "AN",
    companyColor: "#d97757",
    title: "Machine Learning Research Intern",
    location: "London",
    region: "UK",
    type: "Research",
    track: "Machine Learning Engineer",
    salary: "£72K annualized",
    match: 81,
    visa: ["International Student Friendly"],
    posted: "Jul 5, 2026",
    deadline: "Jul 31, 2026",
    description: "Explore techniques that make advanced AI systems more reliable, interpretable, and aligned.",
    responsibilities: ["Run empirical alignment research", "Design evaluations", "Share results with research teams"],
    qualifications: ["Strong ML research track record", "Fluent Python", "Experience training deep learning models"],
    skills: ["Python", "Transformers", "Evaluation", "Research"],
    companyDescription: "Anthropic is an AI safety and research company building reliable AI systems.",
    sponsorLevel: "Moderate",
    hiringTrend: "Research team expanding in London",
    interviewProcess: ["Research screen", "Technical exercise", "Research presentation", "Team interviews"],
    officialUrl: "https://www.anthropic.com/careers",
  },
  {
    id: "grab-cybersecurity-engineer",
    company: "Grab",
    companyInitials: "GR",
    companyColor: "#00b14f",
    title: "Cybersecurity Engineer",
    location: "Singapore",
    region: "Singapore",
    type: "Full Time",
    track: "Cybersecurity",
    salary: "S$82K–$118K",
    match: 78,
    visa: ["International Student Friendly"],
    posted: "Jul 3, 2026",
    deadline: "Aug 12, 2026",
    description: "Protect a large-scale consumer platform through security automation and resilient architecture.",
    responsibilities: ["Automate security detection", "Conduct architecture reviews", "Respond to security incidents"],
    qualifications: ["Security engineering fundamentals", "Python or Go", "Cloud platform experience"],
    skills: ["Cloud Security", "Python", "Go", "SIEM"],
    companyDescription: "Grab is Southeast Asia’s leading superapp across deliveries, mobility, and financial services.",
    sponsorLevel: "Moderate",
    hiringTrend: "Security investment increasing across platform teams",
    interviewProcess: ["Recruiter screen", "Security case", "Technical panel", "Leadership interview"],
    officialUrl: "https://www.grab.careers/",
  },
  {
    id: "tesla-hardware-engineer-coop",
    company: "Tesla",
    companyInitials: "TS",
    companyColor: "#e82127",
    title: "Hardware Engineer Co-op",
    location: "Palo Alto, CA",
    region: "USA",
    type: "Co-op",
    track: "Hardware",
    salary: "$32–$46/hr",
    match: 74,
    visa: ["CPT Friendly", "STEM OPT"],
    posted: "Jul 1, 2026",
    deadline: "Aug 2, 2026",
    description: "Design, validate, and improve electronics used in next-generation energy and mobility products.",
    responsibilities: ["Prototype circuit designs", "Run validation tests", "Partner with firmware teams"],
    qualifications: ["Pursuing EE or Computer Engineering", "PCB design experience", "Lab instrumentation skills"],
    skills: ["PCB", "Altium", "Embedded Systems", "Validation"],
    companyDescription: "Tesla accelerates the world’s transition to sustainable energy.",
    sponsorLevel: "Limited",
    hiringTrend: "Hardware roles stable across autonomy and energy",
    interviewProcess: ["Recruiter screen", "Technical panel", "Design exercise"],
    officialUrl: "https://www.tesla.com/careers",
  },
];

export function getJob(id: string) {
  return jobs.find((job) => job.id === id);
}
