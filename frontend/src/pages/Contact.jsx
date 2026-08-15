import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import ContactSection from '../components/ContactSection';
import FAQAccordion from '../components/FAQAccordion';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import { sendContactMessage } from '../services/api';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, HelpCircle, CheckCircle2 } from 'lucide-react';

const contactFaqs = [
  {
    question: "What are your center working hours?",
    answer: "Our physical center is open Monday to Saturday from 9:30 AM to 7:00 PM. Lunch break is from 1:30 PM to 2:00 PM. Emergency online consultation is available on request."
  },
  {
    question: "Do I need an appointment before visiting the center?",
    answer: "No appointment is necessary for general form filling or document scanning. You can visit during operational hours."
  },
  {
    question: "What documents should I bring when visiting?",
    answer: "Please bring your original Aadhaar Card, active mobile phone (for OTP verification), recent passport photographs, and relevant marksheets or income proofs required for your target service."
  },
  {
    question: "How can I check the status of my submitted application?",
    answer: "You can track your application status anytime using your application reference ID on our Track Application page or by messaging our WhatsApp support desk."
  }
];

const Contact = () => {
  useEffect(() => {
    document.title = 'CSC Center | Contact Us';
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required.';

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Mobile number is required.';
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number.';
    }

    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address.';
      }
    }

    if (!formData.subject.trim()) newErrors.subject = 'Subject is required.';
    if (!formData.message.trim()) newErrors.message = 'Message is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError('');
    setSuccessMessage('');

    try {
      const res = await sendContactMessage({
        name: formData.name,
        mobile: formData.phone,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      });

      if (res && res.success) {
        setSuccessMessage(res.message || 'Inquiry submitted successfully.');
        setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
      } else {
        setApiError(res.message || 'Failed to send inquiry. Please try again.');
      }
    } catch (err) {
      console.error('[Contact.jsx] Inquiry error:', err);
      const msg = err.response?.data?.message || 'Server connection error. Please try again later.';
      setApiError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const breadcrumbs = [
    { label: 'Contact Us', path: '/contact' }
  ];

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumb Bar */}
        <Breadcrumbs items={breadcrumbs} />

        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest bg-indigo-100 px-3 py-1 rounded-full border border-indigo-200">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Contact CSC Service Desk
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Have questions about required documents, processing fees, or portal applications? Visit our center or send us a message.
          </p>
        </div>

        {/* Contact Form & Direct Messages */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Contact Info Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm space-y-6 relative">
            
            {isSubmitting && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center z-20 rounded-2xl">
                <Loading message="Submitting inquiry to database..." />
              </div>
            )}

            <div className="border-b border-slate-100 pb-4 space-y-1">
              <h2 className="text-xl font-bold text-slate-900">Send Us an Inquiry</h2>
              <p className="text-xs text-slate-500">
                Fill in your details below and our service desk operator will get back to you.
              </p>
            </div>

            {successMessage && (
              <Alert type="success" title="Inquiry Received">
                {successMessage}
              </Alert>
            )}

            {apiError && (
              <Alert type="error" title="Submission Error">
                {apiError}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Rahul Sharma"
                    value={formData.name}
                    onChange={handleChange}
                    className={`form-input ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                  {errors.name && <p className="text-xs text-red-600 mt-1 font-medium">{errors.name}</p>}
                </div>

                <div>
                  <label className="form-label">Mobile Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    maxLength="10"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`form-input ${errors.phone ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                  {errors.phone && <p className="text-xs text-red-600 mt-1 font-medium">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Email Address (Optional)</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-input ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                  {errors.email && <p className="text-xs text-red-600 mt-1 font-medium">{errors.email}</p>}
                </div>

                <div>
                  <label className="form-label">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="e.g. PAN Card Correction Query"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`form-input ${errors.subject ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                  {errors.subject && <p className="text-xs text-red-600 mt-1 font-medium">{errors.subject}</p>}
                </div>
              </div>

              <div>
                <label className="form-label">Message *</label>
                <textarea
                  name="message"
                  rows="4"
                  placeholder="Describe your question or document requirement..."
                  value={formData.message}
                  onChange={handleChange}
                  className={`form-input ${errors.message ? 'border-red-500 focus:ring-red-500' : ''}`}
                ></textarea>
                {errors.message && <p className="text-xs text-red-600 mt-1 font-medium">{errors.message}</p>}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full sm:w-auto text-base py-3 px-8 flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Sending...' : 'Submit Inquiry'}</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: FAQ & Quick Help */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-900">Common Contact FAQs</h3>
              </div>
              <FAQAccordion items={contactFaqs} />
            </div>
          </div>

        </div>

        {/* Full Contact Cards Section */}
        <ContactSection />

      </div>
    </div>
  );
};

export default Contact;
