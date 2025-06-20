import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const DynamicFormFlow = ({ application }) => {
  const [currentNode, setCurrentNode] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (application?.formFields?.nodes) {
      const startNode = application.formFields.nodes.find(node => node.data.isStartNode);
      setCurrentNode(startNode);
      setLoading(false);
    }
  }, [application]);

  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const findNextNode = async () => {
    const edges = application.formFields.edges;
    const matchingEdge = edges.find(edge => {
      if (edge.source === currentNode.id) {
        const condition = edge.condition;
        const fieldValue = formData[condition.field];
        switch (condition.operator) {
          case '==': return fieldValue === condition.value;
          case '!=': return fieldValue !== condition.value;
          case '>': return fieldValue > condition.value;
          case '<': return fieldValue < condition.value;
          case '>=': return fieldValue >= condition.value;
          case '<=': return fieldValue <= condition.value;
          default: return false;
        }
      }
      return false;
    });

    if (matchingEdge) {
      const nextNode = application.formFields.nodes.find(
        node => node.id === matchingEdge.target
      );
      setCurrentNode(nextNode);
    } else {
      // No matching condition, form is complete
      try {
        await axios.post('/api/application/submit', {
          applicationId: application._id,
          formData
        });
        toast.success('Form submitted successfully');
      } catch (error) {
        toast.error('Error submitting form');
      }
    }
  };

  if (loading) {
    return <div>Loading form...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{currentNode?.data?.label}</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        findNextNode();
      }}>
        {currentNode?.data?.fields?.map((field, index) => (
          <div key={index} className="mb-4">
            <label className="block mb-2">{field.label}</label>
            {field.type === 'TEXT' && (
              <input
                type="text"
                value={formData[field.name] || ''}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                required={field.required}
                className="w-full p-2 border rounded"
              />
            )}
            {/* Add other field types here */}
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default DynamicFormFlow;