// SAMPLE / DEMONSTRATION DATA. Facts are simplified summaries for demo purposes and
// must be verified against official sources before production use.
import type { Localized } from "@/lib/i18n";

export const CATEGORIES = [
  "Education",
  "Agriculture",
  "Employment",
  "Healthcare",
  "Women and Child Development",
  "Business and Entrepreneurship",
  "Housing",
  "Financial Assistance",
  "Social Welfare",
  "Skill Development",
  "Disability Support",
  "Other Government Services",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const STATES = ["All India", "Assam", "Meghalaya", "Arunachal Pradesh", "Nagaland", "Manipur", "Mizoram", "Tripura", "Sikkim"];
export const DISTRICTS: Record<string, string[]> = {
  Assam: ["Kamrup Metro", "Kamrup", "Dibrugarh", "Jorhat", "Nagaon", "Cachar", "Barpeta", "Tinsukia", "Sonitpur"],
  Meghalaya: ["East Khasi Hills", "West Garo Hills", "Ri-Bhoi"],
  "Arunachal Pradesh": ["Papum Pare", "Tawang", "East Siang"],
  Tripura: ["West Tripura", "Gomati"],
};
export const BENEFICIARIES = ["Farmers", "Students", "Women", "Senior Citizens", "Workers", "Small Business", "Persons with Disability", "Rural Families", "Youth"];

export type Question = {
  id: string;
  q: Localized;
  options: { label: Localized; value: string }[];
  pass: string[]; // values that satisfy the condition
  unknown?: string[]; // values meaning "need more info"
  explain: string;
  source: string;
};

export type Scheme = {
  id: string;
  name: Localized;
  short: Localized;
  department: string;
  category: Category;
  state: string;
  level: "Central" | "State";
  beneficiaries: string[];
  benefits: string[];
  eligibilitySummary: string;
  updated: string;
  views: number;
  purpose: string;
  whoBenefits: string;
  eligibility: string[];
  financial?: string;
  documents: string[];
  steps: string[];
  dates: { label: string; date: string }[];
  officialUrl?: string;
  sourceDoc: string;
  verified: string;
  aiSimple: Localized;
  questions: Question[];
};

const yesNo = (yes = "Yes", no = "No") => [
  { label: { en: yes, hi: "हाँ", as: "হয়", bn: "হ্যাঁ" }, value: "yes" },
  { label: { en: no, hi: "नहीं", as: "নহয়", bn: "না" }, value: "no" },
  { label: { en: "Not sure", hi: "पता नहीं", as: "নিশ্চিত নহয়", bn: "নিশ্চিত নই" }, value: "unsure" },
];
const residentQ = (state: string): Question => ({
  id: "state",
  q: { en: "Which state do you live in?", hi: "आप किस राज्य में रहते हैं?", as: "আপুনি কোন ৰাজ্যত থাকে?", bn: "আপনি কোন রাজ্যে থাকেন?" },
  options: [
    { label: { en: "Assam", hi: "असम", as: "অসম", bn: "আসাম" }, value: "Assam" },
    { label: { en: "Other Northeast state", hi: "अन्य पूर्वोत्तर राज्य", as: "অন্য উত্তৰ-পূব ৰাজ্য", bn: "অন্য উত্তর-পূর্ব রাজ্য" }, value: "NE" },
    { label: { en: "Elsewhere in India", hi: "भारत में कहीं और", as: "ভাৰতৰ অন্য ঠাইত", bn: "ভারতের অন্য কোথাও" }, value: "IN" },
  ],
  pass: state === "Assam" ? ["Assam"] : ["Assam", "NE", "IN"],
  explain: state === "Assam" ? "This is an Assam Government scheme, so you must be a resident of Assam." : "This is a Central scheme available across India.",
  source: "Scheme guidelines, Section 2 – Coverage (sample)",
});
const incomeQ = (limit: string, passVals: string[]): Question => ({
  id: "income",
  q: { en: "What is your annual household income?", hi: "आपकी वार्षिक पारिवारिक आय कितनी है?", as: "আপোনাৰ বাৰ্ষিক পাৰিবাৰিক আয় কিমান?", bn: "আপনার বার্ষিক পারিবারিক আয় কত?" },
  options: [
    { label: { en: "Below ₹1 lakh" }, value: "lt1" },
    { label: { en: "₹1 – 2 lakh" }, value: "1to2" },
    { label: { en: "₹2 – 5 lakh" }, value: "2to5" },
    { label: { en: "Above ₹5 lakh" }, value: "gt5" },
    { label: { en: "Prefer not to say", hi: "बताना नहीं चाहते", as: "ক'ব নিবিচাৰোঁ", bn: "বলতে চাই না" }, value: "unsure" },
  ],
  pass: passVals,
  unknown: ["unsure"],
  explain: `Household income must be within the scheme limit (${limit}).`,
  source: "Scheme guidelines, Section 3.1 – Income criteria (sample)",
});

export const SCHEMES: Scheme[] = [
  {
    id: "pm-kisan",
    name: { en: "PM-KISAN Samman Nidhi", hi: "पीएम-किसान सम्मान निधि", as: "পিএম-কিষাণ সন্মান নিধি", bn: "পিএম-কিষাণ সম্মান নিধি" },
    short: {
      en: "Direct income support of ₹6,000 per year to landholding farmer families, paid in three instalments.",
      hi: "भूमिधारक किसान परिवारों को प्रति वर्ष ₹6,000 की सीधी आय सहायता, तीन किस्तों में।",
      as: "মাটিৰ গৰাকী কৃষক পৰিয়ালক বছৰি ₹৬,০০০ প্ৰত্যক্ষ আয় সাহায্য, তিনিটা কিস্তিত।",
      bn: "জমির মালিক কৃষক পরিবারকে বছরে ₹৬,০০০ সরাসরি আয় সহায়তা, তিন কিস্তিতে।",
    },
    department: "Ministry of Agriculture & Farmers Welfare",
    category: "Agriculture",
    state: "All India",
    level: "Central",
    beneficiaries: ["Farmers", "Rural Families"],
    benefits: ["₹6,000 per year", "3 instalments of ₹2,000", "Direct bank transfer"],
    eligibilitySummary: "Landholding farmer families; income-tax payers and some professionals excluded.",
    updated: "2026-09-12",
    views: 18420,
    purpose: "To support small and marginal farmers with their farming and household needs.",
    whoBenefits: "Farmer families who own cultivable land in their name.",
    eligibility: ["Family owns cultivable land", "Land records are in the farmer's name", "Not an income-tax payer", "Not a serving or retired government officer (some exclusions apply)"],
    financial: "₹2,000 every four months, transferred directly to the bank account linked with Aadhaar.",
    documents: ["Aadhaar card", "Land ownership record (Jamabandi / Patta)", "Bank account passbook", "Mobile number"],
    steps: ["Visit the PM-KISAN portal or nearest Common Service Centre (CSC)", "Choose 'New Farmer Registration'", "Enter Aadhaar and land details", "Complete e-KYC with OTP", "Track status online"],
    dates: [{ label: "Registration", date: "Open all year" }, { label: "Next instalment (sample)", date: "Nov 2026" }],
    officialUrl: "https://pmkisan.gov.in",
    sourceDoc: "PM-KISAN Operational Guidelines (sample reference)",
    verified: "2026-09-12",
    aiSimple: {
      en: "If you are a farmer and own land, the government can send you ₹6,000 every year in three parts directly into your bank. You need Aadhaar, land papers and a bank account.",
      hi: "यदि आप किसान हैं और आपके पास ज़मीन है, तो सरकार हर साल ₹6,000 तीन हिस्सों में सीधे आपके बैंक में भेज सकती है। आधार, ज़मीन के कागज़ और बैंक खाता चाहिए।",
      as: "আপুনি যদি কৃষক আৰু আপোনাৰ মাটি আছে, চৰকাৰে বছৰি ₹৬,০০০ তিনিটা ভাগত পোনপটীয়াকৈ আপোনাৰ বেংকলৈ পঠিয়াব পাৰে। আধাৰ, মাটিৰ কাগজ আৰু বেংক একাউণ্ট লাগিব।",
      bn: "আপনি যদি কৃষক হন এবং আপনার জমি থাকে, সরকার প্রতি বছর ₹৬,০০০ তিন ভাগে সরাসরি আপনার ব্যাংকে পাঠাতে পারে। আধার, জমির কাগজ ও ব্যাংক অ্যাকাউন্ট লাগবে।",
    },
    questions: [
      residentQ("All India"),
      { id: "land", q: { en: "Does your family own farming land in your name?", hi: "क्या आपके परिवार के नाम पर खेती की ज़मीन है?", as: "আপোনাৰ পৰিয়ালৰ নামত খেতিৰ মাটি আছে নে?", bn: "আপনার পরিবারের নামে চাষের জমি আছে কি?" }, options: yesNo(), pass: ["yes"], unknown: ["unsure"], explain: "Only landholding farmer families are covered.", source: "Guidelines, Para 2.1 (sample)" },
      { id: "tax", q: { en: "Did anyone in your family pay income tax last year?", hi: "क्या पिछले साल परिवार में किसी ने आयकर भरा?", as: "যোৱা বছৰ পৰিয়ালৰ কোনোবাই আয়কৰ দিছিল নে?", bn: "গত বছর পরিবারের কেউ আয়কর দিয়েছিলেন কি?" }, options: yesNo(), pass: ["no"], unknown: ["unsure"], explain: "Income-tax paying families are excluded.", source: "Guidelines, Para 2.4 – Exclusions (sample)" },
      { id: "docs", q: { en: "Do you have Aadhaar and a bank account?", hi: "क्या आपके पास आधार और बैंक खाता है?", as: "আপোনাৰ আধাৰ আৰু বেংক একাউণ্ট আছে নে?", bn: "আপনার আধার ও ব্যাংক অ্যাকাউন্ট আছে কি?" }, options: yesNo(), pass: ["yes"], unknown: ["unsure"], explain: "Payment is made by direct bank transfer linked to Aadhaar.", source: "Guidelines, Para 5 (sample)" },
    ],
  },
  {
    id: "orunodoi",
    name: { en: "Orunodoi 2.0", hi: "ओरुनोदोई 2.0", as: "অৰুণোদই ২.০", bn: "অরুণোদয় ২.০" },
    short: {
      en: "Monthly financial assistance to women of economically weaker families in Assam for household needs.",
      hi: "असम के आर्थिक रूप से कमज़ोर परिवारों की महिलाओं को घरेलू ज़रूरतों के लिए मासिक सहायता।",
      as: "অসমৰ আৰ্থিকভাৱে দুৰ্বল পৰিয়ালৰ মহিলাক ঘৰুৱা প্ৰয়োজনৰ বাবে মাহেকীয়া আৰ্থিক সাহায্য।",
      bn: "আসামের আর্থিকভাবে দুর্বল পরিবারের মহিলাদের গৃহস্থালি প্রয়োজনে মাসিক আর্থিক সহায়তা।",
    },
    department: "Finance Department, Government of Assam",
    category: "Women and Child Development",
    state: "Assam",
    level: "State",
    beneficiaries: ["Women", "Rural Families"],
    benefits: ["Monthly DBT to woman of the family", "Support for medicine, food and nutrition"],
    eligibilitySummary: "Assam resident families with low annual income; woman as primary beneficiary.",
    updated: "2026-10-02",
    views: 22150,
    purpose: "To help poor families buy essentials like medicines, pulses, sugar and fruits.",
    whoBenefits: "Women heads of economically weaker households in Assam.",
    eligibility: ["Permanent resident of Assam", "Composite household income within the notified limit", "Woman member nominated as beneficiary", "Families with government employees excluded"],
    financial: "Fixed monthly amount transferred to the woman beneficiary's bank account (amount as per latest notification).",
    documents: ["Aadhaar card", "Ration card", "Bank passbook in woman's name", "Income certificate"],
    steps: ["Collect form from Gaon Panchayat / Ward office", "Fill household and income details", "Attach documents", "Submit to the designated officer", "Verification by local committee"],
    dates: [{ label: "New enrolment window (sample)", date: "15 Nov – 15 Dec 2026" }],
    sourceDoc: "Orunodoi 2.0 Scheme Guidelines, Govt. of Assam (sample reference)",
    verified: "2026-10-02",
    aiSimple: {
      en: "If your family in Assam has low income, the woman of the house may get money every month in her bank account to buy medicines and food.",
      hi: "असम में यदि आपके परिवार की आय कम है, तो घर की महिला को दवाइयाँ और भोजन खरीदने के लिए हर महीने उसके बैंक खाते में पैसे मिल सकते हैं।",
      as: "অসমত আপোনাৰ পৰিয়ালৰ আয় কম হ'লে, ঘৰৰ মহিলাগৰাকীয়ে ঔষধ আৰু খাদ্য কিনিবলৈ প্ৰতিমাহে তেওঁৰ বেংক একাউণ্টত ধন পাব পাৰে।",
      bn: "আসামে আপনার পরিবারের আয় কম হলে, বাড়ির মহিলা ওষুধ ও খাবার কেনার জন্য প্রতি মাসে তার ব্যাংক অ্যাকাউন্টে টাকা পেতে পারেন।",
    },
    questions: [
      residentQ("Assam"),
      incomeQ("as notified, sample: up to ₹2 lakh", ["lt1", "1to2"]),
      { id: "woman", q: { en: "Is there an adult woman in the family who can be the beneficiary?", hi: "क्या परिवार में कोई वयस्क महिला है जो लाभार्थी बन सके?", as: "পৰিয়ালত হিতাধিকাৰী হ'ব পৰা প্ৰাপ্তবয়স্ক মহিলা আছে নে?", bn: "পরিবারে উপকারভোগী হতে পারেন এমন প্রাপ্তবয়স্ক মহিলা আছেন কি?" }, options: yesNo(), pass: ["yes"], unknown: ["unsure"], explain: "Assistance is paid to a woman member of the household.", source: "Guidelines, Section 4 (sample)" },
      { id: "govt", q: { en: "Is any family member a government employee?", hi: "क्या परिवार का कोई सदस्य सरकारी कर्मचारी है?", as: "পৰিয়ালৰ কোনো সদস্য চৰকাৰী কৰ্মচাৰী নেকি?", bn: "পরিবারের কেউ সরকারি কর্মচারী কি?" }, options: yesNo(), pass: ["no"], unknown: ["unsure"], explain: "Households with government employees are excluded.", source: "Guidelines, Section 5 – Exclusions (sample)" },
    ],
  },
  {
    id: "ayushman",
    name: { en: "Ayushman Bharat PM-JAY", hi: "आयुष्मान भारत पीएम-जय", as: "আয়ুষ্মান ভাৰত পিএম-জয়", bn: "আয়ুষ্মান ভারত পিএম-জয়" },
    short: { en: "Health cover of up to ₹5 lakh per family per year for hospital treatment at empanelled hospitals.", hi: "सूचीबद्ध अस्पतालों में इलाज के लिए प्रति परिवार प्रति वर्ष ₹5 लाख तक का स्वास्थ्य कवर।", as: "তালিকাভুক্ত চিকিৎসালয়ত চিকিৎসাৰ বাবে পৰিয়াল প্ৰতি বছৰি ₹৫ লাখলৈ স্বাস্থ্য সুৰক্ষা।", bn: "তালিকাভুক্ত হাসপাতালে চিকিৎসার জন্য পরিবার প্রতি বছরে ₹৫ লক্ষ পর্যন্ত স্বাস্থ্য বিমা।" },
    department: "National Health Authority",
    category: "Healthcare",
    state: "All India",
    level: "Central",
    beneficiaries: ["Rural Families", "Workers", "Senior Citizens"],
    benefits: ["Up to ₹5 lakh cover per family/year", "Cashless treatment", "Pre & post hospitalisation"],
    eligibilitySummary: "Families identified under SECC data and notified categories; senior citizens 70+ covered.",
    updated: "2026-08-20",
    views: 31200,
    purpose: "To protect poor and vulnerable families from heavy hospital expenses.",
    whoBenefits: "Identified poor and vulnerable families, and senior citizens aged 70 and above.",
    eligibility: ["Family listed in SECC / notified database", "Or senior citizen aged 70+", "Ayushman card generated via e-KYC"],
    financial: "Cashless treatment up to ₹5 lakh per family per year at empanelled hospitals.",
    documents: ["Aadhaar card", "Ration card or PM letter", "Mobile number"],
    steps: ["Check name on the beneficiary portal", "Visit CSC or empanelled hospital", "Complete e-KYC", "Download Ayushman card", "Show card at hospital help desk"],
    dates: [{ label: "Enrolment", date: "Open all year" }],
    officialUrl: "https://pmjay.gov.in",
    sourceDoc: "PM-JAY Beneficiary Guidelines (sample reference)",
    verified: "2026-08-20",
    aiSimple: { en: "If your family is on the list, you can get free hospital treatment up to ₹5 lakh every year. Get your Ayushman card and show it at the hospital." },
    questions: [
      residentQ("All India"),
      { id: "list", q: { en: "Is your family's name in the PM-JAY beneficiary list?", hi: "क्या आपके परिवार का नाम पीएम-जय सूची में है?", as: "আপোনাৰ পৰিয়ালৰ নাম পিএম-জয় তালিকাত আছে নে?", bn: "আপনার পরিবারের নাম পিএম-জয় তালিকায় আছে কি?" }, options: yesNo(), pass: ["yes"], unknown: ["unsure"], explain: "Eligibility is based on the notified beneficiary database.", source: "Guidelines, Section 3 (sample)" },
      { id: "age", q: { en: "Is anyone in your family aged 70 or above?", hi: "क्या परिवार में कोई 70 वर्ष या अधिक उम्र का है?", as: "পৰিয়ালত ৭০ বছৰ বা তাতকৈ অধিক বয়সৰ কোনোবা আছে নে?", bn: "পরিবারে ৭০ বছর বা তার বেশি বয়সী কেউ আছেন কি?" }, options: yesNo(), pass: ["yes", "no"], explain: "Senior citizens aged 70+ are covered regardless of income (additional route).", source: "Notification on senior citizen coverage (sample)" },
    ],
  },
  {
    id: "pmay-g",
    name: { en: "PM Awas Yojana – Gramin", hi: "प्रधानमंत्री आवास योजना – ग्रामीण", as: "প্ৰধানমন্ত্ৰী আৱাস যোজনা – গ্ৰামীণ", bn: "প্রধানমন্ত্রী আবাস যোজনা – গ্রামীণ" },
    short: { en: "Financial help to rural families without a pucca house to build a safe home.", hi: "पक्के घर से वंचित ग्रामीण परिवारों को सुरक्षित घर बनाने के लिए सहायता।", as: "পকী ঘৰ নথকা গ্ৰাম্য পৰিয়ালক সুৰক্ষিত ঘৰ সাজিবলৈ সাহায্য।", bn: "পাকা বাড়ি নেই এমন গ্রামীণ পরিবারকে নিরাপদ বাড়ি তৈরিতে সহায়তা।" },
    department: "Ministry of Rural Development",
    category: "Housing",
    state: "All India",
    level: "Central",
    beneficiaries: ["Rural Families"],
    benefits: ["Assistance for house construction (higher in hilly / NE states)", "Toilet support via SBM-G convergence", "90/95 days MGNREGA wages"],
    eligibilitySummary: "Houseless or kutcha-house rural families from the Awaas+ list.",
    updated: "2026-07-05",
    views: 14980,
    purpose: "Housing for all in rural areas.",
    whoBenefits: "Rural families who are houseless or live in kutcha houses.",
    eligibility: ["Rural household", "No pucca house anywhere in India", "Listed in Awaas+ survey / Gram Sabha verified"],
    financial: "Per-unit assistance released in instalments to the bank account; higher unit cost applies to NE & hilly states.",
    documents: ["Aadhaar", "Job card (MGNREGA)", "Bank account", "SBM number if available"],
    steps: ["Name verified in Gram Sabha", "Geo-tagging of site", "Sanction order issued", "Instalments released on progress"],
    dates: [{ label: "Survey update (sample)", date: "Until 31 Dec 2026" }],
    officialUrl: "https://pmayg.nic.in",
    sourceDoc: "PMAY-G Framework for Implementation (sample reference)",
    verified: "2026-07-05",
    aiSimple: { en: "If you live in a village and don't have a pucca house, the government can give money in parts to help you build one." },
    questions: [
      residentQ("All India"),
      { id: "rural", q: { en: "Do you live in a rural (village) area?", hi: "क्या आप ग्रामीण क्षेत्र में रहते हैं?", as: "আপুনি গাঁও অঞ্চলত থাকে নে?", bn: "আপনি গ্রামীণ এলাকায় থাকেন কি?" }, options: yesNo(), pass: ["yes"], explain: "PMAY-G is only for rural households.", source: "Framework, Para 2 (sample)" },
      { id: "pucca", q: { en: "Does your family own a pucca (brick/concrete) house?", hi: "क्या आपके परिवार के पास पक्का घर है?", as: "আপোনাৰ পৰিয়ালৰ পকী ঘৰ আছে নে?", bn: "আপনার পরিবারের পাকা বাড়ি আছে কি?" }, options: yesNo(), pass: ["no"], explain: "Families owning a pucca house are not eligible.", source: "Framework, Para 5.2 (sample)" },
    ],
  },
  {
    id: "nijut-moina",
    name: { en: "Nijut Moina", hi: "निजुत मोइना", as: "নিযুত মইনা", bn: "নিজুত মইনা" },
    short: { en: "Monthly stipend for girl students in Assam to continue higher education and prevent child marriage.", hi: "असम की छात्राओं को उच्च शिक्षा जारी रखने के लिए मासिक छात्रवृत्ति।", as: "অসমৰ ছাত্ৰীসকলক উচ্চ শিক্ষা অব্যাহত ৰাখিবলৈ মাহেকীয়া বৃত্তি।", bn: "আসামের ছাত্রীদের উচ্চশিক্ষা চালিয়ে যেতে মাসিক বৃত্তি।" },
    department: "Education Department, Government of Assam",
    category: "Education",
    state: "Assam",
    level: "State",
    beneficiaries: ["Students", "Women", "Youth"],
    benefits: ["Monthly stipend for 10 months a year", "Higher amount for degree & PG levels"],
    eligibilitySummary: "Unmarried girl students in Class 11, degree or PG at government institutions in Assam.",
    updated: "2026-09-28",
    views: 12760,
    purpose: "To encourage girls to study further and reduce child marriage.",
    whoBenefits: "Girl students studying in Higher Secondary, Degree and Post-Graduate courses in Assam.",
    eligibility: ["Girl student, resident of Assam", "Enrolled in Class 11, degree or PG in a government / provincialised institution", "Unmarried at the time of application", "Family income within the notified limit"],
    financial: "Monthly stipend for 10 months; amount depends on course level (as per notification).",
    documents: ["Aadhaar", "Admission receipt", "Bank account in student's name", "Self-declaration of marital status"],
    steps: ["Apply online on the state portal", "Upload documents", "Institution verifies", "Stipend credited monthly"],
    dates: [{ label: "Application window (sample)", date: "Aug – Oct 2026" }],
    sourceDoc: "Nijut Moina Scheme Notification, Govt. of Assam (sample reference)",
    verified: "2026-09-28",
    aiSimple: { en: "If you are a girl studying in Class 11, college or university in Assam and are unmarried, you may get money every month to help with your studies.", as: "আপুনি যদি অসমত একাদশ শ্ৰেণী, কলেজ বা বিশ্ববিদ্যালয়ত পঢ়া অবিবাহিত ছাত্ৰী, পঢ়াত সহায়ৰ বাবে প্ৰতিমাহে ধন পাব পাৰে।" },
    questions: [
      residentQ("Assam"),
      { id: "level", q: { en: "What are you studying now?", hi: "आप अभी क्या पढ़ रही हैं?", as: "আপুনি এতিয়া কি পঢ়ি আছে?", bn: "আপনি এখন কী পড়ছেন?" }, options: [{ label: { en: "Class 11 / 12" }, value: "hs" }, { label: { en: "Degree" }, value: "deg" }, { label: { en: "Post-graduate" }, value: "pg" }, { label: { en: "Not studying" }, value: "none" }], pass: ["hs", "deg", "pg"], explain: "Must be enrolled in HS, degree or PG level.", source: "Notification, Clause 3 (sample)" },
      { id: "inst", q: { en: "Is your institution a government or provincialised one?", hi: "क्या आपका संस्थान सरकारी है?", as: "আপোনাৰ শিক্ষানুষ্ঠান চৰকাৰী বা প্ৰাদেশিকৃত নেকি?", bn: "আপনার প্রতিষ্ঠান সরকারি কি?" }, options: yesNo(), pass: ["yes"], unknown: ["unsure"], explain: "Only students of government / provincialised institutions are covered.", source: "Notification, Clause 4 (sample)" },
      incomeQ("sample: up to ₹4 lakh", ["lt1", "1to2", "2to5"]),
    ],
  },
  {
    id: "mudra",
    name: { en: "PM Mudra Yojana", hi: "प्रधानमंत्री मुद्रा योजना", as: "প্ৰধানমন্ত্ৰী মুদ্ৰা যোজনা", bn: "প্রধানমন্ত্রী মুদ্রা যোজনা" },
    short: { en: "Collateral-free loans for small and micro businesses under Shishu, Kishore, Tarun and Tarun Plus.", hi: "छोटे व्यवसायों के लिए बिना गारंटी के ऋण।", as: "সৰু ব্যৱসায়ৰ বাবে বন্ধকী নোহোৱা ঋণ।", bn: "ক্ষুদ্র ব্যবসার জন্য জামানতবিহীন ঋণ।" },
    department: "Department of Financial Services",
    category: "Business and Entrepreneurship",
    state: "All India",
    level: "Central",
    beneficiaries: ["Small Business", "Youth", "Women"],
    benefits: ["Loans without collateral", "Shishu, Kishore, Tarun & Tarun Plus categories", "Through banks, NBFCs & MFIs"],
    eligibilitySummary: "Non-farm micro enterprises in manufacturing, trading or services.",
    updated: "2026-06-18",
    views: 9840,
    purpose: "To fund the unfunded small businesses.",
    whoBenefits: "Small shop owners, artisans, vendors, service providers.",
    eligibility: ["Indian citizen with a business plan", "Non-farm income-generating activity", "Not a defaulter to any bank"],
    financial: "Loan amount depends on category, decided by the lending bank.",
    documents: ["Identity & address proof", "Business plan / quotation", "Bank statements", "Category certificate if applicable"],
    steps: ["Prepare business plan", "Approach bank / apply on Udyamimitra portal", "Submit documents", "Bank appraisal & sanction"],
    dates: [{ label: "Applications", date: "Open all year" }],
    officialUrl: "https://www.mudra.org.in",
    sourceDoc: "MUDRA Scheme FAQ (sample reference)",
    verified: "2026-06-18",
    aiSimple: { en: "If you run or want to start a small business, banks can give you a loan without asking for property as security." },
    questions: [
      residentQ("All India"),
      { id: "biz", q: { en: "Do you run or plan to start a small non-farm business?", hi: "क्या आप छोटा व्यवसाय चलाते हैं या शुरू करना चाहते हैं?", as: "আপুনি সৰু ব্যৱসায় চলায় বা আৰম্ভ কৰিব বিচাৰে নে?", bn: "আপনি ছোট ব্যবসা চালান বা শুরু করতে চান কি?" }, options: yesNo(), pass: ["yes"], explain: "Loans are for non-farm income-generating activities.", source: "FAQ, Q2 (sample)" },
      { id: "default", q: { en: "Have you ever failed to repay a bank loan?", hi: "क्या आपने कभी बैंक ऋण नहीं चुकाया?", as: "আপুনি কেতিয়াবা বেংক ঋণ পৰিশোধ কৰিব পৰা নাছিল নে?", bn: "আপনি কখনও ব্যাংক ঋণ শোধ করতে পারেননি কি?" }, options: yesNo(), pass: ["no"], unknown: ["unsure"], explain: "Borrowers should not be defaulters.", source: "FAQ, Q5 (sample)" },
    ],
  },
  {
    id: "svayem",
    name: { en: "Swami Vivekananda Assam Youth Empowerment (SVAYEM)", as: "স্বামী বিবেকানন্দ অসম যুৱ সবলীকৰণ যোজনা", hi: "स्वामी विवेकानंद असम युवा सशक्तिकरण योजना", bn: "স্বামী বিবেকানন্দ আসাম যুব ক্ষমতায়ন যোজনা" },
    short: { en: "Seed money support for unemployed youth in Assam to start self-employment ventures.", as: "অসমৰ নিবনুৱা যুৱক-যুৱতীক স্বনিয়োজনৰ বাবে বীজ ধন।", hi: "असम के बेरोज़गार युवाओं को स्वरोज़गार शुरू करने के लिए सहायता।", bn: "আসামের বেকার যুবকদের স্বনির্ভর উদ্যোগে সহায়তা।" },
    department: "Panchayat & Rural Development, Govt. of Assam",
    category: "Employment",
    state: "Assam",
    level: "State",
    beneficiaries: ["Youth", "Workers"],
    benefits: ["One-time financial assistance", "Linkage with bank credit", "Handholding support"],
    eligibilitySummary: "Unemployed youth aged 18–40 from Assam with a viable project.",
    updated: "2026-05-10",
    views: 7420,
    purpose: "To promote self-employment among youth.",
    whoBenefits: "Unemployed young people of Assam.",
    eligibility: ["Age 18 to 40 years", "Resident of Assam", "Unemployed", "Viable project proposal"],
    financial: "One-time assistance as per notified slab.",
    documents: ["Age proof", "Residence certificate", "Project proposal", "Bank account"],
    steps: ["Register on state portal", "Submit project proposal", "District committee selection", "Fund release"],
    dates: [{ label: "Next round (sample)", date: "Jan 2027" }],
    sourceDoc: "SVAYEM Guidelines (sample reference)",
    verified: "2026-05-10",
    aiSimple: { en: "If you are 18–40, live in Assam and want to start your own work, you may get money to begin." },
    questions: [
      residentQ("Assam"),
      { id: "age", q: { en: "What is your age group?", hi: "आपकी आयु वर्ग क्या है?", as: "আপোনাৰ বয়সৰ গোট কি?", bn: "আপনার বয়সসীমা কত?" }, options: [{ label: { en: "Below 18" }, value: "u18" }, { label: { en: "18 – 40" }, value: "18-40" }, { label: { en: "Above 40" }, value: "o40" }], pass: ["18-40"], explain: "Applicants must be 18 to 40 years old.", source: "Guidelines, Para 3 (sample)" },
      { id: "emp", q: { en: "Are you currently unemployed?", hi: "क्या आप अभी बेरोज़गार हैं?", as: "আপুনি বৰ্তমান নিবনুৱা নেকি?", bn: "আপনি কি বর্তমানে বেকার?" }, options: yesNo(), pass: ["yes"], explain: "Only unemployed youth are eligible.", source: "Guidelines, Para 3 (sample)" },
    ],
  },
  {
    id: "post-matric-sc",
    name: { en: "Post Matric Scholarship (SC/ST)", hi: "पोस्ट मैट्रिक छात्रवृत्ति", as: "পোষ্ট মেট্ৰিক বৃত্তি", bn: "পোস্ট ম্যাট্রিক বৃত্তি" },
    short: { en: "Scholarship covering fees and maintenance for SC/ST students studying after Class 10.", hi: "कक्षा 10 के बाद पढ़ने वाले SC/ST छात्रों के लिए छात्रवृत्ति।", as: "দশম শ্ৰেণীৰ পিছত পঢ়া SC/ST ছাত্ৰ-ছাত্ৰীৰ বাবে বৃত্তি।", bn: "দশম শ্রেণীর পরে পড়া SC/ST ছাত্রছাত্রীদের জন্য বৃত্তি।" },
    department: "Ministry of Social Justice / Tribal Affairs",
    category: "Education",
    state: "All India",
    level: "Central",
    beneficiaries: ["Students"],
    benefits: ["Tuition fee reimbursement", "Maintenance allowance"],
    eligibilitySummary: "SC/ST students in post-matric courses with family income within limit.",
    updated: "2026-09-01",
    views: 11200,
    purpose: "To support higher education of SC/ST students.",
    whoBenefits: "SC and ST students after Class 10.",
    eligibility: ["Belongs to SC or ST", "Studying in a recognised post-matric course", "Family income within notified ceiling"],
    documents: ["Caste certificate", "Income certificate", "Marksheet", "Fee receipt", "Bank account"],
    steps: ["Register on National Scholarship Portal", "Fill application", "Institute verification", "State verification", "DBT of scholarship"],
    dates: [{ label: "Portal closes (sample)", date: "30 Nov 2026" }],
    officialUrl: "https://scholarships.gov.in",
    sourceDoc: "Post Matric Scholarship Guidelines (sample reference)",
    verified: "2026-09-01",
    aiSimple: { en: "If you are an SC or ST student studying after Class 10, the government may pay your fees and give a monthly allowance." },
    questions: [
      residentQ("All India"),
      { id: "cat", q: { en: "Do you belong to a Scheduled Caste or Scheduled Tribe?", hi: "क्या आप अनुसूचित जाति या जनजाति से हैं?", as: "আপুনি অনুসূচিত জাতি বা জনজাতিৰ নেকি?", bn: "আপনি তফসিলি জাতি বা উপজাতির কি?" }, options: yesNo(), pass: ["yes"], explain: "Scheme is for SC/ST students.", source: "Guidelines, Para 1 (sample)" },
      incomeQ("sample: up to ₹2.5 lakh", ["lt1", "1to2"]),
    ],
  },
  {
    id: "ujjwala",
    name: { en: "PM Ujjwala Yojana", hi: "प्रधानमंत्री उज्ज्वला योजना", as: "প্ৰধানমন্ত্ৰী উজ্জ্বলা যোজনা", bn: "প্রধানমন্ত্রী উজ্জ্বলা যোজনা" },
    short: { en: "Free LPG connection to women from poor households for clean cooking.", hi: "गरीब परिवारों की महिलाओं को मुफ़्त एलपीजी कनेक्शन।", as: "দুখীয়া পৰিয়ালৰ মহিলাক বিনামূলীয়া এলপিজি সংযোগ।", bn: "দরিদ্র পরিবারের মহিলাদের বিনামূল্যে এলপিজি সংযোগ।" },
    department: "Ministry of Petroleum & Natural Gas",
    category: "Social Welfare",
    state: "All India",
    level: "Central",
    beneficiaries: ["Women", "Rural Families"],
    benefits: ["Deposit-free LPG connection", "First refill & stove support"],
    eligibilitySummary: "Adult women from poor households without an existing LPG connection.",
    updated: "2026-04-22",
    views: 8650,
    purpose: "Clean cooking fuel for poor households.",
    whoBenefits: "Women from poor households.",
    eligibility: ["Woman aged 18+", "Poor household", "No LPG connection in the household"],
    documents: ["Aadhaar", "Ration card", "Bank account", "KYC form"],
    steps: ["Visit nearest LPG distributor", "Submit KYC & documents", "Connection installed"],
    dates: [{ label: "Applications", date: "Open all year" }],
    officialUrl: "https://www.pmuy.gov.in",
    sourceDoc: "PMUY Guidelines (sample reference)",
    verified: "2026-04-22",
    aiSimple: { en: "If you are a woman from a poor family without a gas connection, you can get a free LPG connection." },
    questions: [
      residentQ("All India"),
      { id: "lpg", q: { en: "Does your household already have an LPG connection?", hi: "क्या घर में पहले से एलपीजी कनेक्शन है?", as: "ঘৰত ইতিমধ্যে এলপিজি সংযোগ আছে নে?", bn: "বাড়িতে আগে থেকেই এলপিজি সংযোগ আছে কি?" }, options: yesNo(), pass: ["no"], explain: "Households with an existing connection are excluded.", source: "Guidelines, Para 4 (sample)" },
    ],
  },
  {
    id: "udid",
    name: { en: "Unique Disability ID (UDID) & Assistance", hi: "विशिष्ट विकलांगता पहचान पत्र (UDID)", as: "অনন্য দিব্যাংগ পৰিচয় পত্ৰ (UDID)", bn: "ইউনিক ডিসেবিলিটি আইডি (UDID)" },
    short: { en: "A single national disability ID card to access benefits, concessions and assistive devices.", hi: "लाभ और रियायतों के लिए एक राष्ट्रीय विकलांगता पहचान पत्र।", as: "সুবিধা আৰু ৰেহাইৰ বাবে এখন ৰাষ্ট্ৰীয় দিব্যাংগ পৰিচয় পত্ৰ।", bn: "সুবিধা ও ছাড় পেতে একটি জাতীয় প্রতিবন্ধী পরিচয়পত্র।" },
    department: "Dept. of Empowerment of Persons with Disabilities",
    category: "Disability Support",
    state: "All India",
    level: "Central",
    beneficiaries: ["Persons with Disability"],
    benefits: ["Single ID for all schemes", "Access to concessions", "Assistive device schemes"],
    eligibilitySummary: "Persons with a benchmark disability certified by a medical authority.",
    updated: "2026-03-15",
    views: 5320,
    purpose: "Simplify access to disability benefits.",
    whoBenefits: "Persons with disabilities.",
    eligibility: ["Has a disability as per RPwD Act", "Medical assessment by authority"],
    documents: ["Photo", "Aadhaar / ID proof", "Address proof", "Existing disability certificate if any"],
    steps: ["Apply online on UDID portal", "Attend medical assessment", "Card dispatched"],
    dates: [{ label: "Applications", date: "Open all year" }],
    sourceDoc: "UDID Project Guidelines (sample reference)",
    verified: "2026-03-15",
    aiSimple: { en: "If you have a disability, apply for one ID card that helps you get many government benefits easily." },
    questions: [
      { id: "dis", q: { en: "Do you or a family member have a disability?", hi: "क्या आपको या परिवार के सदस्य को विकलांगता है?", as: "আপোনাৰ বা পৰিয়ালৰ সদস্যৰ দিব্যাংগতা আছে নে?", bn: "আপনার বা পরিবারের কারো প্রতিবন্ধকতা আছে কি?" }, options: yesNo(), pass: ["yes"], explain: "UDID is for persons with disabilities.", source: "RPwD Act, Schedule (sample)" },
    ],
  },
];

export const getScheme = (id: string) => SCHEMES.find((s) => s.id === id);
