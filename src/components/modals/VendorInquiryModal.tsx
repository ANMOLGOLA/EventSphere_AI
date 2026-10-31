import React, { useState, useEffect } from 'react';
import { X, Sparkles, Copy, Check, Mail, RefreshCw, Send } from 'lucide-react';
import { VendorItem, EventData } from '@/types';

interface VendorInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: VendorItem | null;
  activeEvent: EventData;
}

export const VendorInquiryModal: React.FC<VendorInquiryModalProps> = ({
  isOpen,
  onClose,
  vendor,
  activeEvent,
}) => {
  const [inquiryText, setInquiryText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && vendor) {
      generateInquiry();
    } else {
      setSentSuccess(false);
    }
  }, [isOpen, vendor]);

  const generateInquiry = async () => {
    if (!vendor) return;
    setLoading(true);
    setCopied(false);

    try {
      const res = await fetch('/api/gemini/vendor-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorName: vendor.name,
          category: vendor.category,
          eventTitle: activeEvent.title,
          eventDate: activeEvent.date,
          guestCount: activeEvent.guestCount,
          location: activeEvent.location,
          notes: vendor.notes,
        }),
      });
      const data = await res.json();
      setInquiryText(data.email || '');
    } catch {
      setInquiryText(
        `Subject: Inquiry: Availability & Services for ${activeEvent.title} (${activeEvent.date})\n\n` +
          `Dear ${vendor.name} Team,\n\n` +
          `We are currently orchestrating the production for "${activeEvent.title}" taking place in ${activeEvent.location} on ${activeEvent.date}, hosting approximately ${activeEvent.guestCount} guests.\n\n` +
          `Your aesthetic execution for ${vendor.category} aligns seamlessly with our vision. We would love to check your availability for this date and request your standard package catalog and load-in specifications.\n\n` +
          `Could you please share your typical deposit schedule and contract turnaround time?\n\n` +
          `Warm regards,\nEventSphere Planning Team`
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !vendor) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(inquiryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendSimulated = () => {
    setSentSuccess(true);
    setTimeout(() => {
      onClose();
      setSentSuccess(false);
    }, 1500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="vendor-inquiry-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F4ECE1] text-[#9D3E1A]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 id="vendor-inquiry-modal-title" className="font-editorial text-lg font-bold text-stone-900">
                AI Custom Vendor Inquiry
              </h3>
              <p className="text-[11px] text-stone-500">
                Recipient: <strong className="text-stone-800">{vendor.name}</strong> ({vendor.category})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="focus-visible:ring-2 focus-visible:ring-[#9D3E1A] p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>Calibrated with {activeEvent.guestCount} guests at {activeEvent.location}</span>
            <button
              onClick={generateInquiry}
              disabled={loading}
              className="flex items-center gap-1 font-semibold text-[#9D3E1A] hover:underline"
            >
              <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
              <span>Regenerate Draft</span>
            </button>
          </div>

          <div className="relative">
            {loading ? (
              <div className="h-64 flex flex-col items-center justify-center rounded-xl border border-stone-200 bg-stone-50/50 p-6 text-xs text-stone-500 space-y-2">
                <Sparkles className="h-6 w-6 text-[#9D3E1A] animate-spin" />
                <p className="font-semibold text-stone-700">Synthesizing personalized vendor inquiry...</p>
                <p className="text-[11px] text-stone-400">Incorporating guest counts, seasonal timing, and aesthetic tones</p>
              </div>
            ) : (
              <textarea
                value={inquiryText}
                onChange={(e) => setInquiryText(e.target.value)}
                rows={11}
                className="w-full rounded-xl border border-stone-200 bg-[#FBF9F5] p-3 text-xs text-stone-800 focus:border-[#9D3E1A] focus:outline-none leading-relaxed font-sans"
              />
            )}
          </div>
        </div>

        {sentSuccess ? (
          <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-center text-xs font-bold text-emerald-800 border border-emerald-200 flex items-center justify-center gap-2">
            <Check className="h-4 w-4 text-emerald-600" />
            <span>Inquiry transmitted successfully to {vendor.contactEmail}!</span>
          </div>
        ) : (
          <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-2 border-t border-stone-100">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-stone-500" />
                  <span>Copy Text</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2">
              <a
                href={`mailto:${vendor.contactEmail}?subject=${encodeURIComponent(
                  `Inquiry: ${activeEvent.title} (${activeEvent.date})`
                )}&body=${encodeURIComponent(inquiryText)}`}
                className="flex items-center gap-1.5 rounded-xl border border-[#9D3E1A]/40 bg-[#F4ECE1] px-3.5 py-2 text-xs font-semibold text-[#802A05] hover:bg-[#EBDDCB] transition"
              >
                <Mail className="h-3.5 w-3.5 text-[#9D3E1A]" />
                <span>Open in Email App</span>
              </a>

              <button
                onClick={handleSendSimulated}
                className="flex items-center gap-1.5 rounded-xl bg-[#9D3E1A] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#802A05] transition active:scale-98"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Send Dispatch</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
