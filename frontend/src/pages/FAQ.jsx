import React, { useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import SEO from '../components/SEO';
import FAQAccordion from '../components/FAQAccordion';
import { Search, HelpCircle } from 'lucide-react';

const faqCategories = [
  {
    category: 'Applications & Process',
    items: [
      {
        question: 'How do I submit an application through the center?',
        answer: 'Browse our Services catalog, select the desired service item, click "Apply Now", fill out the applicant details form, attach required documents, and submit.'
      },
      {
        question: 'What happens after I submit an application?',
        answer: 'Your application is assigned a unique Reference ID (e.g. CSC-2026-XXXXXX). Our operator inspects the details and updates the status to Under Review, Document Required, Approved, or Completed.'
      },
      {
        question: 'How can I track my application status?',
        answer: 'You can use the public Track Application page by entering your Reference ID, or view all your submissions under My Applications when logged into your account.'
      }
    ]
  },
  {
    category: 'Documents & Verification',
    items: [
      {
        question: 'What proof documents are required for application submission?',
        answer: 'Document requirements vary by service catalog item. Standard proof of identity (Aadhaar/Voter ID), proof of address, and passport photographs are commonly requested.'
      },
      {
        question: 'Are my uploaded documents stored securely?',
        answer: 'Yes. Identity documents are stored in private encrypted storage buckets. Document downloads use short-lived signed URLs accessible only by authorized account owners and operators.'
      },
      {
        question: 'What should I do if additional documents are requested?',
        answer: 'If your status changes to "Document Required", open your application detail page under My Applications to upload the requested proofs directly.'
      }
    ]
  },
  {
    category: 'Payments & Fees',
    items: [
      {
        question: 'What is the Center Service Fee?',
        answer: 'The Center Service Fee is an assistance charge for processing and verifying your online submission. It is clearly displayed prior to checkout.'
      },
      {
        question: 'Is online payment secure?',
        answer: 'Yes. Online payments use 256-bit encrypted gateway checkouts. All transaction signatures are verified server-side. We never receive or store card numbers or PINs.'
      }
    ]
  }
];

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const breadcrumbs = [
    { label: 'Frequently Asked Questions', path: '/faq' }
  ];

  const filteredCategories = faqCategories.map(cat => ({
    category: cat.category,
    items: cat.items.filter(
      item => item.question.toLowerCase().includes(searchTerm.toLowerCase()) || item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen space-y-8">
      <SEO
        title="Frequently Asked Questions (FAQ) | CSC Digital Service Center"
        description="Find answers to common questions regarding online application submission, document requirements, tracking, and service fees."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <Breadcrumbs items={breadcrumbs} />

        <div className="border-b border-slate-200 pb-4 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 uppercase tracking-wider">
              Help Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Quick solutions and guidelines for applying, tracking, and document verification.
          </p>
        </div>

        {/* Search Input */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative">
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search FAQ questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10 text-xs py-2.5"
          />
        </div>

        {/* Accordion Categories */}
        <div className="space-y-8">
          {filteredCategories.length === 0 ? (
            <p className="text-xs text-slate-400 italic text-center py-6">No FAQ items matching "{searchTerm}".</p>
          ) : (
            filteredCategories.map((cat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-600" />
                  <span>{cat.category}</span>
                </h3>
                <FAQAccordion items={cat.items} />
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default FAQ;
