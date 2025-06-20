import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PersonalInfoStep from './steps/PersonalInfoStep';
import IdentityVerificationStep from './steps/IdentityVerificationStep';
import LoanSurveyStep from './steps/LoanSurveyStep';
import StepTracker from './StepTracker';

const MultiStepForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    dob: '',
    referralCode: '',
    email: '',
    emailVerified: false,
    aadharNumber: '',
    panNumber: '',
    idsVerified: false,
    loanType: 'unsecuredBusiness',
    hasPreviousLoan: false,
    creditReportAuthorized: false,
    skippedSteps: []
  });
  
  const totalSteps = 3;
  
  const updateFormData = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
  };
  
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
      handleSubmit();
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handleSkip = () => {
    // Add current step to skipped steps
    updateFormData({
      skippedSteps: [...formData.skippedSteps, currentStep]
    });
    
    // Show toast notification
    toast.success(`Step ${currentStep} skipped. You can complete it later.`);
    
    // Move to next step
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
      handleSubmit();
    }
  };
  
  const handleSubmit = () => {
    // Check if any steps were skipped
    if (formData.skippedSteps.length > 0) {
      const confirmSubmit = window.confirm(
        `You've skipped ${formData.skippedSteps.length} step(s). Do you want to submit anyway? You can complete these steps later from your dashboard.`
      );
      
      if (!confirmSubmit) {
        return;
      }
    }
    
    // Simulate API call to submit form data
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          // Store token in localStorage (simulating successful login)
          localStorage.setItem('token', 'sample-auth-token');
          resolve();
        }, 2000);
      }),
      {
        loading: 'Submitting your application...',
        success: 'Application submitted successfully!',
        error: 'Error submitting application. Please try again.',
      }
    ).then(() => {
      // Redirect to dashboard after successful submission
      navigate('/dashboard');
    });
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep 
            formData={formData} 
            updateFormData={updateFormData} 
            onNext={handleNext}
            onSkip={handleSkip}
          />
        );
      case 2:
        return (
          <IdentityVerificationStep 
            formData={formData} 
            updateFormData={updateFormData} 
            onNext={handleNext}
            onBack={handleBack}
            onSkip={handleSkip}
          />
        );
      case 3:
        return (
          <LoanSurveyStep 
            formData={formData} 
            updateFormData={updateFormData} 
            onSubmit={handleSubmit}
            onBack={handleBack}
            onSkip={handleSkip}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Left side - Step Tracker */}
        <div className="w-full  bg-gray-50 p-6">
          <StepTracker 
            currentStep={currentStep} 
            totalSteps={totalSteps} 
            skippedSteps={formData.skippedSteps}
          />
        </div>
        
        {/* Right side - Form Content */}
        <div className="w-full p-6">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;
