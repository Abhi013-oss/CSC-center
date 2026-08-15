import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import FileUpload from '../components/FileUpload';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import { servicesData } from '../data/servicesData';
import { useAuth } from '../context/AuthContext';
import { createApplication, uploadUserDocument } from '../services/api';
import { ArrowRight, ArrowLeft, CheckCircle2, User, MapPin, FileText, Check, Search, ShieldCheck, Edit3 } from 'lucide-react';

const Apply = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const selectedService = servicesData.find((s) => s.id === serviceId || s.slug === serviceId) || servicesData[0];

  useEffect(() => {
    document.title = `CSC Center | Apply for ${selectedService ? selectedService.title : 'Service'}`;
  }, [selectedService]);

  // Stepper state: 1 = Applicant Info, 2 = Address, 3 = Documents, 4 = Review, 5 = Submitted
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    serviceId: selectedService?.id || 'pan-card-application',
    fullName: user?.fullName || '',
    phone: user?.mobile || '',
    email: user?.email || '',
    dob: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    remarks: '',
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdResult, setCreatedResult] = useState(null);
  const [apiError, setApiError] = useState('');

  // Sync logged in user profile defaults
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || user.fullName || '',
        phone: prev.phone || user.mobile || '',
        email: prev.email || user.email || ''
      }));
    }
  }, [user]);

  // Sync selected service when URL param changes
  useEffect(() => {
    if (selectedService) {
      setFormData(prev => ({ ...prev, serviceId: selectedService.id }));
    }
  }, [selectedService]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';

      const phoneRegex = /^[6-9]\d{9}$/;
      if (!formData.phone.trim()) {
        newErrors.phone = 'Mobile number is required.';
      } else if (!phoneRegex.test(formData.phone.trim())) {
        newErrors.phone = 'Please enter a valid 10-digit Indian mobile number.';
      }

      if (formData.email.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email.trim())) {
          newErrors.email = 'Please enter a valid email address.';
        }
      }
    }

    if (step === 2) {
      if (formData.pinCode.trim()) {
        const pinRegex = /^\d{6}$/;
        if (!pinRegex.test(formData.pinCode.trim())) {
          newErrors.pinCode = 'PIN code must be a 6-digit number.';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setApiError('');

    try {
      // 1. Submit Application to Backend API
      const res = await createApplication({
        fullName: formData.fullName,
        mobile: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pinCode: formData.pinCode,
        dateOfBirth: formData.dob,
        serviceId: formData.serviceId,
        remarks: formData.remarks
      });

      if (res && res.success && res.data) {
        const newAppId = res.data.applicationId;

        // 2. Upload documents if attached
        if (uploadedFiles.length > 0) {
          for (const file of uploadedFiles) {
            try {
              await uploadUserDocument(newAppId, file);
            } catch (fileErr) {
              console.warn('[Apply.jsx] Document upload warning:', fileErr);
            }
          }
        }

        setCreatedResult(res.data);
        setCurrentStep(5);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setApiError(res.message || 'Failed to submit application. Please try again.');
      }
    } catch (err) {
      console.error('[Apply.jsx] Submission error:', err);
      const msg = err.response?.data?.message || 'Server connection error. Please try again later.';
      setApiError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const breadcrumbs = [
    { label: 'Services', path: '/services' },
    { label: selectedService.title, path: `/services/${selectedService.slug}` },
    { label: 'Apply', path: `/apply/${selectedService.id}` }
  ];

  const steps = [
    { number: 1, label: 'Applicant Details', icon: User },
    { number: 2, label: 'Address', icon: MapPin },
    { number: 3, label: 'Documents', icon: FileText },
    { number: 4, label: 'Review & Submit', icon: ShieldCheck }
  ];

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen space-y-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb Bar */}
        <Breadcrumbs items={breadcrumbs} />

        {/* Stepper Progress Indicator */}
        {currentStep <= 4 && (
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="grid grid-cols-4 gap-2 sm:gap-4 relative">
              {steps.map((s) => {
                const IconComp = s.icon;
                const isCompleted = currentStep > s.number;
                const isCurrent = currentStep === s.number;

                return (
                  <div key={s.number} className="flex flex-col items-center text-center space-y-2">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
                      isCompleted
                        ? 'bg-emerald-600 text-white shadow-md'
                        : isCurrent
                        ? 'bg-indigo-600 text-white shadow-lg ring-4 ring-indigo-100'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}>
                      {isCompleted ? <Check className="w-5 h-5" /> : <IconComp className="w-5 h-5" />}
                    </div>
                    <span className={`text-xs font-semibold hidden sm:block ${
                      isCurrent ? 'text-indigo-600' : isCompleted ? 'text-emerald-700' : 'text-slate-400'
                    }`}>
                      Step {s.number}: {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Real Success Result Banner (Step 5) */}
        {createdResult && (
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-emerald-200 shadow-xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-200">
                Application Successfully Created
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Application Reference ID Generated
              </h2>
              <div className="pt-2">
                <span className="inline-block bg-slate-900 text-white font-mono font-extrabold text-2xl sm:text-3xl px-8 py-3.5 rounded-2xl shadow-inner border border-slate-700 tracking-wider">
                  {createdResult.applicationId}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto pt-2 leading-relaxed">
                Your application for <strong>{createdResult.serviceName}</strong> has been logged in our PostgreSQL database system.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to={isAuthenticated ? "/my-applications" : "/track"}
                className="btn-primary text-sm py-3 px-6 flex items-center justify-center gap-2 shadow-md w-full sm:w-auto"
              >
                <Search className="w-4 h-4" />
                <span>{isAuthenticated ? 'View My Applications' : 'Track Application Status'}</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setCreatedResult(null);
                  setCurrentStep(1);
                  setFormData({
                    serviceId: selectedService.id,
                    fullName: user?.fullName || '',
                    phone: user?.mobile || '',
                    email: user?.email || '',
                    dob: '',
                    address: '',
                    city: '',
                    state: '',
                    pinCode: '',
                    remarks: ''
                  });
                  setUploadedFiles([]);
                }}
                className="btn-tertiary text-sm py-3 px-6 w-full sm:w-auto cursor-pointer"
              >
                Submit Another Application
              </button>
            </div>
          </div>
        )}

        {apiError && (
          <Alert type="error" title="Submission Error">
            {apiError}
          </Alert>
        )}

        {/* Main Form Container */}
        {!createdResult && (
          <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8 relative">
            
            {isSubmitting && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center z-20 rounded-2xl">
                <Loading message="Creating application record & attaching documents..." />
              </div>
            )}

            <div className="border-b border-slate-100 pb-4 space-y-1">
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                Target Service Catalog Item
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {selectedService.title}
              </h1>
              {user && (
                <p className="text-xs text-slate-500 pt-1">
                  Applying as logged-in user: <strong className="text-slate-800">{user.fullName} ({user.email})</strong>
                </p>
              )}
            </div>

            {/* STEP 1: Applicant Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-lg font-bold text-slate-900">Step 1: Applicant Personal Details</h3>
                </div>

                <div>
                  <label className="form-label">Service Category Item *</label>
                  <select
                    name="serviceId"
                    value={formData.serviceId}
                    onChange={(e) => {
                      const found = servicesData.find(s => s.id === e.target.value);
                      if (found) navigate(`/apply/${found.id}`);
                      handleChange(e);
                    }}
                    className="form-input bg-slate-50 font-medium"
                  >
                    {servicesData.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title} ({s.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Full Name of Applicant *</label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="e.g. Rahul Sharma"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`form-input ${errors.fullName ? 'border-red-500 focus:ring-red-500' : ''}`}
                    />
                    {errors.fullName && <p className="text-xs text-red-600 mt-1 font-medium">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="form-label">10-Digit Mobile Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      maxLength="10"
                      placeholder="e.g. 9876543210"
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
                    <label className="form-label">Date of Birth (Optional)</label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="btn-primary py-3 px-8 flex items-center gap-2 cursor-pointer"
                  >
                    <span>Next: Address Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Address Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-lg font-bold text-slate-900">Step 2: Residential Address Information</h3>
                </div>

                <div>
                  <label className="form-label">Full Street Address</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="House No, Colony, Landmark..."
                    value={formData.address}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="form-label">City / Village</label>
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">6-Digit PIN Code</label>
                    <input
                      type="text"
                      name="pinCode"
                      maxLength="6"
                      placeholder="110001"
                      value={formData.pinCode}
                      onChange={handleChange}
                      className={`form-input ${errors.pinCode ? 'border-red-500 focus:ring-red-500' : ''}`}
                    />
                    {errors.pinCode && <p className="text-xs text-red-600 mt-1 font-medium">{errors.pinCode}</p>}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="btn-tertiary py-3 px-6 flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="btn-primary py-3 px-8 flex items-center gap-2 cursor-pointer"
                  >
                    <span>Next: Documents</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Document Attachments */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-lg font-bold text-slate-900">Step 3: Document Attachments</h3>
                  <p className="text-xs text-slate-500">Attach PDF, JPG, JPEG, or PNG files (max 5 MB each).</p>
                </div>

                <FileUpload
                  label="Attach Required Proofs & Certificates"
                  onFilesChange={(files) => setUploadedFiles(files)}
                />

                <div className="space-y-2">
                  <label className="form-label">Additional Instructions / Remarks</label>
                  <textarea
                    name="remarks"
                    rows="3"
                    placeholder="Mention specific correction details or notes..."
                    value={formData.remarks}
                    onChange={handleChange}
                    className="form-input"
                  ></textarea>
                </div>

                <div className="pt-4 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="btn-tertiary py-3 px-6 flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="btn-primary py-3 px-8 flex items-center gap-2 cursor-pointer"
                  >
                    <span>Next: Review & Submit</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Review Summary & Submission */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Step 4: Review Application Summary</h3>
                    <p className="text-xs text-slate-500">Please review your entries carefully before final submission.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Service & Applicant Summary */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-600 uppercase">Service & Applicant</span>
                      <button onClick={() => setCurrentStep(1)} className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-semibold cursor-pointer">
                        <Edit3 className="w-3 h-3" /> Edit
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-800">
                      <div><strong>Service:</strong> {selectedService.title}</div>
                      <div><strong>Full Name:</strong> {formData.fullName}</div>
                      <div><strong>Mobile:</strong> {formData.phone}</div>
                      <div><strong>Email:</strong> {formData.email || 'None'}</div>
                    </div>
                  </div>

                  {/* Address Summary */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-600 uppercase">Address Information</span>
                      <button onClick={() => setCurrentStep(2)} className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-semibold cursor-pointer">
                        <Edit3 className="w-3 h-3" /> Edit
                      </button>
                    </div>
                    <p className="text-sm text-slate-800">
                      {formData.address ? `${formData.address}, ` : ''}{formData.city || ''} {formData.state || ''} {formData.pinCode || ''}
                    </p>
                  </div>

                  {/* Document Summary */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-600 uppercase">Attached Documents</span>
                      <button onClick={() => setCurrentStep(3)} className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-semibold cursor-pointer">
                        <Edit3 className="w-3 h-3" /> Edit
                      </button>
                    </div>
                    {uploadedFiles.length > 0 ? (
                      <ul className="text-sm text-slate-800 space-y-1">
                        {uploadedFiles.map((f, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-slate-500" />
                            <span>{f.name} ({(f.size / 1024).toFixed(1)} KB)</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-500 italic">No documents attached.</p>
                    )}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="btn-tertiary py-3 px-6 flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting}
                    className="btn-primary py-3.5 px-8 text-base flex items-center gap-2 shadow-lg cursor-pointer disabled:opacity-50"
                  >
                    <span>{isSubmitting ? 'Submitting...' : 'Confirm & Submit Application'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default Apply;
