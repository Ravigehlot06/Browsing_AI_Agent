import React, { useState, useEffect } from 'react';
import { Search, Bot, FileText, Sparkles, ArrowRight, Loader2, Globe, Database, AlertTriangle, Sun, Moon, History as HistoryIcon, Home, Menu, X } from 'lucide-react';
import axios from 'axios';
import './App.css';

function App() {
  const [theme, setTheme] = useState('dark');
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'history'
  const [history, setHistory] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [task, setTask] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 0: idle, 1: searching, 2: opening, 3: extracting, 4: summary, 5: done, 6: error
  const [currentStep, setCurrentStep] = useState(0); 
  
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Apply theme class to body
  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
  }, [theme]);

  // Simulate progress through steps while waiting for the actual backend
  useEffect(() => {
    let timer;
    if (isSubmitting && currentStep >= 1 && currentStep < 4) {
      timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [isSubmitting, currentStep]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.trim()) return;
    
    setIsSubmitting(true);
    setCurrentStep(1); 
    setErrorMessage('');
    setResults([]);
    setSummary('');

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/internship-agent', {
        branch: "General",
        domains: [task],
        locations: ["Remote"],
        work_mode: "Any",
        minimum_stipend: "Any",
        duration: "Flexible",
        priorities: []
      });

      if (response.data.success) {
        const newResults = response.data.data.top_recommendations || [];
        const newSummary = response.data.data.ai_summary || '';
        setResults(newResults);
        setSummary(newSummary);
        setCurrentStep(5); 

        // Add to history
        setHistory(prev => [{
          id: Date.now(),
          task,
          results: newResults,
          summary: newSummary,
          date: new Date().toLocaleTimeString()
        }, ...prev]);
        
      } else {
        setErrorMessage("Server not responding");
        setCurrentStep(6);
      }
    } catch (error) {
      console.error("Backend connection error:", error);
      setErrorMessage("Server not responding");
      setCurrentStep(6);
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setTask('');
    setCurrentStep(0);
    setResults([]);
    setSummary('');
    setErrorMessage('');
    setActiveTab('home');
  }

  const loadHistoryItem = (item) => {
    setTask(item.task);
    setResults(item.results);
    setSummary(item.summary);
    setCurrentStep(5);
    setActiveTab('home');
    setIsSidebarOpen(false);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`app-container ${theme}`}>
      <div className="background-glow"></div>

      {/* Navbar Structure */}
      <nav className="navbar">
        <div className="nav-left">
          <Bot className="nav-logo" size={28} />
          <span className="nav-title">Agentic AI</span>
        </div>
        
        <div className="nav-center desktop-only">
          <button className={`nav-link ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
            <Home size={18} /> Home
          </button>
          <button className={`nav-link ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
            <HistoryIcon size={18} /> History
          </button>
        </div>

        <div className="nav-right">
          <button className="icon-btn theme-toggle" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="icon-btn mobile-menu-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="mobile-sidebar">
          <button className={`nav-link ${activeTab === 'home' ? 'active' : ''}`} onClick={() => { setActiveTab('home'); setIsSidebarOpen(false); }}>
            <Home size={20} /> Home
          </button>
          <button className={`nav-link ${activeTab === 'history' ? 'active' : ''}`} onClick={() => { setActiveTab('history'); setIsSidebarOpen(false); }}>
            <HistoryIcon size={20} /> History
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="main-content">
        
        {activeTab === 'history' ? (
          <div className="history-panel fade-in">
            <h2>Task History</h2>
            <p className="subtitle">View your previously completed research tasks.</p>
            {history.length === 0 ? (
              <div className="empty-state">No history found. Try running a task!</div>
            ) : (
              <div className="history-list">
                {history.map(item => (
                  <div key={item.id} className="history-card" onClick={() => loadHistoryItem(item)}>
                    <div className="history-card-header">
                      <span className="history-task">"{item.task}"</span>
                      <span className="history-time">{item.date}</span>
                    </div>
                    <p className="history-snippet">{item.summary.substring(0, 100)}...</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="home-panel fade-in">
            <div className="header-section">
              <h1>AI <span>Assistant</span></h1>
              <p>Enter a complex task and let the agent work its magic.</p>
            </div>

            {currentStep === 0 && (
              <form className="task-form" onSubmit={handleSubmit}>
                <div className="input-group">
                  <Sparkles className="input-icon" size={20} />
                  <input
                    type="text"
                    placeholder="Enter your task..."
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    autoFocus
                  />
                  <button type="submit" className="submit-btn" disabled={!task.trim() || isSubmitting}>
                    {isSubmitting ? (
                      <><Loader2 className="spinning-icon" size={18} /> Processing...</>
                    ) : (
                      <>Submit <ArrowRight size={18} /></>
                    )}
                  </button>
                </div>
              </form>
            )}

            {currentStep > 0 && (
              <div className="agent-workflow">
                <div className="task-header">
                  <h3>Task execution:</h3>
                  <p className="task-query">"{task}"</p>
                </div>

                {currentStep === 6 && (
                  <div className="error-box fade-in">
                    <AlertTriangle size={24} className="error-icon" />
                    <p>{errorMessage}</p>
                  </div>
                )}

                {currentStep !== 6 && (
                  <div className="steps-timeline">
                    {/* Step 1 */}
                    <div className={`timeline-step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
                      <div className="step-icon-wrapper">
                        {currentStep === 1 ? <Loader2 className="spinning-icon" size={20} /> : <Search size={20} />}
                      </div>
                      <div className="step-content">
                        <h4>Searching websites</h4>
                        {currentStep === 1 && <p className="pulsing-text">Querying search engines...</p>}
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className={`timeline-step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
                      <div className="step-icon-wrapper">
                        {currentStep === 2 ? <Loader2 className="spinning-icon" size={20} /> : <Globe size={20} />}
                      </div>
                      <div className="step-content">
                        <h4>Opening pages</h4>
                        {currentStep === 2 && <p className="pulsing-text">Navigating to top results...</p>}
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className={`timeline-step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
                      <div className="step-icon-wrapper">
                        {currentStep === 3 ? <Loader2 className="spinning-icon" size={20} /> : <Database size={20} />}
                      </div>
                      <div className="step-content">
                        <h4>Extracting data</h4>
                        {currentStep === 3 && <p className="pulsing-text">Parsing page contents...</p>}
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className={`timeline-step ${currentStep >= 4 ? 'active' : ''} ${currentStep >= 5 ? 'completed' : ''}`}>
                      <div className="step-icon-wrapper">
                        {currentStep === 4 ? <Loader2 className="spinning-icon" size={20} /> : <FileText size={20} />}
                      </div>
                      <div className="step-content">
                        <h4>Generating summary</h4>
                        {currentStep === 4 && <p className="pulsing-text">Asking AI for final thoughts...</p>}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 5 && results.length > 0 && (
                  <div className="results-section fade-in">
                    <h3 className="section-title">Results</h3>
                    <div className="results-grid">
                      {results.map((res, i) => {
                        const title = res.title || (typeof res === 'string' ? res : "Result " + (i+1));
                        const company = res.company || "Unknown Company";
                        const itemSummary = res.source ? `Data extracted from ${res.source}` : "Key information extracted.";
                        
                        return (
                          <div key={i} className="result-card">
                            <div className="card-header">
                              <h4 className="card-title">{title}</h4>
                              <span className="company-badge">{company}</span>
                            </div>
                            <p className="card-summary">{itemSummary}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {currentStep === 5 && summary && (
                  <div className="final-summary-section fade-in">
                    <h3 className="section-title">Final Summary</h3>
                    <div className="summary-card">
                      <p className="clean-paragraph">
                        {summary.split('**').map((chunk, index) => 
                          index % 2 === 1 ? <strong key={index} className="highlighted-text">{chunk}</strong> : chunk
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {(currentStep === 5 || currentStep === 6) && (
                  <button className="reset-btn fade-in" onClick={reset}>
                    New Task
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
