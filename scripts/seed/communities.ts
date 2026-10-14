// Names, places and castes travel together in India. A Reddy from Hyderabad
// who speaks Telugu reads as real; a Reddy from Amritsar does not. So each
// community carries its own lists instead of drawing every field at random.

export interface Community {
  religion: string;
  motherTongue: string;
  share: number;
  vegetarianShare: number;
  places: { city: string; state: string }[];
  surnames: string[];
  castes: string[];
  maleNames: string[];
  femaleNames: string[];
}

const hinduMale = ["Aarav", "Rohan", "Vikram", "Aditya", "Karan", "Siddharth", "Nikhil", "Rahul", "Arjun", "Varun"];
const hinduFemale = ["Ananya", "Priya", "Neha", "Kavya", "Ishita", "Riya", "Shreya", "Pooja", "Aditi", "Meera"];

export const COMMUNITIES: Community[] = [
  {
    religion: "Hindu", motherTongue: "Hindi", share: 24, vegetarianShare: 0.5,
    places: [{ city: "Delhi", state: "Delhi" }, { city: "Jaipur", state: "Rajasthan" }, { city: "Lucknow", state: "Uttar Pradesh" }, { city: "Indore", state: "Madhya Pradesh" }, { city: "Gurugram", state: "Haryana" }],
    surnames: ["Sharma", "Verma", "Gupta", "Agarwal", "Rathore", "Srivastava", "Mishra", "Chauhan"],
    castes: ["Brahmin", "Kayastha", "Agarwal", "Rajput"],
    maleNames: [...hinduMale, "Ayush", "Harsh", "Abhishek"],
    femaleNames: [...hinduFemale, "Tanvi", "Sakshi", "Nidhi"],
  },
  {
    religion: "Hindu", motherTongue: "Marathi", share: 11, vegetarianShare: 0.35,
    places: [{ city: "Mumbai", state: "Maharashtra" }, { city: "Pune", state: "Maharashtra" }, { city: "Nagpur", state: "Maharashtra" }],
    surnames: ["Kulkarni", "Deshpande", "Patil", "Joshi", "Pawar", "Gokhale"],
    castes: ["Maratha", "Deshastha Brahmin", "Chitpavan Brahmin"],
    maleNames: ["Omkar", "Saurabh", "Tejas", "Aniket", "Prathamesh", ...hinduMale.slice(0, 4)],
    femaleNames: ["Sayali", "Gauri", "Mrunal", "Ketaki", "Rutuja", ...hinduFemale.slice(0, 4)],
  },
  {
    religion: "Hindu", motherTongue: "Gujarati", share: 8, vegetarianShare: 0.8,
    places: [{ city: "Ahmedabad", state: "Gujarat" }, { city: "Surat", state: "Gujarat" }, { city: "Vadodara", state: "Gujarat" }, { city: "Mumbai", state: "Maharashtra" }],
    surnames: ["Patel", "Shah", "Mehta", "Desai", "Trivedi"],
    castes: ["Patel", "Baniya", "Brahmin"],
    maleNames: ["Dhruv", "Parth", "Harshil", "Jay", "Kunal", "Yash"],
    femaleNames: ["Krupa", "Hetal", "Riddhi", "Jinal", "Khushi", "Dhara"],
  },
  {
    religion: "Hindu", motherTongue: "Tamil", share: 9, vegetarianShare: 0.55,
    places: [{ city: "Chennai", state: "Tamil Nadu" }, { city: "Coimbatore", state: "Tamil Nadu" }, { city: "Bengaluru", state: "Karnataka" }],
    surnames: ["Iyer", "Subramanian", "Krishnan", "Raman", "Venkatesan"],
    castes: ["Iyer", "Iyengar", "Mudaliar", "Chettiar"],
    maleNames: ["Karthik", "Vignesh", "Arvind", "Hari", "Prakash", "Surya"],
    femaleNames: ["Lakshmi", "Divya", "Janani", "Keerthana", "Nandhini", "Swathi"],
  },
  {
    religion: "Hindu", motherTongue: "Telugu", share: 8, vegetarianShare: 0.25,
    places: [{ city: "Hyderabad", state: "Telangana" }, { city: "Vijayawada", state: "Andhra Pradesh" }, { city: "Visakhapatnam", state: "Andhra Pradesh" }],
    surnames: ["Reddy", "Rao", "Naidu", "Chowdary", "Varma"],
    castes: ["Reddy", "Kamma", "Naidu", "Brahmin"],
    maleNames: ["Sai", "Charan", "Teja", "Manoj", "Srinivas", "Pavan"],
    femaleNames: ["Sravya", "Harika", "Sindhu", "Bhavana", "Lasya", "Deepika"],
  },
  {
    religion: "Hindu", motherTongue: "Bengali", share: 7, vegetarianShare: 0.1,
    places: [{ city: "Kolkata", state: "West Bengal" }, { city: "Delhi", state: "Delhi" }],
    surnames: ["Chatterjee", "Banerjee", "Bose", "Ghosh", "Mukherjee", "Sen"],
    castes: ["Brahmin", "Kayastha", "Vaidya"],
    maleNames: ["Arnab", "Sourav", "Debjit", "Anirban", "Ritwik"],
    femaleNames: ["Ankita", "Sreya", "Paromita", "Rimjhim", "Trisha"],
  },
  {
    religion: "Hindu", motherTongue: "Kannada", share: 6, vegetarianShare: 0.45,
    places: [{ city: "Bengaluru", state: "Karnataka" }, { city: "Mysuru", state: "Karnataka" }, { city: "Mangaluru", state: "Karnataka" }],
    surnames: ["Gowda", "Shetty", "Hegde", "Bhat", "Rao"],
    castes: ["Vokkaliga", "Bunt", "Brahmin", "Lingayat"],
    maleNames: ["Chirag", "Darshan", "Pradeep", "Shashank", "Vinay"],
    femaleNames: ["Apoorva", "Chaitra", "Sahana", "Spoorthi", "Vidya"],
  },
  {
    religion: "Hindu", motherTongue: "Malayalam", share: 5, vegetarianShare: 0.2,
    places: [{ city: "Kochi", state: "Kerala" }, { city: "Thiruvananthapuram", state: "Kerala" }, { city: "Bengaluru", state: "Karnataka" }],
    surnames: ["Nair", "Menon", "Pillai", "Kurup"],
    castes: ["Nair", "Ezhava", "Namboodiri"],
    maleNames: ["Arun", "Vishnu", "Gokul", "Sreejith", "Akhil"],
    femaleNames: ["Anjali", "Aparna", "Gayathri", "Revathi", "Athira"],
  },
  {
    religion: "Muslim", motherTongue: "Urdu", share: 9, vegetarianShare: 0.02,
    places: [{ city: "Lucknow", state: "Uttar Pradesh" }, { city: "Hyderabad", state: "Telangana" }, { city: "Mumbai", state: "Maharashtra" }, { city: "Delhi", state: "Delhi" }],
    surnames: ["Khan", "Shaikh", "Siddiqui", "Ansari", "Qureshi", "Hussain"],
    castes: ["Sunni", "Shia"],
    maleNames: ["Ayaan", "Faizan", "Imran", "Zaid", "Arsalan", "Rehan"],
    femaleNames: ["Ayesha", "Zara", "Sana", "Mehreen", "Alina", "Fatima"],
  },
  {
    religion: "Sikh", motherTongue: "Punjabi", share: 5, vegetarianShare: 0.35,
    places: [{ city: "Chandigarh", state: "Punjab" }, { city: "Amritsar", state: "Punjab" }, { city: "Ludhiana", state: "Punjab" }, { city: "Delhi", state: "Delhi" }],
    surnames: ["Gill", "Sandhu", "Bedi", "Ahluwalia", "Dhillon"],
    castes: ["Jat", "Khatri", "Arora"],
    maleNames: ["Harpreet", "Gurpreet", "Jasmeet", "Manveer", "Amandeep"],
    femaleNames: ["Simran", "Harleen", "Navneet", "Jasleen", "Prabhjot"],
  },
  {
    religion: "Christian", motherTongue: "Malayalam", share: 4, vegetarianShare: 0.03,
    places: [{ city: "Kochi", state: "Kerala" }, { city: "Kottayam", state: "Kerala" }, { city: "Bengaluru", state: "Karnataka" }, { city: "Mumbai", state: "Maharashtra" }],
    surnames: ["Thomas", "Mathew", "George", "Varghese", "Joseph"],
    castes: ["Syro-Malabar Catholic", "Latin Catholic", "Marthoma"],
    maleNames: ["Alan", "Jerin", "Kevin", "Nevin", "Joel"],
    femaleNames: ["Ann", "Merin", "Neenu", "Teresa", "Sneha"],
  },
  {
    religion: "Jain", motherTongue: "Gujarati", share: 4, vegetarianShare: 1,
    places: [{ city: "Mumbai", state: "Maharashtra" }, { city: "Ahmedabad", state: "Gujarat" }, { city: "Jaipur", state: "Rajasthan" }],
    surnames: ["Jain", "Shah", "Mehta", "Doshi", "Sanghvi"],
    castes: ["Shwetambar", "Digambar"],
    maleNames: ["Rishabh", "Akshat", "Moksh", "Vatsal", "Pranay"],
    femaleNames: ["Palak", "Nupur", "Disha", "Vidhi", "Shruti"],
  },
];

export const GOTRAS = ["Kashyap", "Bharadwaj", "Vashishtha", "Gautam", "Atri", "Vatsa", "Sandilya", "Garg"];
export const RASHIS = ["Mesh", "Vrishabh", "Mithun", "Kark", "Simha", "Kanya", "Tula", "Vrishchik", "Dhanu", "Makar", "Kumbh", "Meen"];
