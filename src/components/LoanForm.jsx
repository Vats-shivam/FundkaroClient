// src/App.jsx
import { useState, useEffect, useRef } from 'react';
import loanFlow from '../data/dynamic-chatbot-config.json';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useProfiles } from '../context/ProfileContext';

// --- Helper Functions & Components ---

const BotMessage = ({ content }) => (
  <div className="flex justify-start mb-4">
    <div className="bg-gray-200 text-gray-800 rounded-lg py-2 px-4 max-w-sm">
      {content}
    </div>
  </div>
);

const UserMessage = ({ content }) => (
  <div className="flex justify-end mb-4">
    <div className="bg-indigo-500 text-white rounded-lg py-2 px-4 max-w-sm">
      {content}
    </div>
  </div>
);

const TypingIndicator = () => (
    <div className="flex justify-start mb-4">
        <div className="bg-gray-200 text-gray-500 rounded-lg py-3 px-4 max-w-sm">
            <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
            </div>
        </div>
    </div>
);
function LoanForm({ isVisible = true, onClose = () => {}, existingDocuments = mockExistingDocuments }) {
  const {user} = useUser();
  const {profiles} = useProfiles();
  
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState({});
  const [currentStepId, setCurrentStepId] = useState('start');
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(null);
  const [fileInputMode, setFileInputMode] = useState('initial');
  const [tempSelectedProfiles, setTempSelectedProfiles] = useState([]);

  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  const currentStep = loanFlow.find(step => step.id === currentStepId);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);
  const navigate = useNavigate();
  // Main logic effect - FIXED
  useEffect(() => {
    console.log("mess",messages)
    if (!currentStep) {
      return;
    }
    if(currentStepId === 'end'){
      setTimeout(() => {
        navigate("/dashboard");
      }, 5000);
      return;
    }
    if(currentStep === 'start'){
      setMessages(()=>[]);
      return;
    }

    // Handle logic steps immediately without showing questions
    if (currentStep.inputType === 'logic') {
      handleLogicStep();
      return;
    }

    // Build knowledge base for smart skipping
    let knowledgeBase = { ...user, ...userData };
    if (userData.applicantType === 'onBehalfOf' && userData.beneficiary) {
      knowledgeBase = { ...knowledgeBase, ...userData.beneficiary };
    }

    // Check if we can skip this question (but not for options, profiles, files)
    const stepKey = currentStep.key;
    const canSkip = stepKey && 
                   knowledgeBase[stepKey] && 
                   !['options', 'profile_select', 'profile_multiselect', 'file', 'image'].includes(currentStep.inputType);

    if (canSkip) {
      // Skip this step since we already have the data
      setTimeout(() => {
        handleNextStep(knowledgeBase[stepKey]);
      }, 500);
      return;
    }

    // Show the question
    setIsTyping(true);
    setTimeout(() => {
      let question = currentStep.questionText;
      
      // Replace placeholders in question text
      Object.keys(knowledgeBase).forEach(key => {
        question = question.replace(`{${key}}`, knowledgeBase[key]);
      });
      
      addMessage('bot', question);
      setIsTyping(false);
      
      // Handle final steps
      if (currentStep.inputType === 'final') {
        setTimeout(() => {
          console.log('Application completed! Redirecting to dashboard...');
        }, 2000);
      }
    }, 1000);
  }, [currentStepId]);

  const handleLogicStep = () => {
    // For logic steps, we need to look at the previous step's value
    const logicKey = currentStep.key;
    const logicValue = userData[logicKey];
    
    if (logicValue && currentStep.nextSteps && currentStep.nextSteps[logicValue]) {
      const nextStepId = currentStep.nextSteps[logicValue];
      setCurrentStepId(nextStepId);
    } else {
      console.error('Logic step error:', { logicKey, logicValue, nextSteps: currentStep.nextSteps });
    }
  };

  const addMessage = (sender, content) => {
    if(currentStepId === 'start' && sender === 'bot'){
      setMessages([{ sender, content }]);
      return;
    }
    setMessages(prev => [...prev, { sender, content }]);
  };

  const handleNextStep = (value, explicitNextStep = null) => {
    let newUserData = { ...userData };
    
    // Store the value if there's a key
    if (currentStep.key) {
      newUserData = { ...newUserData, [currentStep.key]: value };
    }
    
    // Determine next step
    let nextStep = explicitNextStep || currentStep.nextStep;
    
    // Update state and move to next step
    setUserData(newUserData);
    setFileInputMode('initial'); 
    setTempSelectedProfiles([]);
    setCurrentStepId(nextStep);
    setInputValue('');
    setError(null);
  };

  const validateInput = (value, validationRules) => {
    if (!validationRules) return null;

    if (validationRules.required && !value) {
      return "This field is required.";
    }
    if (validationRules.regex && !new RegExp(validationRules.regex).test(value)) {
      return validationRules.regexError || "Invalid format.";
    }
    if (validationRules.min && value < validationRules.min) {
      return `Value must be at least ${validationRules.min}.`;
    }
    if (validationRules.max && value > validationRules.max) {
      return `Value must be no more than ${validationRules.max}.`;
    }
    if (validationRules.allowedTypes && !validationRules.allowedTypes.includes(value.type)) {
      return `Invalid file type. Please upload one of: ${validationRules.allowedTypes.map(t => t.split('/')[1]).join(', ')}.`;
    }
    return null;
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !currentStep) return;
    
    const validationError = validateInput(inputValue, currentStep.validation);
    if (validationError) {
      setError(validationError);
      return;
    }

    addMessage('user', inputValue);
    handleNextStep(inputValue);
  };

  const handleOptionClick = (option) => {
    addMessage('user', option.label);
    handleNextStep(option.value);
  };
  
  const handleProfileSelect = (profile) => {
    addMessage('user', `Selected: ${profile.fullName || profile.firstName}`);
    handleNextStep(profile);
  };
  
  const toggleClubMember = (profile) => {
    setTempSelectedProfiles(prev => 
      prev.some(p => p._id === profile._id)
        ? prev.filter(p => p._id !== profile._id)
        : [...prev, profile]
    );
  };

  const confirmClubSelection = () => {
    const selectedNames = tempSelectedProfiles.map(p => p.fullName || p.firstName).join(', ');
    addMessage('user', `Club Members: ${selectedNames}`);
    handleNextStep(tempSelectedProfiles);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validationError = validateInput(file, currentStep.validation);
    if (validationError) {
      setError(validationError);
      return;
    }

    let filePreview = file.name;
    if (currentStep.inputType === 'image' && file.type.startsWith('image/')) {
      filePreview = <img src={URL.createObjectURL(file)} alt="preview" className="w-40 h-auto rounded-md" />;
    }

    addMessage('user', filePreview);
    handleNextStep(file);
  };

  const handleExistingDocSelect = (doc) => {
    addMessage('user', `Selected: ${doc.name}`);
    handleNextStep(doc);
  };

  const renderInput = () => {
    if (!currentStep || currentStep.inputType === null || currentStep.inputType === 'final' || currentStep.inputType === 'logic' || currentStep.id === 'end') {
      return null;
    }

    switch (currentStep.inputType) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <div className="flex space-x-2">
            <input
              type={currentStep.inputType}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleUserSubmit(e)}
              className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Type your answer..."
              required={currentStep.validation?.required}
            />
            <button onClick={handleUserSubmit} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700">
              Send
            </button>
          </div>
        );
        
      case 'options':
        return (
          <div className="flex flex-wrap gap-2">
            {currentStep.options.map((opt, index) => (
              <button 
                key={index} 
                onClick={() => handleOptionClick(opt)} 
                className="bg-white border border-indigo-500 text-indigo-500 font-semibold py-2 px-4 rounded-lg hover:bg-indigo-500 hover:text-white transition-colors"
              >
                {opt.label}
              </button>
            ))}
          </div>
        );

      case 'profile_select':
        return (
          <div className="flex flex-wrap gap-2">
            {(profiles || []).map((profile) => (
              <button 
                key={profile._id} 
                onClick={() => handleProfileSelect(profile)} 
                className="bg-white border border-indigo-500 text-indigo-500 font-semibold py-2 px-4 rounded-lg hover:bg-indigo-500 hover:text-white transition-colors"
              >
                {profile.fullName || profile.firstName}
              </button>
            ))}
          </div>
        );
        
      case 'profile_multiselect':
        return (
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              {(profiles || []).map((profile) => (
                <button
                  key={profile._id}
                  onClick={() => toggleClubMember(profile)}
                  className={`font-semibold py-2 px-4 rounded-lg transition-colors border ${
                    tempSelectedProfiles.some(p => p._id === profile._id)
                      ? 'bg-indigo-500 text-white border-indigo-500'
                      : 'bg-white text-indigo-500 border-indigo-500 hover:bg-indigo-50'
                  }`}
                >
                  {profile.fullName || profile.firstName}
                </button>
              ))}
            </div>
            <button 
              onClick={confirmClubSelection} 
              disabled={tempSelectedProfiles.length === 0} 
              className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
            >
              Confirm Selection ({tempSelectedProfiles.length})
            </button>
          </div>
        );

      case 'file':
      case 'image':
        const relevantDocs = existingDocuments.filter(doc => 
          currentStep.documentType ? doc.name.toLowerCase().includes(currentStep.documentType.toLowerCase()) : true
        );

        if (fileInputMode === 'select') {
          return (
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700">Select an existing document:</h3>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                {relevantDocs.map(doc => (
                  <button 
                    key={doc._id}
                    onClick={() => handleExistingDocSelect(doc)}
                    className="w-full text-left p-2 bg-white border rounded-lg hover:bg-gray-100"
                  >
                    {doc.name} <span className="text-xs text-gray-500">({doc.status})</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setFileInputMode('initial')} className="text-sm text-indigo-600 hover:underline">
                Back
              </button>
            </div>
          );
        }

        return (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept={currentStep.validation?.allowedTypes?.join(',')}
            />
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => fileInputRef.current.click()} 
                className="flex-1 bg-white border border-indigo-500 text-indigo-500 font-semibold py-2 px-4 rounded-lg hover:bg-indigo-500 hover:text-white transition-colors"
              >
                Upload New File
              </button>
              <button 
                onClick={() => setFileInputMode('select')} 
                disabled={relevantDocs.length === 0}
                className="flex-1 bg-white border border-indigo-500 text-indigo-500 font-semibold py-2 px-4 rounded-lg hover:bg-indigo-500 hover:text-white transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed"
              >
                Select from My Documents ({relevantDocs.length})
              </button>
            </div>
          </>
        );
        
      default:
        return null;
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed text-black inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="relative w-full max-w-2xl h-[90vh] bg-white shadow-2xl rounded-lg flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Loan M·A·S·T·E·R</h1>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-600 transition"
            aria-label="Close Chat Modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-grow p-6 overflow-y-auto">
          {messages.map((msg, index) =>
            msg.sender === "bot" ? (
              <BotMessage key={index} content={msg.content} />
            ) : (
              <UserMessage key={index} content={msg.content} />
            )
          )}
          {isTyping && <TypingIndicator />}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t bg-gray-50">
          {renderInput()}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
        
        {/* Summary shown after completion */}
        {currentStepId === "end" && (
          <div className="absolute bottom-4 w-full max-w-2xl px-4">
            <div className="p-4 bg-white shadow-lg rounded-lg">
              <p className="text-sm text-gray-600 mt-2">Application submitted successfully! Redirecting to Dashboard</p>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoanForm;