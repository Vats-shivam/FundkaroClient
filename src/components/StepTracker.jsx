import React from 'react';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';

const StepTracker = ({ currentStep, totalSteps, skippedSteps }) => {
  const steps = [
    { number: 1, title: 'Personal Information', description: 'Email verification' },
    { number: 2, title: 'Identity Verification', description: 'Aadhar & PAN verification' },
    { number: 3, title: 'Loan Preferences', description: 'Survey & credit report' }
  ];
  
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-semibold text-darkPrimary mb-6">Application Steps</h2>
      
      <div className="space-y-8">
        {steps.map((step) => {
          const isActive = step.number === currentStep;
          const isSkipped = skippedSteps.includes(step.number);
          const isCompleted = step.number < currentStep && !isSkipped;
          
          return (
            <div 
              key={step.number} 
              className={`flex items-start space-x-3 ${isActive ? 'opacity-100' : 'opacity-70'}`}
            >
              <div className="flex-shrink-0 mt-1">
                {isCompleted ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : isSkipped ? (
                  <AlertCircle className="w-6 h-6 text-amber-500" />
                ) : isActive ? (
                  <div className="w-6 h-6 rounded-full bg-lightPrimary text-white flex items-center justify-center text-sm font-medium">
                    {step.number}
                  </div>
                ) : (
                  <Circle className="w-6 h-6 text-gray-300" />
                )}
              </div>
              
              <div>
                <h3 className={`font-medium ${isActive ? 'text-darkPrimary' : 'text-gray-700'}`}>
                  {step.title}
                  {isSkipped && <span className="ml-2 text-amber-500 text-sm">(Skipped)</span>}
                </h3>
                <p className="text-sm text-gray-500">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-auto pt-8">
        <div className="text-sm text-gray-500">
          <p className="flex items-center mb-2">
            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            <span>Completed</span>
          </p>
          <p className="flex items-center mb-2">
            <AlertCircle className="w-4 h-4 text-amber-500 mr-2" />
            <span>Skipped for later</span>
          </p>
          <p className="flex items-center">
            <Circle className="w-4 h-4 text-gray-300 mr-2" />
            <span>Pending</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StepTracker;
