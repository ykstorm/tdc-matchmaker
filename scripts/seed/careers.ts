import type { EducationLevel, Profession } from "../../src/types/profile";

interface Career {
  share: number;
  // Annual pay in lakhs at 22, plus how much a year of experience adds.
  startingLakhs: number;
  yearlyRaiseLakhs: number;
  degrees: Record<EducationLevel, string>;
  colleges: string[];
  companies: string[];
  titles: [junior: string, mid: string, senior: string];
}

export const CAREERS: Record<Profession, Career> = {
  Technology: {
    share: 28, startingLakhs: 9, yearlyRaiseLakhs: 2.6,
    degrees: { Bachelors: "B.Tech, Computer Science", Masters: "M.Tech, Computer Science", Doctorate: "PhD, Computer Science" },
    colleges: ["IIT Bombay", "IIT Delhi", "BITS Pilani", "NIT Trichy", "VIT Vellore", "Manipal University Jaipur", "IIIT Hyderabad"],
    companies: ["Infosys", "TCS", "Flipkart", "Razorpay", "Zoho", "Microsoft India", "Swiggy", "Freshworks"],
    titles: ["Software Engineer", "Senior Software Engineer", "Engineering Manager"],
  },
  Finance: {
    share: 13, startingLakhs: 8, yearlyRaiseLakhs: 2.4,
    degrees: { Bachelors: "B.Com, Chartered Accountant", Masters: "MBA, Finance", Doctorate: "PhD, Economics" },
    colleges: ["SRCC Delhi", "Narsee Monjee Mumbai", "IIM Ahmedabad", "Christ University", "Loyola College Chennai"],
    companies: ["HDFC Bank", "ICICI Bank", "Kotak Mahindra", "Axis Bank", "Bajaj Finserv"],
    titles: ["Analyst", "Associate Vice President", "Vice President"],
  },
  Medicine: {
    share: 10, startingLakhs: 6, yearlyRaiseLakhs: 3,
    degrees: { Bachelors: "MBBS", Masters: "MD, Internal Medicine", Doctorate: "DM, Cardiology" },
    colleges: ["AIIMS Delhi", "CMC Vellore", "KEM Mumbai", "Madras Medical College", "Kasturba Medical College"],
    companies: ["Apollo Hospitals", "Fortis Healthcare", "Manipal Hospitals", "Max Healthcare", "Narayana Health"],
    titles: ["Resident Doctor", "Consultant", "Senior Consultant"],
  },
  Law: {
    share: 6, startingLakhs: 8, yearlyRaiseLakhs: 2.5,
    degrees: { Bachelors: "BA LLB", Masters: "LLM, Corporate Law", Doctorate: "PhD, Law" },
    colleges: ["NLSIU Bengaluru", "NALSAR Hyderabad", "NLU Delhi", "Government Law College Mumbai"],
    companies: ["Cyril Amarchand Mangaldas", "AZB and Partners", "Khaitan and Co", "Trilegal"],
    titles: ["Associate", "Senior Associate", "Partner"],
  },
  Design: {
    share: 7, startingLakhs: 5, yearlyRaiseLakhs: 1.8,
    degrees: { Bachelors: "B.Des", Masters: "M.Des", Doctorate: "PhD, Design" },
    colleges: ["NID Ahmedabad", "NIFT Delhi", "Srishti Bengaluru", "IDC IIT Bombay"],
    companies: ["Myntra", "Titan", "Fabindia", "Ogilvy India", "CRED"],
    titles: ["Product Designer", "Senior Designer", "Design Lead"],
  },
  Education: {
    share: 9, startingLakhs: 4, yearlyRaiseLakhs: 0.9,
    degrees: { Bachelors: "B.Ed", Masters: "MA, English Literature", Doctorate: "PhD, Sociology" },
    colleges: ["Delhi University", "Jadavpur University", "University of Hyderabad", "Banaras Hindu University"],
    companies: ["Delhi Public School", "Ashoka University", "Kendriya Vidyalaya", "Christ University"],
    titles: ["Teacher", "Assistant Professor", "Associate Professor"],
  },
  Business: {
    share: 11, startingLakhs: 6, yearlyRaiseLakhs: 3.2,
    degrees: { Bachelors: "BBA", Masters: "MBA", Doctorate: "PhD, Management" },
    colleges: ["Symbiosis Pune", "NMIMS Mumbai", "IIM Bangalore", "Shaheed Sukhdev College"],
    companies: ["Family business", "Own startup", "Reliance Retail", "Asian Paints", "Hindustan Unilever"],
    titles: ["Manager", "Director", "Founder"],
  },
  Government: {
    share: 7, startingLakhs: 6, yearlyRaiseLakhs: 1.1,
    degrees: { Bachelors: "BA, Political Science", Masters: "MA, Public Policy", Doctorate: "PhD, Public Policy" },
    colleges: ["St. Stephen's College", "Presidency College Chennai", "Fergusson College Pune", "Delhi University"],
    companies: ["Indian Administrative Service", "Reserve Bank of India", "Indian Railways", "State Government"],
    titles: ["Officer", "Deputy Director", "Director"],
  },
  Consulting: {
    share: 9, startingLakhs: 12, yearlyRaiseLakhs: 3.4,
    degrees: { Bachelors: "B.Tech, Mechanical", Masters: "MBA, Strategy", Doctorate: "PhD, Economics" },
    colleges: ["IIM Ahmedabad", "IIM Calcutta", "ISB Hyderabad", "IIT Madras", "XLRI Jamshedpur"],
    companies: ["McKinsey", "Boston Consulting Group", "Bain", "EY", "KPMG"],
    titles: ["Consultant", "Engagement Manager", "Principal"],
  },
};

export const FATHER_JOBS = ["Retired government officer", "Businessman", "Doctor", "Bank manager", "Engineer", "Professor", "Retired army officer", "Farmer"];
export const MOTHER_JOBS = ["Homemaker", "Homemaker", "Homemaker", "Teacher", "Doctor", "Government employee", "Runs a boutique"];
export const HOBBIES = ["reading", "trekking", "cooking", "classical music", "cricket", "badminton", "travel", "photography", "yoga", "painting", "theatre", "running", "board games", "gardening", "dance"];
