import React from 'react';

interface FAQCardProps {
  question: string;
  answer: string;
}

const FAQCard: React.FC<FAQCardProps> = ({ question, answer }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="font-semibold mb-2">{question}</div>
    <div className="text-gray-600 text-sm">{answer}</div>
  </div>
);

export default FAQCard;
