// Centralized data repository for CSC Digital Service Center
export const serviceCategories = [
  "All Services",
  "Government Documents",
  "Identity & PAN",
  "Education",
  "Jobs & Exams",
  "Financial & Utility Assistance",
  "Travel & Passport Assistance",
  "Digital & Documentation Services",
  "Other Online Services"
];

export const servicesData = [
  // --- IDENTITY & PAN ---
  {
    id: "pan-card-application",
    slug: "pan-card-application",
    title: "PAN Card Application",
    shortDescription: "Assistance for new Permanent Account Number (Form 49A) online applications.",
    description: "New PAN Card application assistance for individuals, firms, and minors. Includes document verification, digital photo/signature formatting, and physical card delivery guidance.",
    category: "Identity & PAN",
    iconName: "CreditCard",
    featured: true,
    available: true,
    estimatedTime: "7 - 15 Business Days",
    serviceFee: "Service fee: Contact center",
    documents: [
      "Aadhaar Card (Proof of Identity & Address)",
      "Proof of Date of Birth (Birth Cert / Class 10 Marksheet)",
      "Two recent passport size color photographs"
    ],
    process: [
      { step: 1, title: "Select Service", description: "Choose PAN Card Application and review mandatory documents." },
      { step: 2, title: "Submit Information", description: "Provide applicant personal details and Aadhaar number." },
      { step: 3, title: "Attach Documents", description: "Provide clean scanned copies of identity and address proofs." },
      { step: 4, title: "Center Review", description: "Operator verifies document compliance with Income Tax rules." },
      { step: 5, title: "Portal Dispatch", description: "Application submitted to NSDL/UTIITSL e-governance portal." },
      { step: 6, title: "Receive e-PAN", description: "Digital PAN delivered to email; physical card dispatched by post." }
    ],
    notes: "Ensure the applicant's name and Date of Birth match exactly with Aadhaar details.",
    faq: [
      { question: "How long does a new PAN card take?", answer: "e-PAN is usually generated within 3 to 5 working days, while the physical card reaches your address in 7 to 15 business days." },
      { question: "Can I apply if my Aadhaar mobile is not linked?", answer: "Yes, our center can assist with offline physical document submission mode." }
    ]
  },
  {
    id: "pan-card-correction",
    slug: "pan-card-correction",
    title: "PAN Card Correction",
    shortDescription: "Correction of name, DOB, father's name, or photo in existing PAN card.",
    description: "Assistance with updating or correcting existing PAN card details on official NSDL/UTIITSL records. Ensures corrected details match your updated identity documents.",
    category: "Identity & PAN",
    iconName: "CreditCard",
    featured: false,
    available: true,
    estimatedTime: "10 - 20 Business Days",
    serviceFee: "Service fee: Contact center",
    documents: [
      "Existing PAN Card Copy / PAN Allotment Letter",
      "Aadhaar Card with updated details",
      "Gazette Notification or Affidavit (for major name change)"
    ],
    process: [
      { step: 1, title: "Identify Correction", description: "Specify fields requiring update (Name, DOB, Photo, Signature)." },
      { step: 2, title: "Provide Supporting Proof", description: "Supply valid identity proof confirming the corrected details." },
      { step: 3, title: "Form Verification", description: "Review correction request form for accuracy." },
      { step: 4, title: "Portal Submission", description: "Correction petition filed on official PAN portal." }
    ],
    notes: "Supporting document must accurately reflect the corrected name or date of birth.",
    faq: [
      { question: "Will my PAN number change after correction?", answer: "No, your 10-digit PAN number remains the same; only the printed details on the card are updated." }
    ]
  },
  {
    id: "pan-card-download",
    slug: "pan-card-download-assistance",
    title: "PAN Card Download Assistance",
    shortDescription: "Instant e-PAN PDF download and re-printing service.",
    description: "Get assistance downloading e-PAN PDF copies from NSDL/UTIITSL portals or re-printing PVC plastic cards.",
    category: "Identity & PAN",
    iconName: "CreditCard",
    featured: false,
    available: true,
    estimatedTime: "Same Day / Instant",
    serviceFee: "Service fee: Contact center",
    documents: [
      "PAN Number or Application Acknowledgement Number",
      "Aadhaar Number",
      "Linked Mobile Phone for OTP validation"
    ],
    process: [
      { step: 1, title: "Provide PAN / Ack No", description: "Operator looks up e-PAN records." },
      { step: 2, title: "Authenticate OTP", description: "Validate via mobile OTP received from portal." },
      { step: 3, title: "Download PDF", description: "Print high-resolution color copy or PVC card." }
    ],
    notes: "Requires mobile number linked to Aadhaar/PAN portal for OTP validation.",
    faq: [
      { question: "Is e-PAN legally valid?", answer: "Yes, e-PAN is digitally signed and holds equal legal validity as a physical PAN card." }
    ]
  },
  {
    id: "aadhaar-document-assistance",
    slug: "aadhaar-document-assistance",
    title: "Aadhaar Document Assistance",
    shortDescription: "Guidance for demographic details update, e-Aadhaar download, and UIDAI slot booking.",
    description: "Comprehensive guidance for Aadhaar document updates (Proof of Identity/Address), e-Aadhaar PDF downloads, PVC Aadhaar order assistance, and UIDAI appointment booking.",
    category: "Identity & PAN",
    iconName: "Fingerprint",
    featured: true,
    available: true,
    estimatedTime: "3 - 7 Business Days",
    serviceFee: "Service fee: Contact center",
    documents: [
      "Aadhaar Number / Enrolment Slip",
      "Valid Proof of Address (Electricity bill, Ration card, Passport)",
      "Mobile phone linked with Aadhaar"
    ],
    process: [
      { step: 1, title: "Review Document List", description: "Check UIDAI approved document list for valid POI/POA." },
      { step: 2, title: "Form Preparation", description: "Prepare update request details accurately." },
      { step: 3, title: "Portal Guidance", description: "Assist with myAadhaar portal filing or appointment booking." }
    ],
    notes: "Actual biometric updates (fingerprint/iris) must be completed at an official UIDAI enrolment center.",
    faq: [
      { question: "Can address be updated online?", answer: "Yes, online address update is supported if you have a valid proof of address in your name." }
    ]
  },

  // --- GOVERNMENT DOCUMENTS ---
  {
    id: "income-certificate",
    slug: "income-certificate",
    title: "Income Certificate Assistance",
    shortDescription: "Filing support for state government family annual income certificates.",
    description: "End-to-end guidance for obtaining state e-District Income Certificates required for educational scholarships, Fee Waiver schemes, and government welfare benefits.",
    category: "Government Documents",
    iconName: "FileCheck",
    featured: true,
    available: true,
    estimatedTime: "10 - 21 Business Days",
    serviceFee: "Fee varies by service",
    documents: [
      "Aadhaar Card of Applicant / Parent",
      "Ration Card / Voter ID",
      "Salary Slip / Form 16 / Income Affidavit",
      "Land Revenue Receipt / Patta (if applicable)"
    ],
    process: [
      { step: 1, title: "Prepare Income Proof", description: "Gather salary slips, IT returns, or self-declaration affidavits." },
      { step: 2, title: "Form Submission", description: "Fill e-District portal application form with accuracy." },
      { step: 3, title: "Verification by Authorities", description: "Local Revenue Inspector / Tehsildar verifies details." },
      { step: 4, title: "Certificate Download", description: "Download digitally signed certificate upon approval." }
    ],
    notes: "Income certificates are generally valid for one financial year.",
    faq: [
      { question: "Whose income should be declared for students?", answer: "For student applicants, the total combined annual income of parents must be declared." }
    ]
  },
  {
    id: "residence-certificate",
    slug: "residence-certificate",
    title: "Residence & Domicile Certificate",
    shortDescription: "Assistance for official residence and state domicile proof certificates.",
    description: "Documentation support for applying for State Domicile and Native Residence Certificates essential for state quota college admissions, government jobs, and housing schemes.",
    category: "Government Documents",
    iconName: "FileCheck",
    featured: false,
    available: true,
    estimatedTime: "10 - 15 Business Days",
    serviceFee: "Fee varies by service",
    documents: [
      "Applicant Aadhaar Card",
      "Continuous Residence Proof (Electricity bills / School Leaving Cert)",
      "Parent's Residence Proof or Land Document"
    ],
    process: [
      { step: 1, title: "Check Eligibility", description: "Verify minimum required years of residence in state." },
      { step: 2, title: "Upload Proofs", description: "Provide address documents and school records." },
      { step: 3, title: "E-District Application", description: "Submit application to state revenue authority." }
    ],
    notes: "Requirements vary according to state government e-District guidelines.",
    faq: [
      { question: "What is the difference between Domicile and Residence?", answer: "Domicile indicates permanent home state status, while Residence confirms current living address." }
    ]
  },
  {
    id: "caste-certificate",
    slug: "caste-certificate",
    title: "Caste Certificate Assistance",
    shortDescription: "Filing support for SC / ST / OBC / EWS reservation certificates.",
    description: "Guidance for submitting online applications for Caste and Category Certificates (SC, ST, OBC, EWS) needed for reservation benefits in education and public recruitment.",
    category: "Government Documents",
    iconName: "FileCheck",
    featured: false,
    available: true,
    estimatedTime: "15 - 30 Business Days",
    serviceFee: "Fee varies by service",
    documents: [
      "Applicant Aadhaar Card",
      "Blood Relative's Caste Certificate (Father / Paternal Uncle)",
      "School Leaving Certificate showing caste entry",
      "Affidavit on Stamp Paper"
    ],
    process: [
      { step: 1, title: "Gather Family Proof", description: "Locate existing paternal family caste records." },
      { step: 2, title: "File e-District Form", description: "Fill state category certificate application." },
      { step: 3, title: "Inquiry & Approval", description: "Revenue department verifies ancestral records." }
    ],
    notes: "OBC Non-Creamy Layer (NCL) certificates require current year income proof.",
    faq: [
      { question: "How long is an OBC NCL certificate valid?", answer: "OBC Non-Creamy Layer certificates are valid for one financial year." }
    ]
  },
  {
    id: "birth-death-certificate",
    slug: "birth-death-certificate",
    title: "Birth & Death Certificate Services",
    shortDescription: "Application and duplicate download support for Civil Registration System (CRS).",
    description: "Assistance with online registration guidance, status check, and digital copy downloads for Birth and Death certificates through municipal or CRS portals.",
    category: "Government Documents",
    iconName: "FileCheck",
    featured: false,
    available: true,
    estimatedTime: "7 - 15 Business Days",
    serviceFee: "Fee varies by service",
    documents: [
      "Hospital Discharge Slip / Institutional Slip",
      "Parents' / Informant Aadhaar Cards",
      "Registration Number (for existing record search)"
    ],
    process: [
      { step: 1, title: "Search CRS Database", description: "Check availability of record on municipal portal." },
      { step: 2, title: "File Application", description: "Submit application for new entry or digital copy." },
      { step: 3, title: "Download Certificate", description: "Retrieve QR-verified digital certificate." }
    ],
    notes: "Late registration beyond 21 days requires permission from designated authorities.",
    faq: [
      { question: "Can a birth certificate name be corrected?", answer: "Yes, correction can be initiated with hospital record verification." }
    ]
  },

  // --- EDUCATION ---
  {
    id: "scholarship-application",
    slug: "scholarship-application",
    title: "Scholarship Application Assistance",
    shortDescription: "Online form filling for National Scholarship Portal (NSP) and State schemes.",
    description: "Complete assistance for pre-matric, post-matric, higher education, and merit-cum-means scholarship submissions on NSP, State E-Kalyan, and Mahadbt portals.",
    category: "Education",
    iconName: "GraduationCap",
    featured: true,
    available: true,
    estimatedTime: "Varies by Scheme Deadline",
    serviceFee: "Service fee: Contact center",
    documents: [
      "Student Aadhaar Card (Linked with Mobile)",
      "Valid Income Certificate",
      "Caste / Category Certificate (if applicable)",
      "Previous Academic Marksheet & Institute Fee Receipt",
      "Bank Passbook with Aadhaar Seeding"
    ],
    process: [
      { step: 1, title: "Check Portal Deadlines", description: "Verify scheme opening dates and eligibility cutoff." },
      { step: 2, title: "Register Student Profile", description: "Create OTR (One Time Registration) profile." },
      { step: 3, title: "Upload Marksheets & Fees", description: "Format and attach clear academic scans." },
      { step: 4, title: "Institute Verification", description: "Submit acknowledgement copy to school/college nodal officer." }
    ],
    notes: "Student bank account must be seeded with Aadhaar for Direct Benefit Transfer (DBT).",
    faq: [
      { question: "Can a student apply for multiple scholarships?", answer: "Usually, students can receive only one government scholarship per academic year." }
    ]
  },
  {
    id: "college-admission-forms",
    slug: "college-admission-forms",
    title: "College & University Admission Forms",
    shortDescription: "Online registration for BA, BSc, BCom, BTech, and PG admissions.",
    description: "Guidance and online form filing for central universities (CUET), state college portals, degree admissions, subject choice filling, and counselling registration.",
    category: "Education",
    iconName: "BookOpen",
    featured: false,
    available: true,
    estimatedTime: "Immediate Online Submission",
    serviceFee: "Service fee: Contact center",
    documents: [
      "Class 10th and 12th Marksheets",
      "Transfer / Migration Certificate",
      "Scanned Photo & Signature",
      "Category Certificate (for quota reservation)"
    ],
    process: [
      { step: 1, title: "Select Target College", description: "Review eligibility criteria and cutoff subjects." },
      { step: 2, title: "Fill Registration Form", description: "Enter personal, academic, and subject preferences." },
      { step: 3, title: "Fee Payment & Submit", description: "Complete application fee payment and print receipt." }
    ],
    notes: "Double check subject combination preferences prior to final lock.",
    faq: [
      { question: "Can form errors be corrected after submission?", answer: "Correction windows depend on individual university portal policies." }
    ]
  },

  // --- JOBS & EXAMS ---
  {
    id: "govt-job-application",
    slug: "govt-job-application",
    title: "Government Job Application Assistance",
    shortDescription: "Online recruitment application filing for SSC, UPSC, Railways, Banking, & Defense.",
    description: "Error-free online application assistance for Staff Selection Commission (SSC), UPSC, IBPS Banking, RRB Railway, Police, and State Public Service Commission vacancies.",
    category: "Jobs & Exams",
    iconName: "Briefcase",
    featured: true,
    available: true,
    estimatedTime: "Immediate Online Submission",
    serviceFee: "Service fee: Contact center",
    documents: [
      "Educational Certificates & Marksheets (10th/12th/Degree)",
      "Photo (specific dimensions/background)",
      "Signature Scan (black/blue ink as required)",
      "Category / Ex-Serviceman Certificate (if applicable)"
    ],
    process: [
      { step: 1, title: "Verify Notification", description: "Check eligibility age limit and educational requirement." },
      { step: 2, title: "Format Photo & Signature", description: "Resize images to exact KB and pixel specifications." },
      { step: 3, title: "Submit Form", description: "Complete form inputs and download exam confirmation PDF." }
    ],
    notes: "Photographs must be recent with clear face visibility and light background.",
    faq: [
      { question: "What if the portal server is slow on deadline day?", answer: "We advise filing applications at least 3-5 days before closing dates." }
    ]
  },
  {
    id: "admit-card-result-assistance",
    slug: "admit-card-result-assistance",
    title: "Admit Card & Result Download",
    shortDescription: "Fast retrieval and printing of exam hall tickets and official marksheets.",
    description: "Download and high-quality printout service for recruitment exam admit cards, hall tickets, roll number lookup, and scorecards.",
    category: "Jobs & Exams",
    iconName: "Briefcase",
    featured: false,
    available: true,
    estimatedTime: "Instant On-Spot",
    serviceFee: "Service fee: Contact center",
    documents: [
      "Registration Number / Application ID",
      "Date of Birth / Password"
    ],
    process: [
      { step: 1, title: "Provide Credentials", description: "Enter Roll Number or Registration ID." },
      { step: 2, title: "Download File", description: "Retrieve PDF admit card or scorecard." },
      { step: 3, title: "Print Copy", description: "Get clear color or B&W printout." }
    ],
    notes: "Check exam center address and instructions printed on the admit card.",
    faq: [
      { question: "What if I forgot my registration number?", answer: "We can assist with portal 'Forgot Registration ID' recovery options." }
    ]
  },

  // --- FINANCIAL & UTILITY ASSISTANCE ---
  {
    id: "electricity-bill-assistance",
    slug: "electricity-bill-assistance",
    title: "Electricity Bill Payment Assistance",
    shortDescription: "Instant bill lookup and payment submission for state electricity boards.",
    description: "Assistance with fetching monthly electricity bills, reviewing consumer account details, and completing online payment submissions with instant digital receipts.",
    category: "Financial & Utility Assistance",
    iconName: "Receipt",
    featured: false,
    available: true,
    estimatedTime: "Instant Real-time Receipt",
    serviceFee: "Fee varies by service",
    documents: [
      "Consumer Account Number (CA / K No / Account ID)",
      "Previous Bill Copy (Optional)"
    ],
    process: [
      { step: 1, title: "Enter Consumer No", description: "Fetch current due amount from board portal." },
      { step: 2, title: "Verify Bill Details", description: "Confirm consumer name and billing period." },
      { step: 3, title: "Process Payment", description: "Receive instant printed payment confirmation." }
    ],
    notes: "Always pay before due date to avoid disconnection penalty charges.",
    faq: [
      { question: "How long does payment take to update with the board?", answer: "Payments reflect on official board records within 24 to 48 hours." }
    ]
  },
  {
    id: "banking-service-assistance",
    slug: "banking-service-assistance",
    title: "Banking Service Assistance",
    shortDescription: "Guidance for online account opening forms, PMJDY, and DBT status check.",
    description: "Guidance for filling online bank account opening forms, checking Direct Benefit Transfer (DBT) linking status, and pension scheme applications.",
    category: "Financial & Utility Assistance",
    iconName: "Receipt",
    featured: false,
    available: true,
    estimatedTime: "Same Day",
    serviceFee: "Service fee: Contact center",
    documents: [
      "Aadhaar Card",
      "PAN Card",
      "Passport Photograph",
      "Mobile Number linked to Aadhaar"
    ],
    process: [
      { step: 1, title: "Form Filing Guidance", description: "Assist with digital bank account application forms." },
      { step: 2, title: "DBT Status Check", description: "Verify if Aadhaar is linked with bank for subsidies." }
    ],
    notes: "DISCLAIMER: This center is a digital service assistance provider and is NOT a bank or financial institution. Financial transactions are conducted through official banking portals.",
    faq: [
      { question: "Is this center an official bank branch?", answer: "No, we provide digital form guidance and public portal assistance only." }
    ]
  },

  // --- TRAVEL & PASSPORT ASSISTANCE ---
  {
    id: "passport-application-assistance",
    slug: "passport-application-assistance",
    title: "Passport Application Assistance",
    shortDescription: "Form filling, fee payment, and slot booking for Fresh & Re-issue Passports.",
    description: "Complete guidance for Passport Seva portal account creation, online application (Form 1), document advisor review, fee payment, and Passport Seva Kendra (PSK) appointment booking.",
    category: "Travel & Passport Assistance",
    iconName: "Globe",
    featured: true,
    available: true,
    estimatedTime: "Appointment as per PSK availability",
    serviceFee: "Service fee: Contact center",
    documents: [
      "Aadhaar Card / Voter ID (Identity & Address Proof)",
      "Class 10th Certificate (ECNR Proof)",
      "Bank Passbook with photo / Utility bill"
    ],
    process: [
      { step: 1, title: "Create Passport Seva Account", description: "Register applicant on official portal." },
      { step: 2, title: "Fill Form 1", description: "Provide applicant details, parents' names, and address." },
      { step: 3, title: "Pay Official Govt Fee", description: "Submit ₹1500 (or applicable) fee on portal." },
      { step: 4, title: "Book PSK Slot", description: "Select convenient date and time at nearest PSK." },
      { step: 5, title: "Visit PSK", description: "Applicant visits PSK with original documents for biometrics." }
    ],
    notes: "Applicant must physically attend the Passport Seva Kendra appointment with original documents.",
    faq: [
      { question: "What is ECNR status?", answer: "Emigration Check Not Required (ECNR) is granted to applicants who have passed Class 10th or higher." }
    ]
  },
  {
    id: "travel-ticket-assistance",
    slug: "travel-ticket-assistance",
    title: "Travel Ticket Assistance",
    shortDescription: "Online IRCTC Train, Bus, and Flight ticket booking assistance.",
    description: "Assistance with searching train availability, booking IRCTC e-tickets, state transport bus reservations, and checking PNR status.",
    category: "Travel & Passport Assistance",
    iconName: "Globe",
    featured: false,
    available: true,
    estimatedTime: "Instant Booking",
    serviceFee: "Service fee: Contact center",
    documents: [
      "Passenger Names, Ages, and Gender",
      "Valid Identity Card details"
    ],
    process: [
      { step: 1, title: "Search Routes", description: "Find available train/bus connections." },
      { step: 2, title: "Book Ticket", description: "Fill passenger details and complete booking." },
      { step: 3, title: "Print Ticket", description: "Receive printed e-ticket with PNR number." }
    ],
    notes: "Carry original photo ID during travel as mandated by railway/bus authorities.",
    faq: [
      { question: "Can I check PNR status here?", answer: "Yes, we provide instant PNR status lookup." }
    ]
  },

  // --- DIGITAL & DOCUMENTATION SERVICES ---
  {
    id: "printing-scanning-services",
    slug: "printing-scanning-services",
    title: "Printing & Scanning Services",
    shortDescription: "High-resolution color/B&W printing, document scanning, and PDF creation.",
    description: "On-spot high quality printing (Color/B&W), multi-page document scanning, image cleaning, and multi-file PDF compilation for online submissions.",
    category: "Digital & Documentation Services",
    iconName: "Printer",
    featured: false,
    available: true,
    estimatedTime: "Instant On-Spot",
    serviceFee: "Service fee: Contact center",
    documents: [
      "Physical Documents or Soft Copy (Email / USB)"
    ],
    process: [
      { step: 1, title: "Provide File", description: "Submit document via email or USB drive." },
      { step: 2, title: "Print / Scan", description: "Operator executes high resolution print or scan." }
    ],
    notes: "Confidential handling for all customer documents.",
    faq: [
      { question: "What formats do you scan to?", answer: "We scan documents into PDF, JPEG, and PNG formats." }
    ]
  },
  {
    id: "photo-signature-resize",
    slug: "photo-signature-resize",
    title: "Photo & Signature Resize Services",
    shortDescription: "Image formatting according to exact exam & portal KB specifications.",
    description: "Crop, compress, and resize photographs and signatures to match mandatory portal requirements (e.g., 20KB-50KB, specific pixel ratios).",
    category: "Digital & Documentation Services",
    iconName: "Image",
    featured: false,
    available: true,
    estimatedTime: "5 - 10 Minutes",
    serviceFee: "Service fee: Contact center",
    documents: [
      "Scanned Photo or Physical Photograph",
      "Signature on white paper with black/blue pen"
    ],
    process: [
      { step: 1, title: "Check Portal Specs", description: "Review required KB size and dimensions." },
      { step: 2, title: "Process Image", description: "Resize, crop, and optimize image clarity." },
      { step: 3, title: "Deliver File", description: "Save processed file for your application." }
    ],
    notes: "Avoid blurred signatures or shadowy background photos.",
    faq: [
      { question: "Why do government portals reject photos?", answer: "Rejections usually occur due to wrong file size (KB), blurred face, or incorrect background color." }
    ]
  },
  {
    id: "document-upload-assistance",
    slug: "document-upload-assistance",
    title: "Document Upload Assistance",
    shortDescription: "Help with uploading multi-page PDFs and compressed files to portals.",
    description: "Technical assistance for applicants facing difficulties uploading heavy documents, merging multiple certificates into a single PDF, or resolving portal upload errors.",
    category: "Digital & Documentation Services",
    iconName: "Laptop",
    featured: false,
    available: true,
    estimatedTime: "Same Day",
    serviceFee: "Service fee: Contact center",
    documents: [
      "Files requiring upload",
      "Portal login credentials / application ID"
    ],
    process: [
      { step: 1, title: "Inspect Files", description: "Check file sizes and formats." },
      { step: 2, title: "Optimize & Merge", description: "Combine pages into compressed single PDF if needed." },
      { step: 3, title: "Upload to Portal", description: "Assist with successful portal attachment." }
    ],
    notes: "Ensure file names do not contain special characters.",
    faq: [
      { question: "What is the maximum file size allowed on most portals?", answer: "Most portals accept files between 100KB and 2MB per document." }
    ]
  },

  // --- OTHER ONLINE SERVICES ---
  {
    id: "voter-id-assistance",
    slug: "voter-id-assistance",
    title: "Voter ID Services",
    shortDescription: "New Voter Registration (Form 6), correction, and e-EPIC download.",
    description: "Assistance with Election Commission of India (ECI) portal applications for new voter registration, address correction (Form 8), and e-EPIC digital card downloads.",
    category: "Other Online Services",
    iconName: "Grid",
    featured: false,
    available: true,
    estimatedTime: "15 - 30 Business Days",
    serviceFee: "Service fee: Contact center",
    documents: [
      "Aadhaar Card",
      "Age Proof (18+ years)",
      "Current Residence Address Proof",
      "Passport Photograph"
    ],
    process: [
      { step: 1, title: "Form Selection", description: "Choose Form 6 (New) or Form 8 (Correction)." },
      { step: 2, title: "File Application", description: "Submit details on NVSP portal." },
      { step: 3, title: "BLO Verification", description: "Booth Level Officer verifies residence." }
    ],
    notes: "Applicant must be 18 years or older as of the qualifying date.",
    faq: [
      { question: "How can I download digital Voter Card (e-EPIC)?", answer: "e-EPIC can be downloaded using your EPIC Number or Form Reference Number." }
    ]
  },
  {
    id: "jeevan-pramaan-assistance",
    slug: "jeevan-pramaan-assistance",
    title: "Digital Life Certificate (Jeevan Pramaan)",
    shortDescription: "Biometric Digital Life Certificate generation for pensioners.",
    description: "Assistance for government and defense pensioners in generating biometric Digital Life Certificates (Jeevan Pramaan) online without visiting bank branches.",
    category: "Other Online Services",
    iconName: "Grid",
    featured: true,
    available: true,
    estimatedTime: "Instant On-Spot",
    serviceFee: "Service fee: Contact center",
    documents: [
      "Aadhaar Number",
      "Pension Payment Order (PPO) Number",
      "Bank Account details receiving pension",
      "Mobile Number for OTP"
    ],
    process: [
      { step: 1, title: "Enter PPO Details", description: "Input pensioner Aadhaar and PPO number." },
      { step: 2, title: "Biometric Scan", description: "Authenticate pensioner fingerprint or face scan." },
      { step: 3, title: "Generate Certificate", description: "Instant Pramaan ID generated and sent to pension disbursing agency." }
    ],
    notes: "Requires physical presence of the pensioner for biometric authentication.",
    faq: [
      { question: "When should pensioners submit Jeevan Pramaan?", answer: "Pensioners typically need to submit their life certificate annually, usually in November." }
    ]
  }
];
