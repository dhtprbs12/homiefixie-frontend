import React, { useState, useEffect } from 'react';
import { AnalyzeResponse, Ticket } from './types';
import { FollowUpQuestions } from './components/FollowUpQuestions';
import { generateFollowUpQuestions, formatFollowUpAnswers, QuestionSet } from './followUpQuestions';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
console.log('Environment variables:', import.meta.env);
console.log('API_URL being used:', API_URL);

function App() {
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState('');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [followUpQuestions, setFollowUpQuestions] = useState<QuestionSet | null>(null);
  const [initialAnalysis, setInitialAnalysis] = useState<{description: string; file: File | null} | null>(null);
  const [generatingQuestions, setGeneratingQuestions] = useState(false);

  // Load tickets on mount
  useEffect(() => {
    fetchTickets();
  }, []);

  // Handle file preview
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl('');
    }
  }, [file]);

  const fetchTickets = async () => {
    try {
      const response = await fetch(`${API_URL}/api/tickets`);
      if (response.ok) {
        const data = await response.json();
        setTickets(data.slice(0, 20)); // Show last 20
      }
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim() && !file) {
      setError('Please provide a description or upload an image.');
      return;
    }

    // Check if we should show follow-up questions
    if (!showFollowUp && description.trim().length > 10) {
      try {
        setError(''); // Clear any previous errors
        setGeneratingQuestions(true);
        const relevantQuestions = await generateFollowUpQuestions(description);
        if (relevantQuestions && relevantQuestions.questions.length > 0) {
          setFollowUpQuestions(relevantQuestions);
          setInitialAnalysis({ description, file });
          setShowFollowUp(true);
          setGeneratingQuestions(false);
          return;
        }
      } catch (error) {
        console.warn('Failed to generate follow-up questions, proceeding with analysis:', error);
      } finally {
        setGeneratingQuestions(false);
      }
    }

    // If no follow-up questions or already completed, proceed with analysis
    await performAnalysis(description, file);
  };

  const performAnalysis = async (desc: string, uploadedFile: File | null, followUpAnswers?: Record<string, string>) => {
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      if (desc.trim()) {
        formData.append('description', desc.trim());
      }
      if (uploadedFile) {
        formData.append('image', uploadedFile);
      }

      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        fetchTickets(); // Refresh tickets
        
        // Reset form and follow-up state
        setDescription('');
        setFile(null);
        setShowFollowUp(false);
        setFollowUpQuestions(null);
        setInitialAnalysis(null);
      } else {
        setError(data.error || 'Analysis failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Analysis error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowUpSubmit = (answers: Record<string, string>) => {
    if (initialAnalysis) {
      performAnalysis(initialAnalysis.description, initialAnalysis.file, answers);
    }
  };

  const handleFollowUpSkip = () => {
    if (initialAnalysis) {
      performAnalysis(initialAnalysis.description, initialAnalysis.file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 25 * 1024 * 1024) {
        setError('File size must be less than 25MB');
        return;
      }
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const formatLikelihood = (likelihood?: Record<string, number>) => {
    if (!likelihood) return null;
    
    return Object.entries(likelihood)
      .map(([key, value]) => ({
        label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        value: Math.round(value * 100)
      }))
      .sort((a, b) => b.value - a.value);
  };

  // YouTube helper functions
  const getYouTubeVideoId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const getYouTubeThumbnail = (url: string): string | null => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-0 sm:h-16">
            <div className="flex items-center justify-center sm:justify-start mb-2 sm:mb-0">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h3v-8h6v8h3a1 1 0 001-1V7l-7-5z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">HomieFixie</h1>
                  <span className="hidden sm:block text-xs text-gray-600 font-medium">Home Improvement Assistant</span>
                </div>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <div className="text-sm font-semibold text-gray-700">
                AI-Powered Home Solutions
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Materials • Tools • Step-by-step guides
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            <div className="card">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="section-title mb-0">Describe Your Issue</h2>
                  <p className="text-sm text-gray-600">Get expert guidance in seconds</p>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="description" className="label">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                      Issue Description
                    </span>
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your home issue (e.g., 'Caulk around toilet base is cracking and peeling', 'Want to install new light fixture')"
                    className="input-field resize-none text-base"
                    rows={4}
                  />
                </div>


                <div>
                  <label htmlFor="image" className="label">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Upload Single Photo (optional)
                    </span>
                  </label>
                  <p className="text-sm text-gray-600 mb-2">Please upload only one photo for the best analysis results.</p>
                  <input
                    type="file"
                    id="image"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="input-field text-base"
                  />
                  {previewUrl && (
                    <div className="mt-4">
                      <div className="relative inline-block">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="max-w-full h-32 sm:h-40 object-cover rounded-xl border-2 border-gray-200 shadow-md"
                        />
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-1">
                          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {error}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || generatingQuestions || (!description.trim() && !file)}
                  className="btn-primary w-full text-base sm:text-lg py-4"
                >
                  {isLoading ? (
                    <span className="flex flex-col items-center justify-center">
                      <div className="flex items-center">
                        <div className="loading-spinner mr-3"></div>
                        Analyzing your issue...
                      </div>
                      <div className="text-xs opacity-75 mt-1">May take ~20 seconds</div>
                    </span>
                  ) : generatingQuestions ? (
                    <span className="flex items-center justify-center">
                      <div className="loading-spinner mr-3"></div>
                      Generating questions...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Get Solution & Instructions
                    </span>
                  )}
                </button>
              </form>

              {!description && !file && (
                <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-blue-900 mb-3">Tips for better results:</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-blue-800">
                        <div className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                          Include room context
                        </div>
                        <div className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                          Take clear photos
                        </div>
                        <div className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                          Describe symptoms
                        </div>
                        <div className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                          Mention materials
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {/* Loading indicator */}
            {isLoading && (
              <div className="card">
                <div className="flex flex-col items-center justify-center py-12 sm:py-16">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center animate-pulse">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div className="absolute -inset-2">
                      <div className="w-20 h-20 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Analyzing your home issue...</div>
                    <div className="text-sm sm:text-base text-gray-600 mb-2">Our AI is gathering materials, tools, and step-by-step instructions</div>
                    <div className="text-xs text-gray-500 mb-4">This may take about 20 seconds</div>
                    <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                      <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Question Generation Loading */}
            {generatingQuestions && (
              <div className="card">
                <div className="flex flex-col items-center justify-center py-12 sm:py-16">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center animate-pulse">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="absolute -inset-2">
                      <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Generating smart questions...</div>
                    <div className="text-sm sm:text-base text-gray-600 mb-4">Our AI is creating targeted questions to give you precise recommendations</div>
                    <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Follow-up Questions */}
            {showFollowUp && followUpQuestions && (
              <FollowUpQuestions
                questionSet={followUpQuestions}
                onAnswersSubmit={handleFollowUpSubmit}
                onSkip={handleFollowUpSkip}
              />
            )}

            {result && (
              <div className="space-y-6">
                <div className="card">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="section-title mb-0">Analysis Complete</h2>
                      <p className="text-sm text-gray-600">Here's everything you need for your project</p>
                    </div>
                  </div>
                  
                  {/* Materials */}
                  {result.materials && (
                    <div className="mb-8">
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <h3 className="subsection-title mb-0">Materials Needed</h3>
                      </div>
                      <div className="product-grid">
                        {result.materials.map((material, index) => (
                        <div key={index} className="material-item">
                          <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
                            {material.image_url && (
                              <div className="relative group w-full sm:w-20 flex-shrink-0">
                                <img
                                  src={material.image_url}
                                  alt={material.name}
                                  className="w-full sm:w-20 h-20 object-cover rounded-xl border-2 border-gray-200 cursor-pointer transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                                {/* Mobile-friendly hover overlay */}
                                <div className="hidden sm:block absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                  <div className="absolute -top-4 -left-4 w-56 h-56 bg-white rounded-xl shadow-2xl border-2 border-gray-300 z-50 overflow-hidden">
                                    <img
                                      src={material.image_url}
                                      alt={material.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.parentElement?.parentElement?.remove();
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-gray-900 text-base sm:text-lg mb-2">{material.name}</div>
                              {material.description && (
                                <div className="text-sm text-gray-700 mb-2 leading-relaxed">{material.description}</div>
                              )}
                              <div className="space-y-1">
                                {material.spec && (
                                  <div className="text-sm text-gray-600 flex items-center">
                                    <span className="font-medium mr-2">Spec:</span>
                                    <span>{material.spec}</span>
                                  </div>
                                )}
                                {material.qty && (
                                  <div className="text-sm text-gray-600 flex items-center">
                                    <span className="font-medium mr-2">Quantity:</span>
                                    <span>{material.qty}</span>
                                  </div>
                                )}
                                {material.store_price && material.store_name && (
                                  <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                    {material.store_price} at {material.store_name}
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-2 mt-3">
                                {material.product_url && (
                                  <a
                                    href={material.product_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                  >
                                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    View Product
                                  </a>
                                )}
                              </div>
                              {material.alt && material.alt.length > 0 && (
                                <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                                  <div className="text-xs font-medium text-gray-500 mb-1">Alternatives:</div>
                                  <div className="text-sm text-gray-600">{material.alt.join(', ')}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      </div>
                    </div>
                  )}

                  {/* Tools */}
                  {result.tools && (
                    <div className="mb-6">
                      <h3 className="text-md font-medium text-gray-900 mb-3">Tools Required</h3>
                      <div className="space-y-3">
                        {result.tools.map((tool, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-start space-x-3">
                            {tool.image_url && (
                              <div className="relative group">
                                <img
                                  src={tool.image_url}
                                  alt={tool.name}
                                  className="w-16 h-16 object-cover rounded-lg border border-gray-300 flex-shrink-0 cursor-pointer transition-transform duration-200 group-hover:scale-105"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                                {/* Hover zoom overlay */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                  <div className="absolute -top-2 -left-2 w-48 h-48 bg-white rounded-lg shadow-2xl border-2 border-gray-300 z-50 overflow-hidden">
                                    <img
                                      src={tool.image_url}
                                      alt={tool.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.parentElement?.parentElement?.remove();
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{tool.name}</div>
                              {tool.description && (
                                <div className="text-sm text-gray-700 mt-1">{tool.description}</div>
                              )}
                              {tool.purpose && (
                                <div className="text-sm text-gray-600 mt-1">Purpose: {tool.purpose}</div>
                              )}
                              {tool.store_price && tool.store_name && (
                                <div className="text-sm text-green-600 font-medium mt-1">
                                  {tool.store_price} at {tool.store_name}
                                </div>
                              )}
                              {tool.product_url && (
                                <a
                                  href={tool.product_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mt-1"
                                >
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                  View Product
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      </div>
                    </div>
                  )}

                  {/* Steps */}
                  {result.steps && (
                    <div className="mb-6">
                      <h3 className="text-md font-medium text-gray-900 mb-3">Step-by-Step Instructions</h3>
                      <ol className="space-y-2">
                        {result.steps.map((step, index) => (
                        <li key={index} className="flex items-start">
                          <span className="bg-primary-100 text-primary-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <span className="text-gray-700">{step}</span>
                        </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Likelihood */}
                  {result.likelihood && (
                    <div className="mb-6">
                      <h3 className="text-md font-medium text-gray-900 mb-3">Confidence Assessment</h3>
                      <div className="space-y-2">
                        {formatLikelihood(result.likelihood)?.map((item, index) => (
                          <div key={index} className="flex items-center">
                            <span className="text-sm text-gray-700 w-32">{item.label}:</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2 mx-3">
                              <div
                                className="bg-primary-500 h-2 rounded-full"
                                style={{ width: `${item.value}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900 w-12">{item.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Safety */}
                  {result.safety && result.safety.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-md font-medium text-gray-900 mb-3">Safety Notes</h3>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <ul className="space-y-1">
                          {result.safety.map((note, index) => (
                            <li key={index} className="flex items-start text-yellow-800">
                              <span className="text-yellow-600 mr-2">⚠</span>
                              <span className="text-sm">{note}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* YouTube Tutorials */}
                  {(result.youtube_videos?.length && result.youtube_videos.length > 0 || result.youtube_url) && (
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-3">
                        {result.youtube_videos && result.youtube_videos.length > 1 ? 'Video Tutorials' : 'Video Tutorial'}
                      </h3>
                      
                      {/* Multiple YouTube Videos */}
                      {result.youtube_videos && result.youtube_videos.length > 0 ? (
                        <div className="space-y-3">
                          {result.youtube_videos!.map((video) => (
                            <div key={video.url} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <div className="flex items-start space-x-4">
                                {/* YouTube Thumbnail */}
                                <div className="flex-shrink-0">
                                  {getYouTubeThumbnail(video.url) ? (
                                    <div className="relative">
                                      <img
                                        src={getYouTubeThumbnail(video.url)!}
                                        alt={`${video.title} thumbnail`}
                                        className="w-32 h-24 object-cover rounded-lg border border-gray-300"
                                        onError={(e) => {
                                          e.currentTarget.style.display = 'none';
                                        }}
                                      />
                                      {/* Play button overlay */}
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-red-600 rounded-full p-2">
                                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z"/>
                                          </svg>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="w-32 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                                      <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                      </svg>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Video Info */}
                                <div className="flex-1">
                                  <div className="mb-2">
                                    <h4 className="text-sm font-medium text-gray-900 mb-1">{video.title}</h4>
                                    {video.channel && (
                                      <p className="text-xs text-gray-600">by {video.channel}</p>
                                    )}
                                  </div>
                                  <a
                                    href={video.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                                  >
                                    <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                    </svg>
                                    Watch Tutorial
                                  </a>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : result.youtube_url && (
                        // Fallback to single video display
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              {getYouTubeThumbnail(result.youtube_url) ? (
                                <div className="relative">
                                  <img
                                    src={getYouTubeThumbnail(result.youtube_url)!}
                                    alt="Video thumbnail"
                                    className="w-32 h-24 object-cover rounded-lg border border-gray-300"
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-red-600 rounded-full p-2">
                                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z"/>
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="w-32 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                                  <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-blue-800 mb-2">Watch a video tutorial for this repair:</p>
                              <a
                                href={result.youtube_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                                Watch Tutorial
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* History */}
            {tickets.length > 0 && (
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Projects from Others</h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="text-sm text-gray-500 mb-1">
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-gray-900 font-medium mb-1">
                        {ticket.description.length > 100 
                          ? `${ticket.description.substring(0, 100)}...` 
                          : ticket.description}
                      </div>
                      {ticket.latest_analysis && (
                        <div className="text-xs text-gray-600">
                          {ticket.latest_analysis.materials.length} materials, {' '}
                          {ticket.latest_analysis.tools.length} tools, {' '}
                          {ticket.latest_analysis.steps.length} steps
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h3v-8h6v8h3a1 1 0 001-1V7l-7-5z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">HomieFixie</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Your intelligent home improvement assistant. Get expert guidance, materials lists, and step-by-step instructions for any home project.
              </p>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Product</h3>
              <ul className="space-y-3">
                <li><a href="/how-it-works" className="text-gray-600 hover:text-primary-600 transition-colors text-sm">How it Works</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Support</h3>
              <ul className="space-y-3">
                <li><a href="/contact" className="text-gray-600 hover:text-primary-600 transition-colors text-sm">Contact Us</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Legal</h3>
              <ul className="space-y-3">
                <li><a href="/privacy" className="text-gray-600 hover:text-primary-600 transition-colors text-sm">Privacy Policy</a></li>
                <li><a href="/disclaimer" className="text-gray-600 hover:text-primary-600 transition-colors text-sm">Disclaimer</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-200 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                <p className="text-gray-500 text-sm">
                  © {new Date().getFullYear()} HomieFixie. All rights reserved.
                </p>
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>AI-powered recommendations for informational purposes only</span>
                </div>
              </div>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Service Status: Operational</span>
                </div>
                <select className="text-xs text-gray-500 bg-transparent border-none focus:outline-none cursor-pointer">
                  <option>🇺🇸 English</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;