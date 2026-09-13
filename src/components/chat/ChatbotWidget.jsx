import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Bot,
  X,
  Send,
  Sparkles,
  RefreshCw,
  User,
  GraduationCap,
  ShieldCheck,
  Building2,
  ChevronDown,
  FileText,
  Briefcase,
  HelpCircle,
  Copy,
  Check,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePlacement } from '../../context/PlacementContext';
import { generateAiResponse } from '../../services/aiChatService';

export default function ChatbotWidget() {
  const { user, role } = useAuth();
  const { profile, drives, tpoStats } = usePlacement();

  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Initial welcome message tailored to the current role
  const getInitialMessages = (currentRole) => [
    {
      id: 'msg-welcome',
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text:
        currentRole === 'tpo'
          ? `Hello Officer **${user?.name?.split(' ')[0] || 'TPO'}**! 🏛️ I am your PlacementPulse AI Officer. I can analyze cohort placement statistics, generate technical interview rubrics for recruiters, or help draft new recruitment drive listings. What would you like to explore?`
          : currentRole === 'recruiter'
          ? `Welcome **${user?.name?.split(' ')[0] || 'Recruiter'}**! 🏢 I am your **PulseAI Talent Co-Pilot** for **${user?.company || 'Corporate'} Campus Hiring**. I can generate structured technical interview questions, candidate scoring rubrics, and screen applicant profiles against job criteria. How can I assist your pipeline?`
          : `Hi **${user?.name?.split(' ')[0] || 'there'}**! 👋 I am **PulseAI**, your campus placement assistant. I can **analyze your resume**, detect skill gaps, match you with top drives, or generate mock technical interview questions. How can I help you land your dream offer?`,
      suggestedPrompts:
        currentRole === 'tpo'
          ? [
              '📊 Placement analytics overview',
              '🏢 Draft job requirements for SDE drive',
              '📋 Generate candidate interview rubric',
            ]
          : currentRole === 'recruiter'
          ? [
              '📋 Generate candidate interview rubric & scoring criteria',
              '💡 Technical coding questions for React & Python',
              '🔍 SDE-1 screening benchmarks & evaluation tips',
            ]
          : [
              '📄 Analyze my resume & suggest improvements',
              '🎯 Which companies am I best suited for?',
              '💻 Generate technical interview questions for my skills',
              '✍️ Help me write a cover letter',
            ],
    },
  ];

  const [messages, setMessages] = useState(() => getInitialMessages(role));
  const messagesEndRef = useRef(null);

  // When role changes, reset chat with role-specific welcome message
  useEffect(() => {
    setMessages(getInitialMessages(role));
  }, [role]);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  // Global event listener for buttons across the app to trigger AI actions
  useEffect(() => {
    const handleOpenAi = (e) => {
      setIsOpen(true);
      if (e.detail?.prompt) {
        setTimeout(() => {
          handleSendMessage(e.detail.prompt);
        }, 150);
      }
    };
    window.addEventListener('open-pulse-ai', handleOpenAi);
    return () => window.removeEventListener('open-pulse-ai', handleOpenAi);
  }, [role, profile, drives, tpoStats]);

  const handleSendMessage = async (textToSend) => {
    const messageText = (textToSend || inputMessage).trim();
    if (!messageText || isTyping) return;

    const userMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: messageText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const botReply = await generateAiResponse({
        message: messageText,
        role: role,
        profile: profile,
        drives: drives,
        tpoStats: tpoStats,
      });

      const aiMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: botReply.text,
        suggestedPrompts: botReply.suggestedPrompts,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: 'I encountered an error processing your query. Please try again or rephrase your question.',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleResetChat = () => {
    setMessages(getInitialMessages(role));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 px-4 py-3.5 bg-gradient-to-tr from-brand-600 to-indigo-700 hover:from-brand-700 hover:to-indigo-800 text-white rounded-2xl shadow-xl shadow-brand-500/30 hover:shadow-brand-500/45 hover:scale-105 transition-all duration-200"
          aria-label="Open AI Placement Assistant"
        >
          <div className="relative">
            <Bot className="w-6 h-6 animate-bounce" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-white animate-pulse" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold leading-tight flex items-center gap-1">
              <span>PulseAI</span>
              <Sparkles className="w-3 h-3 text-amber-300" />
            </div>
            <div className="text-[10px] text-brand-200 font-medium">
              {role === 'tpo'
                ? 'TPO AI Co-Pilot'
                : role === 'recruiter'
                ? 'Recruiter Talent Co-Pilot'
                : 'Resume & Interview Coach'}
            </div>
          </div>
        </button>
      )}

      {/* Expandable Chat Drawer Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[430px] h-[600px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl bg-brand-500/30 border border-white/20 flex items-center justify-center text-white">
                <Bot className="w-5 h-5 text-brand-200" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-900" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm tracking-tight">PulseAI Assistant</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/30 border border-brand-400/40 text-brand-200 font-bold uppercase tracking-wider">
                    {role === 'tpo' ? 'TPO Mode' : role === 'recruiter' ? 'Recruiter Mode' : 'Student Mode'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  {role === 'tpo'
                    ? 'Placement Cell Analytics & Rubrics'
                    : role === 'recruiter'
                    ? 'Candidate Screening & Interview Rubrics'
                    : 'Resume Review, Skill Gaps & Mock Prep'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-300">
              <button
                onClick={handleResetChat}
                title="Reset conversation"
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Action Pills Strip */}
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-200/80 flex items-center gap-1.5 overflow-x-auto text-[11px] text-slate-600 shrink-0">
            <span className="text-slate-400 font-semibold shrink-0">Quick:</span>
            {role === 'tpo' ? (
              <>
                <button
                  onClick={() => handleSendMessage('📊 Placement analytics overview')}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-brand-400 hover:text-brand-700 font-medium shrink-0 transition-colors"
                >
                  📊 Cohort Stats
                </button>
                <button
                  onClick={() => handleSendMessage('📋 Generate candidate interview rubric')}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-brand-400 hover:text-brand-700 font-medium shrink-0 transition-colors"
                >
                  📋 Recruiter Rubric
                </button>
              </>
            ) : role === 'recruiter' ? (
              <>
                <button
                  onClick={() => handleSendMessage('📋 Generate candidate interview rubric & scoring criteria')}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-emerald-400 hover:text-emerald-700 font-medium shrink-0 transition-colors flex items-center gap-1"
                >
                  <FileText className="w-3 h-3 text-emerald-600" />
                  Interview Rubric
                </button>
                <button
                  onClick={() => handleSendMessage('💡 Technical coding questions for React & Python')}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-emerald-400 hover:text-emerald-700 font-medium shrink-0 transition-colors flex items-center gap-1"
                >
                  <HelpCircle className="w-3 h-3 text-emerald-600" />
                  Coding Questions
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleSendMessage('📄 Analyze my resume & suggest improvements')}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-brand-400 hover:text-brand-700 font-medium shrink-0 transition-colors flex items-center gap-1"
                >
                  <FileText className="w-3 h-3 text-brand-600" />
                  Audit Resume
                </button>
                <button
                  onClick={() => handleSendMessage('🎯 Which companies am I best suited for?')}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-brand-400 hover:text-brand-700 font-medium shrink-0 transition-colors flex items-center gap-1"
                >
                  <Briefcase className="w-3 h-3 text-emerald-600" />
                  Match Drives
                </button>
                <button
                  onClick={() => handleSendMessage('💻 Generate technical interview questions for my skills')}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-brand-400 hover:text-brand-700 font-medium shrink-0 transition-colors flex items-center gap-1"
                >
                  <HelpCircle className="w-3 h-3 text-purple-600" />
                  Mock Questions
                </button>
              </>
            )}
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
            {messages.map((msg, index) => (
              <div
                key={msg.id || index}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-xs text-xs mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-[13px] leading-relaxed relative group ${
                    msg.sender === 'user'
                      ? 'bg-brand-600 text-white rounded-br-none shadow-md shadow-brand-500/10'
                      : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  {/* Message body with basic markdown support */}
                  <div className="whitespace-pre-line space-y-2">
                    {msg.text.split('\n\n').map((paragraph, pIdx) => {
                      if (paragraph.startsWith('### ')) {
                        return (
                          <h4 key={pIdx} className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-1">
                            {paragraph.replace('### ', '')}
                          </h4>
                        );
                      }
                      if (paragraph.startsWith('#### ')) {
                        return (
                          <h5 key={pIdx} className="font-bold text-slate-800 text-xs mt-2">
                            {paragraph.replace('#### ', '')}
                          </h5>
                        );
                      }
                      return <p key={pIdx}>{paragraph}</p>;
                    })}
                  </div>

                  {/* Copy button for bot response */}
                  {msg.sender === 'bot' && (
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                      <span>{msg.timestamp}</span>
                      <button
                        onClick={() => handleCopy(msg.text, index)}
                        className="hover:text-slate-700 flex items-center gap-1 transition-colors"
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600 font-semibold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {msg.sender === 'user' && (
                    <div className="text-[10px] text-brand-200 text-right mt-1">
                      {msg.timestamp}
                    </div>
                  )}

                  {/* Suggested follow-up prompt chips */}
                  {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                    <div className="pt-3 mt-2 border-t border-slate-100 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                        Suggested Follow-ups:
                      </span>
                      <div className="flex flex-col gap-1">
                        {msg.suggestedPrompts.map((prompt, pIdx) => (
                          <button
                            key={pIdx}
                            onClick={() => handleSendMessage(prompt)}
                            className="text-left px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-200 text-slate-700 hover:text-brand-800 text-[11px] font-medium transition-colors flex items-center justify-between group/prompt"
                          >
                            <span>{prompt}</span>
                            <span className="text-slate-400 group-hover/prompt:text-brand-600">→</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 text-xs font-bold mt-1">
                    {user?.name?.slice(0, 1) || 'U'}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-slate-500 text-xs">
                <div className="w-7 h-7 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-xs text-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1.5 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3.5 bg-white border-t border-slate-200 shrink-0 space-y-2">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  role === 'tpo'
                    ? 'Ask about cohort analytics, interview rubrics...'
                    : role === 'recruiter'
                    ? 'Ask for candidate scoring rubrics, technical questions...'
                    : 'Ask for resume feedback, interview questions, drives...'
                }
                className="w-full pl-3.5 pr-12 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isTyping}
                className={`absolute right-1.5 p-2 rounded-lg transition-all ${
                  inputMessage.trim() && !isTyping
                    ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                }`}
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
              <span>Ready for Phase 2 API integration</span>
              <span>Press Enter to send</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
