// SAMPLE / DEMONSTRATION DATA — replace with backend (FastAPI + Supabase) responses later.

export type Cite = { doc: string; page: number; section: string; status: "verified" | "ai" | "missing" | "confirm" };

export const SAMPLE_DOC = {
  id: "orunodoi-guidelines",
  title: "Orunodoi 2.0 – Scheme Guidelines (Sample PDF)",
  source: "Finance Department, Government of Assam (illustrative)",
  pages: 14,
  uploaded: "2026-10-30",
  sections: [
    { key: "simple", title: "Simple Explanation", body: "This scheme gives a fixed amount of money every month to the woman of a poor family in Assam. The money is meant for buying medicines, pulses, sugar, fruits and other basic needs. It is sent directly to her bank account.", cite: { doc: "Orunodoi 2.0 Guidelines", page: 1, section: "1. Introduction", status: "ai" } as Cite },
    { key: "purpose", title: "Purpose", body: "To reduce the financial burden on economically weaker families and improve nutrition and health of women and children.", cite: { doc: "Orunodoi 2.0 Guidelines", page: 2, section: "2. Objectives", status: "verified" } as Cite },
    { key: "who", title: "Who is affected?", body: "Women heads of low-income households across all districts of Assam, including families with persons with disabilities, widows and divorced women.", cite: { doc: "Orunodoi 2.0 Guidelines", page: 3, section: "3. Target group", status: "verified" } as Cite },
    { key: "elig", title: "Eligibility", list: ["Permanent resident of Assam", "Household income within the notified limit", "A woman of the family is the beneficiary", "NOT eligible: households with a government employee, MP/MLA, or those owning a four-wheeler"], cite: { doc: "Orunodoi 2.0 Guidelines", page: 4, section: "4. Eligibility & 5. Exclusions", status: "verified" } as Cite },
    { key: "benefits", title: "Benefits", list: ["Fixed monthly assistance through Direct Benefit Transfer", "Paid on a fixed date each month", "No middlemen — money goes directly to the bank"], cite: { doc: "Orunodoi 2.0 Guidelines", page: 5, section: "6. Benefits", status: "verified" } as Cite },
    { key: "docs", title: "Required Documents", list: ["Aadhaar card", "Ration card (NFSA)", "Bank passbook in the woman's name", "Income certificate"], cite: { doc: "Orunodoi 2.0 Guidelines", page: 6, section: "7. Documents", status: "verified" } as Cite },
    { key: "steps", title: "Application Procedure", list: ["Collect the form from your Gaon Panchayat or Ward office", "Fill household and income details", "Attach copies of documents", "Submit to the designated officer and get an acknowledgement", "Wait for verification by the local committee"], cite: { doc: "Orunodoi 2.0 Guidelines", page: 7, section: "8. Procedure", status: "verified" } as Cite },
    { key: "dates", title: "Important Dates", list: ["Enrolment window: 15 Nov – 15 Dec 2026 (sample)", "Effective from: the month after approval"], cite: { doc: "Orunodoi 2.0 Guidelines", page: 8, section: "9. Timeline", status: "confirm" } as Cite },
    { key: "rights", title: "Rights and Responsibilities", list: ["Right: receive assistance on time once approved", "Right: file a grievance if payment stops", "Duty: give correct income information", "Duty: inform officials if family situation changes"], cite: { doc: "Orunodoi 2.0 Guidelines", page: 10, section: "11. Grievance", status: "verified" } as Cite },
    { key: "restrict", title: "Restrictions and Exceptions", list: ["Only one beneficiary per household", "False information can lead to cancellation and recovery", "Exact income limit — not clearly stated in this copy"], cite: { doc: "Orunodoi 2.0 Guidelines", page: 9, section: "10. Cancellation", status: "missing" } as Cite },
    { key: "points", title: "Important Points", list: ["Keep your bank account active and linked to Aadhaar", "Never pay anyone to get enrolled — the process is free", "Check payment status at your bank every month"], cite: { doc: "Orunodoi 2.0 Guidelines", page: 12, section: "Annexure", status: "ai" } as Cite },
  ],
};

export const NOTIFICATIONS = [
  { id: 1, type: "New scheme", title: "Applications open for Orunodoi 2.0 new enrolment", state: "Assam", category: "Women and Child Development", dept: "Finance Dept., Assam", date: "2026-10-28", source: "Assam Gazette (sample)", unread: true },
  { id: 2, type: "Deadline", title: "Post Matric Scholarship portal closes on 30 Nov 2026", state: "All India", category: "Education", dept: "Ministry of Social Justice", date: "2026-10-25", source: "NSP notice (sample)", unread: true },
  { id: 3, type: "Policy update", title: "PM-JAY coverage extended to senior citizens aged 70+", state: "All India", category: "Healthcare", dept: "National Health Authority", date: "2026-10-18", source: "Press release (sample)", unread: true },
  { id: 4, type: "Eligibility change", title: "Nijut Moina: degree-level stipend eligibility revised", state: "Assam", category: "Education", dept: "Education Dept., Assam", date: "2026-10-10", source: "Department circular (sample)", unread: false },
  { id: 5, type: "Announcement", title: "PM-KISAN e-KYC camps in Dibrugarh and Jorhat", state: "Assam", category: "Agriculture", dept: "Agriculture Dept., Assam", date: "2026-10-05", source: "District notice (sample)", unread: false },
  { id: 6, type: "New scheme", title: "Meghalaya youth start-up seed fund announced", state: "Meghalaya", category: "Business and Entrepreneurship", dept: "Planning Dept., Meghalaya", date: "2026-09-29", source: "State notification (sample)", unread: false },
  { id: 7, type: "Deadline", title: "PMAY-G Awaas+ survey update ends 31 Dec 2026", state: "All India", category: "Housing", dept: "Ministry of Rural Development", date: "2026-09-20", source: "Ministry circular (sample)", unread: false },
];

export const CHAT_SEED = [
  { role: "user" as const, text: "Who can apply for Orunodoi?" },
  {
    role: "ai" as const,
    text: "Orunodoi is for low-income families living in Assam. A woman of the family receives the money. Families with a government employee are not eligible.",
    facts: ["Permanent resident of Assam", "Woman beneficiary", "Exclusion: government employee in family"],
    cites: [{ doc: "Orunodoi 2.0 Guidelines", page: 4, section: "4. Eligibility" }],
  },
];

export const SUGGESTED_QUESTIONS = [
  "What is this government scheme about?",
  "Who can apply for this scheme?",
  "What documents are required?",
  "How do I apply?",
  "What benefits will I receive?",
  "What are my rights under this policy?",
  "Explain this notification in Assamese.",
  "What is the last date to apply?",
];

export const RIGHTS = {
  title: "Right to Public Services (sample: Assam Right to Public Services Act)",
  entitled: ["Get notified public services within a fixed time", "Receive an acknowledgement with application number", "Appeal if a service is delayed or refused"],
  must: ["Submit complete application with required documents", "Provide true information", "Pay the notified fee, if any"],
  government: ["Deliver the service within the stipulated time", "Display service timelines publicly", "Hear appeals within the notified period"],
  conditions: ["Applies only to notified services", "Time limit starts from complete application", "Penalties on officials as per Act, subject to inquiry"],
  sources: ["Section 3 – Right to obtain service", "Section 4 – Stipulated time", "Section 7 – Appeals", "Section 9 – Penalty"],
};

export const COMPARISON = {
  old: "Nijut Moina Guidelines 2024 (sample)",
  new: "Nijut Moina Guidelines 2026 (sample)",
  effective: "1 August 2026",
  rows: [
    { area: "Eligibility", oldText: "Girl students in HS & Degree", newText: "Girl students in HS, Degree and PG", status: "Modified" },
    { area: "Benefits", oldText: "Monthly stipend for 10 months", newText: "Monthly stipend for 10 months", status: "Unchanged" },
    { area: "Financial assistance", oldText: "Single slab for degree", newText: "Separate higher slab for PG", status: "Added" },
    { area: "Deadlines", oldText: "Apply by 30 September", newText: "Apply by 31 October", status: "Modified" },
    { area: "Responsibilities", oldText: "Institution submits attendance quarterly", newText: "Institution submits attendance monthly", status: "Modified" },
    { area: "Exclusions", oldText: "Students of private institutions excluded", newText: "Students of private institutions excluded", status: "Unchanged" },
    { area: "Documents", oldText: "Physical marriage affidavit required", newText: "—", status: "Removed" },
  ],
  meaning: [
    "Post-graduate girl students can now apply.",
    "You get one extra month to apply (until 31 October).",
    "No need to submit a physical affidavit — self-declaration is enough.",
  ],
};

export const ADMIN = {
  stats: [
    { label: "Total documents", value: 1284 },
    { label: "Verified documents", value: 1032 },
    { label: "Total schemes", value: 486 },
    { label: "Languages supported", value: 4 },
    { label: "Explanations generated", value: 48210 },
    { label: "Feedback submissions", value: 1376 },
  ],
  topSchemes: [
    { name: "PM-JAY", views: 31200 },
    { name: "Orunodoi", views: 22150 },
    { name: "PM-KISAN", views: 18420 },
    { name: "PMAY-G", views: 14980 },
    { name: "Nijut Moina", views: 12760 },
  ],
  languages: [
    { name: "Assamese", value: 41 },
    { name: "English", value: 24 },
    { name: "Bengali", value: 21 },
    { name: "Hindi", value: 14 },
  ],
  categories: [
    { name: "Healthcare", value: 22 },
    { name: "Agriculture", value: 19 },
    { name: "Education", value: 18 },
    { name: "Women & Child", value: 16 },
    { name: "Housing", value: 11 },
  ],
  monthly: [
    { m: "May", users: 4200 }, { m: "Jun", users: 5800 }, { m: "Jul", users: 7100 },
    { m: "Aug", users: 9400 }, { m: "Sep", users: 12300 }, { m: "Oct", users: 15800 },
  ],
  docs: [
    { id: "D-1042", title: "Orunodoi 2.0 Guidelines", dept: "Finance, Assam", state: "Assam", status: "Verified", processing: "Done" },
    { id: "D-1041", title: "Nijut Moina Notification 2026", dept: "Education, Assam", state: "Assam", status: "Verified", processing: "Done" },
    { id: "D-1040", title: "PMAY-G Framework (rev.)", dept: "Rural Development", state: "All India", status: "Unverified", processing: "Translating" },
    { id: "D-1039", title: "Meghalaya Start-up Policy", dept: "Planning, Meghalaya", state: "Meghalaya", status: "Unverified", processing: "Extracting" },
    { id: "D-0987", title: "SVAYEM Guidelines 2022", dept: "P&RD, Assam", state: "Assam", status: "Outdated", processing: "Done" },
  ],
  feedback: [
    { id: 1, type: "Incorrect translation", text: "Assamese word for 'income certificate' is unclear", lang: "Assamese", status: "Open" },
    { id: 2, type: "Outdated information", text: "PM-KISAN instalment date changed", lang: "English", status: "In review" },
    { id: 3, type: "Difficult explanation", text: "Ayushman exclusions hard to understand", lang: "Bengali", status: "Resolved" },
  ],
};

export const TRANSLATION_SAMPLE = {
  en: "The beneficiary shall be a permanent resident of Assam. Assistance of the notified amount shall be transferred on the 10th of every month to the bank account of the woman member. Households having any government employee are excluded. Applications must be submitted by 15 December 2026.",
  hi: "लाभार्थी असम का स्थायी निवासी होना चाहिए। अधिसूचित राशि की सहायता हर महीने की 10 तारीख को महिला सदस्य के बैंक खाते में भेजी जाएगी। जिन परिवारों में कोई सरकारी कर्मचारी है, वे शामिल नहीं हैं। आवेदन 15 दिसंबर 2026 तक जमा करना होगा।",
  as: "হিতাধিকাৰী অসমৰ স্থায়ী বাসিন্দা হ'ব লাগিব। জাননী দিয়া পৰিমাণৰ সাহায্য প্ৰতিমাহৰ ১০ তাৰিখে মহিলা সদস্যৰ বেংক একাউণ্টলৈ পঠিওৱা হ'ব। চৰকাৰী কৰ্মচাৰী থকা পৰিয়াল বাদ পৰিব। আবেদন ১৫ ডিচেম্বৰ ২০২৬ ৰ ভিতৰত জমা দিব লাগিব।",
  bn: "উপকারভোগীকে আসামের স্থায়ী বাসিন্দা হতে হবে। বিজ্ঞাপিত পরিমাণের সহায়তা প্রতি মাসের ১০ তারিখে মহিলা সদস্যের ব্যাংক অ্যাকাউন্টে পাঠানো হবে। সরকারি কর্মচারী থাকা পরিবার বাদ যাবে। আবেদন ১৫ ডিসেম্বর ২০২৬-এর মধ্যে জমা দিতে হবে।",
};
