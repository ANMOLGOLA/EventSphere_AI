import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Mic,
  MicOff,
  Image as ImageIcon,
  Copy,
  Check,
  CheckSquare,
  Square,
  CornerDownLeft,
  Bot,
  User,
  RotateCcw,
} from 'lucide-react';
import { EventData, ChatMessage, IWindowSpeechRecognition } from '@/types';

interface CopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeEvent: EventData;
  activeTab: string;
  externalPrompt?: string | null;
  onClearExternalPrompt?: () => void;
}

export const CopilotDrawer: React.FC<CopilotDrawerProps> = ({
  isOpen,
  onClose,
  activeEvent,
  activeTab,
  externalPrompt,
  onClearExternalPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: `Welcome to **EventSphere Copilot**. I am attuned to **${activeEvent.title}** (${activeEvent.location}) on the **${activeTab}** workspace.\n\nHow can I streamline your production timeline, vendor negotiations, or budget today?`,
      timestamp: 'Just now',
      actionItems: [
        { id: 'a1', text: 'Review 20-minute buffer for First Look', completed: false },
        { id: 'a2', text: 'Confirm wholesale stem delivery window', completed: false },
        { id: 'a3', text: 'Check dietary flags with head sommelier', completed: true },
      ],
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Focus management & Escape key listener (WCAG 2.1 AA)
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      // Focus textarea on open
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else if (triggerRef.current) {
      triggerRef.current.focus();
    }
  }, [isOpen]);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView?.({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle external prompt triggers (e.g. from buttons on tabs)
  useEffect(() => {
    if (externalPrompt) {
      handleSendMessage(externalPrompt);
      if (onClearExternalPrompt) {
        onClearExternalPrompt();
      }
    }
  }, [externalPrompt]);

  // Handle Escape key to close drawer (WCAG 2.1 AA)
  useEffect(() => {
    const handleKeyDownGlobal = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDownGlobal);
    return () => window.removeEventListener('keydown', handleKeyDownGlobal);
  }, [isOpen, onClose]);

  const quickPrompts = [
    'Draft 3 signature mocktails',
    'Generate 6-month floral checklist',
    'Write polite photographer negotiation note',
    'Simulate budget variance for +50 guests',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputValue.trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          eventContext: {
            title: activeEvent.title,
            type: activeEvent.type,
            location: activeEvent.location,
            guestCount: activeEvent.guestCount,
            date: activeEvent.date,
          },
          activeTab,
          chatHistory: messages.slice(-4),
        }),
      });

      const data = await response.json();
      const rawText: string = data.text || 'Action acknowledged. Parameters updated.';

      // Parse markdown checkboxes if present: e.g. - [ ] or - [x]
      const lines = rawText.split('\n');
      const actionItems: { id: string; text: string; completed: boolean }[] = [];
      const cleanLines: string[] = [];

      lines.forEach((line, idx) => {
        const checkboxMatch = line.match(/^[-*]\s*\[([ xX])\]\s*(.*)/);
        if (checkboxMatch) {
          actionItems.push({
            id: `act-${idx}`,
            text: checkboxMatch[2],
            completed: checkboxMatch[1].toLowerCase() === 'x',
          });
        } else {
          cleanLines.push(line);
        }
      });

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: cleanLines.join('\n'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionItems: actionItems.length > 0 ? actionItems : undefined,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      const fallbackAi: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: `### Strategy Analysis for: "${query}"\n\n• **Immediate Action**: Align on exact deliverables with your lead coordinator.\n• **Budget Impact**: Estimated variance is within ±3% of current contingency allocation.\n• **Suggested Timeline Check**: Ensure this milestone is locked 3 weeks prior to load-in.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackAi]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleActionItem = (msgId: string, actId: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== msgId || !msg.actionItems) return msg;
        return {
          ...msg,
          actionItems: msg.actionItems.map((act) =>
            act.id === actId ? { ...act, completed: !act.completed } : act
          ),
        };
      })
    );
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleMic = () => {
    if (!isListening) {
      setIsListening(true);
      // speech simulation or Web Speech API if supported
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const windowWithSpeech = window as unknown as {
          SpeechRecognition?: new () => IWindowSpeechRecognition;
          webkitSpeechRecognition?: new () => IWindowSpeechRecognition;
        };
        const SpeechRec =
          windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;
        if (SpeechRec) {
          try {
            const rec = new SpeechRec();
            rec.continuous = false;
            rec.interimResults = false;
            rec.onresult = (evt: { results: { [index: number]: { [index: number]: { transcript: string } } } }) => {
              const transcript = evt.results[0]?.[0]?.transcript || '';
              setInputValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
              setIsListening(false);
            };
            rec.onerror = () => setIsListening(false);
            rec.onend = () => setIsListening(false);
            rec.start();
          } catch {
            setIsListening(false);
          }
        }
      } else {
        setTimeout(() => {
          setInputValue('Suggest in-season floral alternatives that pair with terracotta table runners');
          setIsListening(false);
        }, 1500);
      }
    } else {
      setIsListening(false);
    }
  };

  return (
    <aside
      role="dialog"
      aria-modal="true"
      aria-labelledby="copilot-drawer-title"
      aria-describedby="copilot-drawer-desc"
      className={`fixed top-0 bottom-0 right-0 z-50 flex flex-col justify-between border-l border-[#E6D5C3]/80 bg-[#FDFBF7] shadow-xl transition-all duration-300 ease-in-out ${
        isOpen ? 'w-full sm:w-[380px] translate-x-0' : 'w-[380px] translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="border-b border-[#E6D5C3]/70 bg-white/70 p-4 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-[#9D3E1A] to-[#E0A96D] text-white shadow-2xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 id="copilot-drawer-title" className="font-editorial text-sm font-bold text-stone-900">
                EventSphere Copilot
              </h3>
              <p id="copilot-drawer-desc" className="text-[10px] text-stone-500 font-medium">
                Context: <span className="text-[#9D3E1A] font-semibold">{activeEvent.title}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() =>
                setMessages([
                  {
                    id: `rst-${Date.now()}`,
                    sender: 'ai',
                    text: `Session refreshed. Context reset to **${activeEvent.title}** (${activeTab} view). How can I help?`,
                    timestamp: 'Just now',
                  },
                ])
              }
              aria-label="Reset conversation"
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition"
              title="Reset conversation"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              aria-label="Close copilot drawer"
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition"
              title="Close panel"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Quick Prompt Pills Carousel */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="shrink-0 rounded-full border border-stone-200/90 bg-white px-2.5 py-1 text-[11px] font-medium text-stone-700 shadow-2xs hover:border-[#9D3E1A]/40 hover:bg-[#F4ECE1]/50 hover:text-[#9D3E1A] transition"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Stream */}
      <div
        role="log"
        aria-live="polite"
        aria-atomic="true"
        aria-relevant="additions"
        aria-label="Copilot interaction history"
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div className="flex items-center gap-1.5 text-[10px] text-stone-400 mb-1 px-1">
              <span>{msg.sender === 'user' ? 'You' : 'Event Whisperer'}</span>
              <span>·</span>
              <span>{msg.timestamp}</span>
            </div>

            <div
              className={`relative group max-w-[90%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-2xs ${
                msg.sender === 'user'
                  ? 'bg-[#9D3E1A] text-white rounded-tr-none font-medium'
                  : 'bg-white border border-[#E6D5C3]/70 text-stone-800 rounded-tl-none font-normal'
              }`}
            >
              {/* Message text with basic markdown formatting */}
              <div className="space-y-2 whitespace-pre-wrap">
                {msg.text}
              </div>

              {/* Action Checkboxes if present */}
              {msg.actionItems && msg.actionItems.length > 0 && (
                <div className="mt-3 pt-3 border-t border-stone-100 space-y-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Action Plan Affordances:
                  </p>
                  {msg.actionItems.map((act) => (
                    <button
                      key={act.id}
                      onClick={() => toggleActionItem(msg.id, act.id)}
                      className="flex items-start gap-2 text-left w-full rounded-lg p-1.5 hover:bg-stone-50 transition"
                    >
                      {act.completed ? (
                        <CheckSquare className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <Square className="h-3.5 w-3.5 text-stone-400 shrink-0 mt-0.5" />
                      )}
                      <span
                        className={`text-xs ${
                          act.completed
                            ? 'line-through text-stone-400 font-normal'
                            : 'text-stone-800 font-medium'
                        }`}
                      >
                        {act.text}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Copy snippet button */}
              {msg.sender === 'ai' && (
                <button
                  onClick={() => copyToClipboard(msg.text, msg.id)}
                  className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 p-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition"
                  title="Copy snippet"
                >
                  {copiedId === msg.id ? (
                    <Check className="h-3 w-3 text-emerald-600" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F4ECE1] text-[#9D3E1A]">
              <Sparkles className="h-3.5 w-3.5 animate-spin" />
            </div>
            <div className="rounded-2xl rounded-tl-none border border-stone-200 bg-white p-3 text-xs text-stone-500 shadow-2xs">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#9D3E1A] animate-ping" />
                Event Whisperer reasoning with production parameters...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="border-t border-[#E6D5C3]/70 bg-white p-3 space-y-2">
        <div className="relative rounded-2xl border border-stone-200 bg-[#FBF9F5] p-2 focus-within:border-[#9D3E1A] focus-within:ring-1 focus-within:ring-[#9D3E1A]/20 transition">
          <textarea
            ref={inputRef}
            data-testid="copilot-input"
            aria-label="Message Event Whisperer Copilot"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Copilot (e.g. 'Draft photographer note', 'Optimize floral budget')..."
            rows={2}
            className="w-full resize-none bg-transparent text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none"
          />

          <div className="flex items-center justify-between pt-1 border-t border-stone-200/50">
            <div className="flex items-center gap-1 text-stone-400">
              <button
                type="button"
                onClick={toggleMic}
                aria-label="Voice input toggle"
                className={`p-1.5 rounded-lg transition ${
                  isListening
                    ? 'bg-rose-100 text-rose-600'
                    : 'hover:bg-stone-200/50 hover:text-stone-700'
                }`}
                title="Voice input"
              >
                {isListening ? (
                  <Mic className="h-3.5 w-3.5 animate-pulse text-rose-600" aria-hidden="true" />
                ) : (
                  <MicOff className="h-3.5 w-3.5" aria-hidden="true" />
                )}
              </button>
              <button
                type="button"
                onClick={() =>
                  setInputValue((prev) =>
                    prev ? `${prev} [Attached Moodboard Reference]` : '[Attached Moodboard Reference]'
                  )
                }
                aria-label="Attach moodboard concept reference"
                className="p-1.5 rounded-lg hover:bg-stone-200/50 hover:text-stone-700 transition"
                title="Attach concept image"
              >
                <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <span className="text-[10px] hidden sm:inline ml-1 text-stone-400">
                Enter to send · Shift+Enter newline
              </span>
            </div>

            <button
              type="button"
              data-testid="copilot-send-btn"
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isLoading}
              aria-label="Send message to Copilot"
              className={`flex h-7 w-7 items-center justify-center rounded-xl transition ${
                inputValue.trim() && !isLoading
                  ? 'bg-[#9D3E1A] text-white hover:bg-[#802A05] shadow-xs active:scale-95 cursor-pointer'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
              title="Send message"
            >
              <Send className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
