import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { validate } from '../../../utils/validation.js';
import { authService } from '../../../api/auth.service.js';

export function useApplicationForm(steps) {
  const [searchParams] = useSearchParams();
  const initialUniversity = searchParams.get('universityId') || searchParams.get('scholarshipId') || '';

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    surname: '',
    givenName: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    passport: '',
    dob: '',
    gender: 'Male',
    currentLevel: 'Bachelor',
    university: initialUniversity,
    major: '',
    gpa: '',
    gradYear: '2024',
    studyLevel: 'Master',
    desiredField: '',
    preferredCities: [],
    preferredLanguages: [],
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const validateStep = useCallback((step, data = formData) => {
    let stepErrors = {};
    
    if (step === 0) {
      stepErrors.surname = validate.required(data.surname);
      stepErrors.givenName = validate.required(data.givenName);
      stepErrors.email = validate.required(data.email) || validate.email(data.email);
      stepErrors.phone = validate.required(data.phone) || validate.phone(data.phone);
      stepErrors.country = validate.required(data.country);
      stepErrors.city = validate.required(data.city);
    } else if (step === 1) {
      stepErrors.passport = validate.required(data.passport) || validate.passport(data.passport);
      stepErrors.dob = validate.required(data.dob);
    } else if (step === 2) {
      stepErrors.currentLevel = validate.required(data.currentLevel);
      stepErrors.university = validate.required(data.university);
      stepErrors.major = validate.required(data.major);
      stepErrors.gradYear = validate.required(data.gradYear);
    } else if (step === 3) {
      stepErrors.studyLevel = validate.required(data.studyLevel);
      stepErrors.desiredField = validate.required(data.desiredField);
      stepErrors.preferredCities = validate.required(data.preferredCities);
    } else if (step === 4) {
      stepErrors.password = validate.required(data.password) || validate.password(data.password);
      stepErrors.confirmPassword = validate.required(data.confirmPassword) || validate.match(data.confirmPassword, data.password, 'Passwords');
      if (!data.agreeTerms) stepErrors.agreeTerms = 'You must agree to the terms';
    }

    return Object.fromEntries(Object.entries(stepErrors).filter(([_, v]) => v !== null));
  }, [formData]);

  useEffect(() => {
    const currentStepErrors = validateStep(activeStep);
    setIsFormValid(Object.keys(currentStepErrors).length === 0);
    
    const visibleErrors = {};
    Object.keys(currentStepErrors).forEach(field => {
      if (touched[field]) {
        visibleErrors[field] = currentStepErrors[field];
      }
    });
    setErrors(visibleErrors);
  }, [activeStep, formData, touched, validateStep]);

  const handleNext = async (onComplete) => {
    const currentStepErrors = validateStep(activeStep);
    if (Object.keys(currentStepErrors).length === 0) {
      if (activeStep < steps.length - 1) {
        setActiveStep(activeStep + 1);
        setErrors({});
        setTouched({});
      } else {
        // Final Step: Submit to Backend
        setIsLoading(true);
        setApiError(null);
        try {
          const payload = {
            firstName: formData.givenName,
            lastName: formData.surname,
            email: formData.email,
            password: formData.password,
            country: formData.country,
            city: formData.city,
            gender: formData.gender,
            phone: formData.phone,
            passportNumber: formData.passport,
            dateOfBirth: formData.dob,
            currentLevel: formData.currentLevel,
            university: formData.university,
            major: formData.major,
            gpa: formData.gpa,
            gradYear: formData.gradYear,
            studyLevel: formData.studyLevel,
            desiredField: formData.desiredField,
            preferredCities: formData.preferredCities,
            preferredLanguages: formData.preferredLanguages,
          };
          await authService.register(payload);
          onComplete();
        } catch (err) {
          setApiError(err.message || 'Registration failed. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    } else {
      const stepFields = Object.keys(currentStepErrors);
      const newTouched = { ...touched };
      stepFields.forEach(f => newTouched[f] = true);
      setTouched(newTouched);
      setErrors(currentStepErrors);
    }
  };

  const verifyOTP = async (otp, onSuccess) => {
    setIsLoading(true);
    setApiError(null);
    try {
      await authService.verifyEmail(formData.email, otp);
      onSuccess();
    } catch (err) {
      setApiError(err.message || 'Verification failed. Please check the code.');
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    try {
      await authService.resendOTP(formData.email);
      return true;
    } catch (err) {
      setApiError(err.message || 'Failed to resend code.');
      return false;
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
      setErrors({});
      setTouched({});
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  return {
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
    progress: (activeStep / (steps.length - 1)) * 100
  };
}
