import React, { useState, useEffect } from 'react';

interface AIConfigProps {
  onLanguageChange?: (language: string) => void;
  onToneChange?: (tone: string) => void;
}

export function AIConfig({ onLanguageChange, onToneChange }: AIConfigProps) {
  const [language, setLanguage] = useState('en');
  const [tone, setTone] = useState('professional');

  useEffect(() => {
    if (onLanguageChange) {
      onLanguageChange(language);
    }
  }, [language, onLanguageChange]);

  useEffect(() => {
    if (onToneChange) {
      onToneChange(tone);
    }
  }, [tone, onToneChange]);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  const handleToneChange = (newTone: string) => {
    setTone(newTone);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Writing Style</h3>
        <div className="space-x-2">
          <button
            onClick={() => handleToneChange('casual')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tone === 'casual'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Casual
          </button>
          <button
            onClick={() => handleToneChange('professional')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tone === 'professional'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Professional
          </button>
          <button
            onClick={() => handleToneChange('technical')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tone === 'technical'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Technical
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Language</h3>
        <div className="inline-flex items-center rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => handleLanguageChange('en')}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
              language === 'en'
                ? 'bg-white text-indigo-600 shadow'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => handleLanguageChange('fr')}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
              language === 'fr'
                ? 'bg-white text-indigo-600 shadow'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            FR
          </button>
        </div>
      </div>
    </div>
  );
}