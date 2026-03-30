import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../components/common/Container.jsx';
import Button from '../components/common/Button.jsx';
import ProgressBar from '../features/application/components/ProgressBar.jsx';
import StepIndicator from '../features/application/components/StepIndicator.jsx';
import OTPInput from '../features/application/components/OTPInput.jsx';
import { useApplicationForm } from '../features/application/hooks/useApplicationForm.js';
import { useToast } from '../context/ToastContext.jsx';
import { cn } from '../utils/cn';

// Step components
import BasicInfoStep from '../features/application/components/steps/BasicInfoStep.jsx';
import LegalInfoStep from '../features/application/components/steps/LegalInfoStep.jsx';
import EducationStep from '../features/application/components/steps/EducationStep.jsx';
import GoalsStep from '../features/application/components/steps/GoalsStep.jsx';
import SecurityStep from '../features/application/components/steps/SecurityStep.jsx';

const steps = [
  { label: 'Basic Info', id: 'basic' },
  { label: 'Legal & ID', id: 'legal' },
  { label: 'Education', id: 'edu' },
  { label: 'Goals', id: 'goals' },
  { label: 'Security', id: 'security' },
];

function Application() {
  const navigate = useNavigate();
  const toast = useToast();
  const [showOTP, setShowOTP] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  
  const {
    activeStep,
    formData,
    touched,
    errors,
    isFormValid,
    isLoading,
    apiError,
    handleNext,
    handleBack,
    updateField,
    handleBlur,
    validateStep,
    verifyOTP,
    resendOTP,
    progress
  } = useApplicationForm(steps);

  const onComplete = () => {
    toast.success('Registration successful! Please verify your email.');
    setShowOTP(true);
  };

  const onVerifySuccess = () => {
    toast.success('Email verified! Redirecting to dashboard...');
    setTimeout(() => navigate('/dashboard'), 2000);
  };

  const handleResendOTP = async () => {
    const success = await resendOTP();
    if (success) {
      toast.info('New verification code sent to your email.');
    } else {
      toast.error('Failed to resend code. Please try again.');
    }
  };

  const renderStep = () => {
    const props = { formData, updateField, handleBlur, errors, touched, validateStep };
    switch (activeStep) {
      case 0: return <BasicInfoStep {...props} />;
      case 1: return <LegalInfoStep {...props} />;
      case 2: return <EducationStep {...props} />;
      case 3: return <GoalsStep {...props} />;
      case 4: return <SecurityStep {...props} />;
      default: return null;
    }
  };

  if (showOTP) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-20 flex items-center justify-center">
        <Container size="sm">
          <div className="bg-gray-50/30 rounded-[32px] p-8 md:p-12 border border-gray-100 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
              </svg>
            </div>
            
            <h1 className="text-xl font-bold text-gray-900 mb-2 tracking-tight uppercase tracking-wider">Verify Email</h1>
            <p className="text-xs text-gray-400 font-medium mb-10 leading-relaxed uppercase tracking-widest">
              We've sent a 6-digit verification code to<br/>
              <span className="text-gray-900 font-bold">{formData.email}</span>
            </p>

            <div className="mb-10">
              <OTPInput value={otpValue} onChange={setOtpValue} />
              {apiError && <p className="mt-4 text-[10px] text-red-500 font-bold uppercase tracking-widest">{apiError}</p>}
            </div>

            <Button 
              onClick={() => verifyOTP(otpValue, onVerifySuccess)} 
              className="w-full py-4 rounded-xl shadow-xl shadow-orange-500/10 bg-orange-500 hover:bg-orange-600"
              disabled={otpValue.length < 6 || isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify Account'}
            </Button>

            <div className="mt-8">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-3">Didn't receive the code?</p>
              <button 
                onClick={handleResendOTP}
                disabled={isLoading}
                className="flex items-center gap-2 mx-auto text-orange-500 font-bold text-[10px] uppercase tracking-[0.2em] hover:text-orange-600 transition-colors disabled:opacity-50"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Resend Code
              </button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-28 pb-16">
      <Container size="sm">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight uppercase tracking-[0.1em]">Student Application</h1>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em]">Start your journey towards a global scholarship</p>
        </div>

        <div className="max-w-xl mx-auto">
          {/* Header Progress */}
          <div className="mb-8 p-6 bg-gray-50/50 rounded-2xl border border-gray-100/50">
             <div className="flex justify-between items-end mb-4 px-1">
                <p className={cn(
                  "text-[10px] font-bold uppercase tracking-[0.2em] transition-colors",
                  progress === 100 ? "text-green-500" : "text-orange-500"
                )}>
                  {progress === 100 ? 'Review & Submit' : `Section ${activeStep + 1} of 5`}
                </p>
                <p className="text-[10px] font-bold text-gray-400 shadow-transparent transition-all">{Math.round(progress)}%</p>
             </div>
             <ProgressBar progress={progress} />
             <div className="mt-6">
               <StepIndicator steps={steps} currentStep={activeStep} />
             </div>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {renderStep()}
            
            {apiError && (
              <div className="mt-6 p-4 bg-red-50/50 border border-red-100 rounded-xl text-center">
                <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">{apiError}</p>
              </div>
            )}

            {/* Final Actions */}
            <div className="flex gap-4 pt-8 mt-4">
               {activeStep > 0 && (
                 <Button variant="secondary" onClick={handleBack} disabled={isLoading} className="flex-1 py-3.5 text-[10px] tracking-[0.15em] rounded-xl border-gray-100">
                   Back
                 </Button>
               )}
               <Button 
                onClick={() => handleNext(onComplete)} 
                className={cn(
                  "flex-[2] py-3.5 text-[11px] rounded-xl uppercase tracking-[0.15em] font-semibold flex items-center justify-center gap-2 transition-all",
                  isFormValid && !isLoading
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/10 opacity-100" 
                    : "bg-gray-100 text-gray-400 opacity-50 cursor-not-allowed"
                )}
                disabled={!isFormValid || isLoading}
               >
                 {isLoading ? 'Processing...' : activeStep === steps.length - 1 ? 'Submit Application' : 'Continue'}
                 {!isLoading && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7" /></svg>}
               </Button>
            </div>
            
            <p className="mt-10 text-center text-[9px] font-bold text-gray-300 uppercase tracking-[0.25em] leading-relaxed">
              Your data is secured with high-level encryption
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Application;
