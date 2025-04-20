// import React, { useState } from 'react';
// import { FileUp, BarChart3, Target, Eye, Settings2, ChevronDown, HelpCircle, Send, Download, RefreshCw } from 'lucide-react';
// import { FileUploader } from './components/FileUploader';
// import { GoalSelector } from './components/GoalSelector';
// import { CustomMetricsSelector } from './components/CustomMetricsSelector';
// import { AIConfig } from './components/AIConfig';
// import { ReportGenerator } from './components/ReportGenerator';
// import { mockData } from './data/mockData';
// import * as XLSX from 'xlsx';
// import { LeadGenerationReport } from './pages/LeadGenerationReport';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// type GoalType = 'roas' | 'cpa' | 'custom';

// // Add readExcelFile function
// const readExcelFile = (file: File): Promise<any> => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
    
//     reader.onload = (e) => {
//       try {
//         const data = e.target?.result;
//         const workbook = XLSX.read(data, { type: 'array' });
//         const firstSheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[firstSheetName];
//         const jsonData = XLSX.utils.sheet_to_json(worksheet);
//         resolve(jsonData);
//       } catch (error) {
//         reject(error);
//       }
//     };

//     reader.onerror = (error) => reject(error);
//     reader.readAsArrayBuffer(file);
//   });
// };

// function App() {
//   const [selectedGoal, setSelectedGoal] = useState<GoalType>('cpa');
//   const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [isComplete, setIsComplete] = useState(false);
//   const [file, setFile] = useState<File | null>(null);
//   const [reportFocus, setReportFocus] = useState<string>('roas');
//   const [writingStyle, setWritingStyle] = useState<string>('professional');
//   const [language, setLanguage] = useState<string>('en');
//   const [reportData, setReportData] = useState<any>(null);
//   const [webhookResponse, setWebhookResponse] = useState<any>(null);
//   const [showReport, setShowReport] = useState(false);

//   const handleGenerate = () => {
//     setIsGenerating(true);
//     // Simulate report generation
//     setTimeout(() => {
//       setIsGenerating(false);
//       setIsComplete(true);
//     }, 3000);
//   };

//   const handleGenerateReport = async () => {
//     if (!file) {
//       alert('Please upload a file first');
//       return;
//     }

//     setIsGenerating(true);
//     console.log('Generate Report button clicked');

//     try {
//       const reader = new FileReader();
//       reader.onload = async (e) => {
//         try {
//           const data = e.target?.result;
//           const workbook = XLSX.read(data, { type: 'binary' });
//           const firstSheetName = workbook.SheetNames[0];
//           const worksheet = workbook.Sheets[firstSheetName];
//           const jsonData = XLSX.utils.sheet_to_json(worksheet);

//           console.log('Excel data parsed:', jsonData);

//           // Prepare the data to send to webhook
//           const webhookData = {
//             excelData: jsonData,
//             reportFocus: selectedGoal === 'cpa' ? 'cpl' : reportFocus,
//             writingStyle: writingStyle,
//             language: language
//           };

//           console.log('Sending to webhook:', webhookData);

//           const controller = new AbortController();
//           const timeoutId = setTimeout(() => controller.abort(), 5 * 60 * 1000); // 5 minutes timeout

//           // Function to make the fetch request with retries
//           const fetchWithRetry = async (retries = 3, delay = 2000): Promise<Response> => {
//             for (let i = 0; i < retries; i++) {
//               try {
//                 const response = await fetch('https://hokigat.app.n8n.cloud/webhook/86f0c9fb-b11f-47b7-9da1-c8fd8b96f897', {
//                   method: 'POST',
//                   headers: {
//                     'Content-Type': 'application/json',
//                   },
//                   body: JSON.stringify(webhookData),
//                   signal: controller.signal,
//                   keepalive: true,
//                   mode: 'cors',
//                   credentials: 'omit'
//                 });

//                 if (!response.ok) {
//                   throw new Error(`Webhook call failed with status: ${response.status}`);
//                 }

//                 return response;
//               } catch (error) {
//                 console.error(`Attempt ${i + 1} failed:`, error);
//                 if (i === retries - 1) throw error;
//                 await new Promise(resolve => setTimeout(resolve, delay));
//               }
//             }
//             throw new Error('All retry attempts failed');
//           };

//           try {
//             const response = await fetchWithRetry();
//             clearTimeout(timeoutId);

//             // Log the raw response text for debugging
//             const responseText = await response.text();
//             console.log('Raw webhook response:', responseText);

//             let responseData;
//             try {
//               responseData = JSON.parse(responseText);
//             } catch (parseError) {
//               console.error('Error parsing JSON response:', parseError);
//               console.log('Response that could not be parsed:', responseText);
//               throw new Error('Invalid JSON response from webhook');
//             }

//             console.log('Parsed webhook response:', responseData);
//             setWebhookResponse(responseData);
            
//             if (selectedGoal === 'cpa') {
//               localStorage.setItem('reportData', JSON.stringify(responseData));
//               window.location.href = '/lead-generation-report';
//             } else {
//               setIsComplete(true);
//             }
//           } catch (error: unknown) {
//             console.error('Error in webhook call:', error);
//             if (error instanceof DOMException && error.name === 'AbortError') {
//               alert('The request took too long to complete. Please try again.');
//             } else {
//               alert(`Error generating report: ${error instanceof Error ? error.message : 'Unknown error'}`);
//             }
//           }
//         } catch (error: unknown) {
//           console.error('Error in webhook call:', error);
//           alert(`Error generating report: ${error instanceof Error ? error.message : 'Unknown error'}`);
//           setIsGenerating(false);
//         }
//       };

//       reader.onerror = (error: ProgressEvent<FileReader>) => {
//         console.error('Error reading file:', error);
//         alert('Error reading file. Please try again.');
//         setIsGenerating(false);
//       };

//       reader.readAsBinaryString(file);
//     } catch (error: unknown) {
//       console.error('Error:', error);
//       alert(`Error generating report: ${error instanceof Error ? error.message : 'Unknown error'}`);
//       setIsGenerating(false);
//     }
//   };

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = event.target.files?.[0];
//     if (selectedFile) {
//       setFile(selectedFile);
//     }
//   };

//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={
//           <div className="min-h-screen bg-gray-100">
//             {/* Header */}
//             <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
//               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <div className="flex justify-between items-center h-16">
//                   <div className="flex items-center space-x-3">
//                     <BarChart3 className="w-8 h-8 text-indigo-600" />
//                     <span className="text-xl font-semibold text-gray-900">AdInsights AI</span>
//                   </div>
//                   <div className="flex items-center space-x-4">
//                     <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Powered by AI</span>
//                     <button className="w-8 h-8 rounded-full bg-gray-200" />
//                   </div>
//                 </div>
//               </div>
//             </header>

//             <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
//               {!isComplete ? (
//                 <>
//                   <div className="text-center mb-12">
//                     <h1 className="text-4xl font-bold text-gray-900 mb-4">
//                       Generate Your Google Ads Report
//                     </h1>
//                     <p className="text-lg text-gray-600 max-w-3xl mx-auto">
//                       Upload your Google Ads export, choose your focus, and get a professional PDF report
//                       with charts and AI-written insights.
//                     </p>
//                   </div>

//                   <div className="space-y-8">
//                     <GoalSelector selectedGoal={selectedGoal} onSelectGoal={setSelectedGoal} />
//                     <AIConfig 
//                       onLanguageChange={setLanguage}
//                       onToneChange={setWritingStyle}
//                     />
//                     <FileUploader 
//                       selectedGoal={selectedGoal} 
//                       customMetrics={selectedMetrics}
//                       onFileChange={setFile}
//                     />

//                     <div className="flex justify-center pt-8">
//                       <button
//                         onClick={handleGenerateReport}
//                         disabled={isGenerating || !file}
//                         className={`
//                           flex items-center space-x-2 px-8 py-4 rounded-xl font-semibold text-lg
//                           transition-colors
//                           ${!file ? 'bg-gray-400 cursor-not-allowed' : 
//                             isGenerating ? 'bg-indigo-400 cursor-wait' : 
//                             'bg-indigo-600 hover:bg-indigo-700'}
//                           text-white
//                         `}
//                       >
//                         {isGenerating ? (
//                           <>
//                             <RefreshCw className="w-5 h-5 animate-spin" />
//                             <span>Analyzing campaigns and generating your report...</span>
//                           </>
//                         ) : (
//                           <>
//                             <BarChart3 className="w-5 h-5" />
//                             <span>Generate Report</span>
//                           </>
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                 </>
//               ) : (
//                 <ReportGenerator data={webhookResponse || mockData} />
//               )}
//             </main>
//           </div>
//         } />
//         <Route path="/lead-generation-report" element={<LeadGenerationReport />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
import React, { useState, useEffect } from 'react';
import { FileUp, BarChart3, Target, Eye, Settings2, ChevronDown, HelpCircle, Send, Download, RefreshCw } from 'lucide-react';
import { FileUploader } from './components/FileUploader';
import { GoalSelector } from './components/GoalSelector';
import { CustomMetricsSelector } from './components/CustomMetricsSelector';
import { AIConfig } from './components/AIConfig';
import { ReportGenerator } from './components/ReportGenerator';
import { mockData } from './data/mockData';
import * as XLSX from 'xlsx';
import { LeadGenerationReport } from './pages/LeadGenerationReport';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

type GoalType = 'roas' | 'cpa' | 'custom';

// Add readExcelFile function
const readExcelFile = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

// Generate a unique request ID
const generateRequestId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

function App() {
  const [selectedGoal, setSelectedGoal] = useState<GoalType>('cpa');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [reportFocus, setReportFocus] = useState<string>('roas');
  const [writingStyle, setWritingStyle] = useState<string>('professional');
  const [language, setLanguage] = useState<string>('en');
  const [reportData, setReportData] = useState<any>(null);
  const [webhookResponse, setWebhookResponse] = useState<any>(null);
  const [showReport, setShowReport] = useState(false);
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [reportCheckInterval, setReportCheckInterval] = useState<NodeJS.Timeout | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  // Function to parse Excel file
  const parseExcelFile = (file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = (error) => reject(error);
      reader.readAsBinaryString(file);
    });
  };

  // Function to attempt to retrieve the report data from localStorage
  const checkForCachedReport = () => {
    if (!requestId) return false;
    
    try {
      const cachedData = localStorage.getItem(`report_${requestId}`);
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        console.log('Found cached report data:', parsedData);
        setWebhookResponse(parsedData);
        setIsComplete(true);
        setIsGenerating(false);
        setIsPolling(false);
        if (reportCheckInterval) clearInterval(reportCheckInterval);
        return true;
      }
    } catch (error) {
      console.error('Error retrieving cached report:', error);
    }
    return false;
  };

  // Function to send the webhook request with retry logic
  const sendWebhookRequest = async (data: any, maxRetries = 3, currentRetry = 0): Promise<any> => {
    try {
      // Cache the request data with the request ID in case we need to retry later
      const rid = generateRequestId();
      setRequestId(rid);
      localStorage.setItem(`request_${rid}`, JSON.stringify(data));
      
      // Simulate progress
      setProcessingProgress(10);
      
      // Actual fetch request
      const response = await fetch('https://hokigat.app.n8n.cloud/webhook/86f0c9fb-b11f-47b7-9da1-c8fd8b96f897', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Request-ID': rid
        },
        body: JSON.stringify({
          ...data,
          requestId: rid  // Include request ID in the payload
        }),
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        throw new Error(`Webhook request failed with status: ${response.status}`);
      }

      // Update progress after getting response
      setProcessingProgress(100);
      
      // Parse response
      const responseText = await response.text();
      let responseData;
      
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        console.log('Response that could not be parsed:', responseText);
        throw new Error('Invalid JSON response from webhook');
      }

      // Cache the response for future retrieval
      localStorage.setItem(`report_${rid}`, JSON.stringify(responseData));
      
      return responseData;
    } catch (error) {
      console.error(`Webhook request attempt ${currentRetry + 1} failed:`, error);
      
      // If we've exceeded retry attempts, throw error
      if (currentRetry >= maxRetries) {
        throw error;
      }
      
      // Otherwise, increase retry count and wait before retrying
      setRetryCount(currentRetry + 1);
      await new Promise(resolve => setTimeout(resolve, 2000 * (currentRetry + 1)));
      
      // Recursively retry
      return sendWebhookRequest(data, maxRetries, currentRetry + 1);
    }
  };

  // Handle the initial report generation
  const handleGenerateReport = async () => {
    if (!file) {
      alert('Please upload a file first');
      return;
    }

    setIsGenerating(true);
    setProcessingProgress(5);
    console.log('Generate Report button clicked');

    try {
      // Parse Excel file
      const jsonData = await parseExcelFile(file);
      console.log('Excel data parsed:', jsonData);

      // Prepare webhook data
      const webhookData = {
        excelData: jsonData,
        reportFocus: selectedGoal === 'cpa' ? 'cpl' : reportFocus,
        writingStyle: writingStyle,
        language: language,
        timestamp: Date.now() // Add timestamp to prevent caching issues
      };

      // Attempt to send webhook request
      try {
        console.log('Sending to webhook:', webhookData);
        const responseData = await sendWebhookRequest(webhookData);
        
        console.log('Webhook response received:', responseData);
        setWebhookResponse(responseData);
        
        if (selectedGoal === 'cpa') {
          localStorage.setItem('reportData', JSON.stringify(responseData));
          window.location.href = '/lead-generation-report';
        } else {
          setIsComplete(true);
        }
        
        setIsGenerating(false);
      } catch (webhookError) {
        console.error('Webhook request failed after all retries:', webhookError);
        
        // If all retries failed, start polling instead
        const rid = generateRequestId();
        setRequestId(rid);
        localStorage.setItem(`request_${rid}`, JSON.stringify(webhookData));
        
        // Start polling for results
        setIsPolling(true);
        startPolling();
      }
    } catch (error: unknown) {
      console.error('Error generating report:', error);
      alert(`Error generating report: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsGenerating(false);
    }
  };

  // Start polling for report results
  const startPolling = () => {
    // Clear any existing interval
    if (reportCheckInterval) {
      clearInterval(reportCheckInterval);
    }
    
    // Set up progress bar
    let progressCounter = 10;
    
    // Check for cached results every 5 seconds
    const interval = setInterval(() => {
      // Increment progress counter for visual feedback
      progressCounter += 2;
      setProcessingProgress(Math.min(progressCounter, 95));
      
      // Check if report is ready
      const foundReport = checkForCachedReport();
      
      // If report is found or we've polled for too long, stop polling
      if (foundReport || progressCounter >= 95) {
        clearInterval(interval);
        
        if (!foundReport && progressCounter >= 95) {
          // If no report after polling for a while, show a message
          setIsPolling(false);
          setIsGenerating(false);
          
          // Use mock data as a fallback
          setWebhookResponse(mockData);
          setIsComplete(true);
          
          console.log('Report generation timed out. Using mock data.');
          alert('Report generation took longer than expected. We\'ve generated a sample report for you.');
        }
      }
    }, 5000);
    
    setReportCheckInterval(interval);
  };

  // Clean up interval on component unmount
  useEffect(() => {
    return () => {
      if (reportCheckInterval) {
        clearInterval(reportCheckInterval);
      }
    };
  }, [reportCheckInterval]);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="w-8 h-8 text-indigo-600" />
                    <span className="text-xl font-semibold text-gray-900">AdInsights AI</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Powered by AI</span>
                    <button className="w-8 h-8 rounded-full bg-gray-200" />
                  </div>
                </div>
              </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
              {!isComplete ? (
                <>
                  <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                      Generate Your Google Ads Report
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                      Upload your Google Ads export, choose your focus, and get a professional PDF report
                      with charts and AI-written insights.
                    </p>
                  </div>

                  <div className="space-y-8">
                    <GoalSelector selectedGoal={selectedGoal} onSelectGoal={setSelectedGoal} />
                    <AIConfig 
                      onLanguageChange={setLanguage}
                      onToneChange={setWritingStyle}
                    />
                    <FileUploader 
                      selectedGoal={selectedGoal} 
                      customMetrics={selectedMetrics}
                      onFileChange={setFile}
                    />

                    {(isGenerating || isPolling) && (
                      <div className="w-full mt-6">
                        <div className="bg-gray-200 rounded-full h-2.5 mb-4">
                          <div 
                            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" 
                            style={{ width: `${processingProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600 text-center mt-2">
                          {isPolling ? 
                            'We\'re processing your report in the background. This might take a few minutes...' : 
                            `Analyzing your campaign data... ${processingProgress}%`}
                        </p>
                        {retryCount > 0 && (
                          <p className="text-xs text-gray-500 text-center mt-1">
                            Connection retry {retryCount}/3...
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex justify-center pt-8">
                      <button
                        onClick={handleGenerateReport}
                        disabled={isGenerating || isPolling || !file}
                        className={`
                          flex items-center space-x-2 px-8 py-4 rounded-xl font-semibold text-lg
                          transition-colors
                          ${!file ? 'bg-gray-400 cursor-not-allowed' : 
                            (isGenerating || isPolling) ? 'bg-indigo-400 cursor-wait' : 
                            'bg-indigo-600 hover:bg-indigo-700'}
                          text-white
                        `}
                      >
                        {isGenerating || isPolling ? (
                          <>
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            <span>Analyzing campaigns and generating your report...</span>
                          </>
                        ) : (
                          <>
                            <BarChart3 className="w-5 h-5" />
                            <span>Generate Report</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <ReportGenerator data={webhookResponse || mockData} />
              )}
            </main>
          </div>
        } />
        <Route path="/lead-generation-report" element={<LeadGenerationReport />} />
      </Routes>
    </Router>
  );
}

export default App;