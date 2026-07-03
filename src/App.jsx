import React, { useState, useRef, useEffect } from 'react';
import { Camera, MessageCircle, Upload, X, Send, Leaf, FlaskConical, AlertCircle, CheckCircle, Sparkles, TrendingUp, Activity, Info, ChevronRight, Droplet, Sun, Wind } from 'lucide-react';

export default function PlantDiseaseApp() {
  const [activeTab, setActiveTab] = useState('detection');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [diseaseResult, setDiseaseResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: 'Hello! I\'m your AI farming assistant. How can I help you today?', timestamp: new Date() }
  ]);
  const [userMessage, setUserMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Backend API URL - Change this to match your backend URL
  const API_URL = 'http://localhost:5000';

  const [selectedLanguage, setSelectedLanguage] = useState('en');

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file');
        return;
      }

      setError(null);
      setUploadedFile(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
        setDiseaseResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeDisease = async () => {
    if (!uploadedFile) {
      setError('Please upload an image first');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('image', uploadedFile);
      formData.append('language', selectedLanguage);
      
      // Call backend API
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Transform backend response to match your UI structure
      setDiseaseResult({
        disease: data.disease,
        confidence: parseFloat(data.confidence_score * 100).toFixed(1),
        severity: data.severity || 'Medium',
        treatment: data.treatment ? data.treatment.split('. ').filter(t => t.trim()) : ['Consult an agricultural expert'],
        prevention: data.prevention ? data.prevention.split('. ').filter(p => p.trim()) : ['Follow standard practices'],
        organicTreatment: data.organic_treatment,
        recommended_insecticide_pesticide: data.recommended_insecticide_pesticide,
      });

    } catch (err) {
      console.error('Error analyzing disease:', err);
      setError(err.message || 'Failed to analyze image. Please ensure the backend server is running.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendMessage = async () => {
    if (userMessage.trim()) {
      const newUserMessage = {
        type: 'user',
        text: userMessage,
        timestamp: new Date()
      };
      setChatMessages([...chatMessages, newUserMessage]);
      setUserMessage('');
      setIsTyping(true);
      
      // TODO: Replace with actual AI chatbot API call
      setTimeout(() => {
        const responses = [
          'Based on your query, I recommend checking soil pH levels. Most crops thrive in a pH range of 6.0-7.0. You can use a simple soil test kit available at agricultural stores.',
          'For natural pest control, neem oil is highly effective. Mix 2 tablespoons of pure neem oil per gallon of water and spray during early morning or evening hours.',
          'Yellowing leaves typically indicate nitrogen deficiency. Consider applying well-decomposed organic compost or a balanced NPK fertilizer (10-10-10) at recommended rates.',
          'The ideal watering schedule varies by crop and soil type. Generally, deep watering 2-3 times per week is better than shallow daily watering. Check soil moisture at 2-3 inches depth.',
          'For better yields, ensure your crops receive adequate sunlight (6-8 hours daily), maintain proper spacing, and practice regular weeding to reduce competition for nutrients.',
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        setIsTyping(false);
        setChatMessages(prev => [...prev, {
          type: 'bot',
          text: randomResponse,
          timestamp: new Date()
        }]);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="relative backdrop-blur-sm bg-white/10 border-b border-white/20 shadow-2xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur-lg opacity-75 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-green-400 to-emerald-600 p-3 rounded-2xl">
                  <Leaf className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black text-white tracking-tight">
                  Krishi <span className="text-green-300">Mitra</span>
                </h1>
                <p className="text-green-100 text-sm font-medium flex items-center gap-2 mt-1">
                  <Sparkles className="w-4 h-4" />
                  AI-Powered Plant Disease Detection & Support
                </p>
              </div>
            </div>
            <div className="hidden md:flex gap-6 text-white/90">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                <Activity className="w-5 h-5 text-green-300" />
                <div>
                  <p className="text-xs text-green-200">Model Accuracy</p>
                  <p className="font-bold">94.5%</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                <TrendingUp className="w-5 h-5 text-green-300" />
                <div>
                  <p className="text-xs text-green-200">Plants Analyzed</p>
                  <p className="font-bold">1.2M+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className=" bg-emerald-900 text-white px-3 py-2 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-green-400 font-medium cursor-pointer"
        >
          <option value="en">English</option>
          <option value="hi">हिंदी (Hindi)</option>
          <option value="kn">ಕನ್ನಡ (Kannada)</option>
          <option value="te">తెలుగు (Telugu)</option>
          <option value="ta">தமிழ் (Tamil)</option>
          <option value="ml">മലയാളം (Malayalam)</option>
          <option value="mr">मराठी (Marathi)</option>
          <option value="bn">বাংলা (Bengali)</option>
          <option value="gu">ગુજરાતી (Gujarati)</option>
        </select>
      </div>

      <a
  href="http://localhost:5184"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-all z-50 relative"
>
  🌾 Expert Recommendations
</a>


<a
  href="http://localhost:5194"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-all z-50 relative"
>
  🏦📝 Government Schemes and Loans
</a>



      {/* Tab Navigation */}
      <div className="container mx-auto px-4 py-8 relative">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-2 flex gap-2 max-w-lg mx-auto border border-white/20">
          <button
            onClick={() => setActiveTab('detection')}
            className={`flex-1 py-4 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group ${
              activeTab === 'detection'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/50'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Camera className="w-5 h-5" />
            <span>Disease Detection</span>
          </button>
          <button
            onClick={() => setActiveTab('chatbot')}
            className={`flex-1 py-4 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group ${
              activeTab === 'chatbot'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/50'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            <span>AI Assistant</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12 relative">
        {activeTab === 'detection' ? (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
              {/* Detection Header */}
              <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 p-8 border-b border-white/10">
                <h2 className="text-3xl font-black text-white mb-3 flex items-center gap-3">
                  <div className="bg-gradient-to-br from-green-400 to-emerald-600 p-2 rounded-xl">
                    <Camera className="w-7 h-7 text-white" />
                  </div>
                  Plant Disease Detection System
                </h2>
                <p className="text-green-100 text-lg">Upload an image of your plant for instant AI-powered diagnosis</p>
              </div>

              <div className="p-8">
                {/* Error Message */}
                {error && (
                  <div className="mb-6 bg-red-500/20 border-2 border-red-400 text-white p-4 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                    <div>
                      <p className="font-bold">Error</p>
                      <p className="text-sm text-red-200">{error}</p>
                    </div>
                    <button onClick={() => setError(null)} className="ml-auto">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {!uploadedImage ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="relative border-4 border-dashed border-white/30 rounded-2xl p-16 text-center hover:border-green-400 hover:bg-white/5 transition-all duration-300 cursor-pointer group"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity"></div>
                      <Upload className="w-24 h-24 text-white/50 group-hover:text-green-400 mx-auto mb-6 transition-colors relative" />
                    </div>
                    <p className="text-2xl font-bold text-white mb-3">
                      Drop your image here or click to browse
                    </p>
                    <p className="text-green-200 text-lg mb-4">
                      Support: JPG, PNG, WebP (Max 10MB)
                    </p>
                    <div className="flex items-center justify-center gap-6 mt-6 text-sm text-white/60">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Instant Results</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>94.5% Accuracy</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Free Analysis</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Image Preview */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur-xl opacity-50"></div>
                      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 border border-white/10">
                        <img
                          src={uploadedImage}
                          alt="Uploaded plant"
                          className="w-full max-h-[500px] object-contain rounded-xl"
                        />
                        <button
                          onClick={() => {
                            setUploadedImage(null);
                            setUploadedFile(null);
                            setDiseaseResult(null);
                            setError(null);
                          }}
                          className="absolute top-6 right-6 bg-red-500 hover:bg-red-600 text-white p-3 rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-110"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>
                    </div>

                    {!diseaseResult && !isAnalyzing && (
                      <button
                        onClick={analyzeDisease}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-5 rounded-2xl font-bold text-xl transition-all shadow-xl shadow-green-500/50 hover:shadow-2xl hover:shadow-green-500/60 hover:scale-[1.02] flex items-center justify-center gap-3 group"
                      >
                        <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                        Analyze Plant Disease
                        <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}

                    {isAnalyzing && (
                      <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
                        <div className="relative w-20 h-20 mx-auto mb-6">
                          <div className="absolute inset-0 border-4 border-green-500/30 rounded-full"></div>
                          <div className="absolute inset-0 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                          <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-green-400 animate-pulse" />
                        </div>
                        <p className="text-white font-bold text-xl mb-2">Analyzing your plant...</p>
                        <p className="text-green-200">AI is processing the image</p>
                      </div>
                    )}

                    {diseaseResult && (
                      <div className="space-y-6">
                        {/* Disease Alert */}
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border-2 border-red-400/50 p-8 backdrop-blur-sm">
                          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl"></div>
                          <div className="relative flex items-start gap-4">
                            <div className="bg-red-500 p-3 rounded-xl">
                              <AlertCircle className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-3xl font-black text-white mb-2">
                                {diseaseResult.disease}
                              </h3>
                              <div className="flex flex-wrap gap-3">
                                <span className="bg-red-900/50 text-red-100 px-4 py-2 rounded-full font-bold text-sm border border-red-400/50">
                                  Confidence: {diseaseResult.confidence}%
                                </span>
                                <span className="bg-orange-900/50 text-orange-100 px-4 py-2 rounded-full font-bold text-sm border border-orange-400/50">
                                  Severity: {diseaseResult.severity}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Treatment */}
                        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-2xl p-8 backdrop-blur-sm">
                          <h4 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                            <div className="bg-blue-500 p-2 rounded-lg">
                              <CheckCircle className="w-6 h-6 text-white" />
                            </div>
                            Treatment Recommendations
                          </h4>
                          <div className="space-y-4">
                            {diseaseResult.treatment.map((step, index) => (
                              <div key={index} className="flex items-start gap-4 bg-blue-900/20 p-4 rounded-xl border border-blue-400/20">
                                <span className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white font-black rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 text-lg shadow-lg">
                                  {index + 1}
                                </span>
                                <span className="text-white text-lg leading-relaxed pt-1">{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Prevention */}
                        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-2xl p-8 backdrop-blur-sm">
                          <h4 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                            <div className="bg-green-500 p-2 rounded-lg">
                              <Info className="w-6 h-6 text-white" />
                            </div>
                            Prevention Tips for Future
                          </h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            {diseaseResult.prevention.map((tip, index) => (
                              <div key={index} className="flex items-start gap-3 bg-green-900/20 p-4 rounded-xl border border-green-400/20">
                                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                                <span className="text-white leading-relaxed">{tip}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Organic Treatment */}
                        {diseaseResult.organicTreatment && diseaseResult.organicTreatment !== 'Not available' && (
                          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-2xl p-8 backdrop-blur-sm">
                            <h4 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
                              <Leaf className="w-6 h-6 text-purple-400" />
                              Organic Treatment Options
                            </h4>
                            <p className="text-white text-lg leading-relaxed">{diseaseResult.organicTreatment}</p>
                          </div>
                        )}

                        {/* Insecticide Pesticide recommendation */}
                        {diseaseResult.recommended_insecticide_pesticide && diseaseResult.recommended_insecticide_pesticide !== 'Not available' && (
                          <div className="bg-gradient-to-br from-pink-500/30 to-pink-500/60 border border-pink-400 rounded-2xl p-8 backdrop-blur-sm">
                            <h4 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
                              <FlaskConical className="w-6 h-6 text-pink-300" />
                              Recommended Insecticide/Pesticide
                            </h4>
                            <p className="text-white text-lg leading-relaxed">{diseaseResult.recommended_insecticide_pesticide}</p>
                          </div>
                        )}


                        <button
                          onClick={() => {
                            setUploadedImage(null);
                            setUploadedFile(null);
                            setDiseaseResult(null);
                            setError(null);
                          }}
                          className="w-full bg-white/10 hover:bg-white/20 text-white py-4 rounded-2xl font-bold text-lg transition-all border border-white/20 hover:border-white/40"
                        >
                          Analyze Another Plant
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : activeTab === 'chatbot' && (
  <div className="max-w-4xl mx-auto">
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 p-12 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-green-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
        <MessageCircle className="w-24 h-24 text-green-400 mx-auto relative" />
      </div>
      
      <h2 className="text-3xl font-black text-white mb-4">
        AI Farming Assistant
      </h2>
      
      <p className="text-green-100 text-lg mb-8">
        Get personalized farming advice, crop recommendations, and answers to all your agricultural questions.
      </p>
      
      <button
        onClick={() => window.open('http://localhost:3000', '_blank')}
        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-12 py-5 rounded-2xl font-bold text-xl transition-all shadow-xl shadow-green-500/50 hover:shadow-2xl hover:shadow-green-500/60 hover:scale-105 flex items-center justify-center gap-3 mx-auto group"
      >
        <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        Open AI Assistant
        <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
      </button>
      
      <div className="mt-8 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <p className="text-white text-sm">Voice Support</p>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <p className="text-white text-sm">24/7 Available</p>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <p className="text-white text-sm">Expert Advice</p>
        </div>
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
}