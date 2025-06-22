// src/App.jsx
import { useState, useEffect, useRef } from 'react';
import loanFlow from '../data/dynamic-chatbot-config.json';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

// Main Chatbot Component
function LoanForm({isVisible,onClose, existingDocuments = []}) {
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState({});
  const [currentStepId, setCurrentStepId] = useState('start');
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);
  const [fileInputMode, setFileInputMode] = useState('initial'); // 'initial' | 'select'

  const currentStep = loanFlow.find(step => step.id === currentStepId);

  // Scroll to the bottom of the chat on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle bot's turn
  useEffect(() => {
    if (currentStep && currentStep.id !== 'end') {
      setIsTyping(true);
      setTimeout(() => {
        let question = currentStep.questionText;
        // Replace placeholders like {firstName} with actual data
        Object.keys(userData).forEach(key => {
          question = question.replace(`{${key}}`, userData[key]);
        });
        
        addMessage('bot', question);
        setIsTyping(false);
        
        // If it's a final message with no input, move to the next step automatically
        if (currentStep.inputType === 'final') {
          handleNextStep(null, currentStep.nextStep);
        }
      }, 1000);
    }
  }, [currentStepId]);

  const addMessage = (sender, content) => {
    setMessages(prev => [...prev, { sender, content }]);
  };

  const handleNextStep = (value, nextStepId) => {
    const stepKey = currentStep.key;
    if (stepKey) {
      setUserData(prev => ({ ...prev, [stepKey]: value }));
    }
    
    // NEW: Reset file input mode for the next step
    setFileInputMode('initial'); 
    
    setCurrentStepId(nextStepId || currentStep.nextStep);
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
    if (!inputValue || !currentStep) return;
    
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validationError = validateInput(file, currentStep.validation);
    if (validationError) {
        setError(validationError);
        return;
    }

    let filePreview = file.name;
    // For images, create a preview URL
    if (currentStep.inputType === 'image' && file.type.startsWith('image/')) {
        filePreview = <img src={URL.createObjectURL(file)} alt="preview" className="w-40 h-auto rounded-md" />;
    }

    addMessage('user', filePreview);
    handleNextStep(file, currentStep.nextStep);
  };
  const handleExistingDocSelect = (doc) => {
    addMessage('user', `Selected: ${doc.name}`);
    // Pass the document object itself. The backend can use its ID or URL.
    handleNextStep(doc, currentStep.nextStep);
  };

  const renderInput = () => {
    if (!currentStep || currentStep.inputType === null || currentStep.inputType === 'final' || currentStep.id === 'end') {
      return null;
    }

    switch (currentStep.inputType) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <form onSubmit={handleUserSubmit} className="flex space-x-2">
            <input
              type={currentStep.inputType}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Type your answer..."
              required={currentStep.validation?.required}
            />
            <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700">
              Send
            </button>
          </form>
        );
      case 'options':
        return (
          <div className="flex flex-wrap gap-2">
            {currentStep.options.map((opt, index) => (
              <button key={index} onClick={() => handleOptionClick(opt)} className="bg-white border border-indigo-500 text-indigo-500 font-semibold py-2 px-4 rounded-lg hover:bg-indigo-500 hover:text-white transition-colors">
                {opt.label}
              </button>
            ))}
          </div>
        );
        case 'file':
        case 'image':
            // --- THIS ENTIRE BLOCK IS UPDATED ---
            
            // Filter documents based on the `documentType` in the config
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
    
            // Default view: Show initial choices
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
                  <button onClick={() => fileInputRef.current.click()} className="flex-1 bg-white border border-indigo-500 text-indigo-500 font-semibold py-2 px-4 rounded-lg hover:bg-indigo-500 hover:text-white transition-colors">
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
    
      useEffect(() => {
        if (currentStepId === "end") {
          const timer = setTimeout(() => navigate("/dashboard"), 5000);
          return () => clearTimeout(timer);
        }
      }, [currentStepId, navigate]);
    
      if (!isVisible) return null;
    

  return (
    <div className="fixed text-black inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="relative w-full max-w-2xl h-[90vh] bg-white shadow-2xl rounded-lg flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Loan Application Bot</h1>
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
      </div>
      {/* /* Summary shown after completion  */}
      {currentStepId === "end" && (
        <div className="absolute bottom-4 w-full max-w-2xl px-4">
          <div className="p-4 bg-white shadow-lg rounded-lg">
            <p className="text-sm text-gray-600 mt-2">Redirecting to dashboard in 5 seconds...</p>
          </div>
        </div>
      )} 
    </div>
  )
}

export default LoanForm;