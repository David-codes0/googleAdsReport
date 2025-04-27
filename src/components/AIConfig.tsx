import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';

interface AIConfigProps {
  onLanguageChange?: (language: string) => void;
  onToneChange?: (tone: string) => void;
  onLogoChange?: (logoUrl: string | null) => void;
}

export function AIConfig({ onLanguageChange, onToneChange, onLogoChange }: AIConfigProps) {
  const [language, setLanguage] = useState('en');
  const [tone, setTone] = useState('professional');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

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

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (3MB = 3 * 1024 * 1024 bytes)
      if (file.size > 3 * 1024 * 1024) {
        alert('Logo file size must be less than 3MB');
        return;
      }

      // Check file type
      if (!file.type.match('image/(jpeg|png)')) {
        alert('Logo must be in JPG or PNG format');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoUrl(result);
        if (onLogoChange) {
          onLogoChange(result);
        }
      };
      reader.readAsDataURL(file);
    }
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
        <div className="flex items-start space-x-8">
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

          {/* Logo Upload Section */}
          <div className="mt-[-3.3rem]">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Company Logo</h3>
            <div className="flex items-center">
              {logoUrl ? (
                <div className="flex items-center space-x-2">
                  <img 
                    src={logoUrl} 
                    alt="Company Logo" 
                    className="h-8 w-8 object-contain"
                  />
                  <button
                    onClick={() => {
                      setLogoUrl(null);
                      if (onLogoChange) {
                        onLogoChange(null);
                      }
                    }}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex flex-col">
                  <label 
                    htmlFor="logo-upload" 
                    className="inline-flex items-center px-3 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    <span className="text-sm">Add Logo</span>
                  </label>
                  <span className="text-xs text-gray-500 mt-1">JPG or PNG, max 3MB</span>
                </div>
              )}
              <input
                id="logo-upload"
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}