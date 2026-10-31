import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Star,
  DollarSign,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  FileText,
  Shield,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { VendorItem, EventData } from '@/types';

interface VendorComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendors: VendorItem[];
  initialVendorA: VendorItem | null;
  initialVendorB: VendorItem | null;
  activeEvent: EventData;
  onDraftInquiry: (vendor: VendorItem) => void;
}

export const VendorComparisonModal: React.FC<VendorComparisonModalProps> = ({
  isOpen,
  onClose,
  vendors,
  initialVendorA,
  initialVendorB,
  activeEvent,
  onDraftInquiry,
}) => {
  const [vendorAId, setVendorAId] = useState<string>('');
  const [vendorBId, setVendorBId] = useState<string>('');
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      if (initialVendorA) {
        setVendorAId(initialVendorA.id);
      } else if (vendors.length > 0) {
        setVendorAId(vendors[0].id);
      }

      if (initialVendorB) {
        setVendorBId(initialVendorB.id);
      } else if (vendors.length > 1) {
        // Pick second vendor or different from vendor A
        const candidate = vendors.find((v) => v.id !== (initialVendorA?.id || vendors[0]?.id));
        setVendorBId(candidate ? candidate.id : vendors[0].id);
      }
    }
  }, [isOpen, initialVendorA, initialVendorB, vendors]);

  const vendorA = vendors.find((v) => v.id === vendorAId) || vendors[0] || null;
  const vendorB = vendors.find((v) => v.id === vendorBId) || vendors[1] || vendors[0] || null;

  useEffect(() => {
    if (isOpen && vendorA && vendorB && vendorA.id !== vendorB.id) {
      fetchComparisonAnalysis(vendorA, vendorB);
    }
  }, [vendorAId, vendorBId, isOpen]);

  const fetchComparisonAnalysis = async (vA: VendorItem, vB: VendorItem) => {
    setLoadingAi(true);
    try {
      const res = await fetch('/api/gemini/compare-vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorA: vA,
          vendorB: vB,
          eventTitle: activeEvent.title,
          guestCount: activeEvent.guestCount,
          budget: activeEvent.totalBudget,
        }),
      });
      const data = await res.json();
      setAiAnalysis(data.analysis || '');
    } catch {
      const diff = Math.abs(vA.cost - vB.cost);
      setAiAnalysis(
        `• **Financial Variance**: There is a $${diff.toLocaleString()} variance between quotes.\n` +
          `• **Reputation & Delivery**: ${vA.name} holds ${vA.rating}★ (${vA.reviewCount} reviews) vs ${vB.name} at ${vB.rating}★ (${vB.reviewCount} reviews).\n` +
          `• **Strategic AI Fit**: Both vendors are vetted for ${activeEvent.title}. Select ${vA.cost < vB.cost ? vA.name : vB.name} for budget optimization, or ${vA.cost >= vB.cost ? vA.name : vB.name} for expanded production specs.`
      );
    } finally {
      setLoadingAi(false);
    }
  };

  if (!isOpen || !vendorA) return null;

  const costDiff = Math.abs(vendorA.cost - (vendorB ? vendorB.cost : 0));
  const costPerGuestA = Math.round(vendorA.cost / (activeEvent.guestCount || 1));
  const costPerGuestB = vendorB ? Math.round(vendorB.cost / (activeEvent.guestCount || 1)) : 0;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="vendor-comparison-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-4xl rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 shadow-2xl my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F4ECE1] text-[#9D3E1A]">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h3 id="vendor-comparison-modal-title" className="font-editorial text-xl font-bold text-stone-900">
                Side-by-Side Vendor Comparison Tool
              </h3>
              <p className="text-xs text-stone-500">
                Evaluate pricing, ratings, and service scopes for {activeEvent.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="focus-visible:ring-2 focus-visible:ring-[#9D3E1A] p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pr-1 py-4 space-y-5 text-xs">
          {/* Vendor Selectors Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FBF9F5] p-3.5 rounded-xl border border-stone-200/80">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                Vendor 1 (Primary)
              </label>
              <div className="relative">
                <select
                  value={vendorAId}
                  onChange={(e) => setVendorAId(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-900 focus:border-[#9D3E1A] focus:outline-none shadow-2xs appearance-none"
                >
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.category} · {formatCurrency(v.cost)})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 pointer-events-none text-stone-400" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                Vendor 2 (Comparison Candidate)
              </label>
              <div className="relative">
                <select
                  value={vendorBId}
                  onChange={(e) => setVendorBId(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-900 focus:border-[#9D3E1A] focus:outline-none shadow-2xs appearance-none"
                >
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.category} · {formatCurrency(v.cost)})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 pointer-events-none text-stone-400" />
              </div>
            </div>
          </div>

          {/* Pricing Delta Callout */}
          {vendorB && vendorA.id !== vendorB.id && (
            <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50/70 p-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-[#9D3E1A]" />
                <span className="font-semibold text-stone-800">
                  Pricing Variance: {formatCurrency(costDiff)}
                </span>
                <span className="text-stone-400">·</span>
                <span className="text-stone-600">
                  {vendorA.cost < vendorB.cost
                    ? `${vendorA.name} is ${formatCurrency(costDiff)} lower than ${vendorB.name}`
                    : `${vendorB.name} is ${formatCurrency(costDiff)} lower than ${vendorA.name}`}
                </span>
              </div>
              <span className="font-tabular font-bold text-[11px] text-[#9D3E1A] bg-[#F4ECE1] px-2.5 py-0.5 rounded-full">
                {Math.round((costDiff / Math.max(vendorA.cost, vendorB.cost, 1)) * 100)}% Variance
              </span>
            </div>
          )}

          {/* Side-by-Side Cards Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* VENDOR A COLUMN */}
            <div className="rounded-2xl border-2 border-[#9D3E1A]/30 bg-white p-5 shadow-sm space-y-4 relative">
              <div className="absolute top-4 right-4 rounded-full bg-[#9D3E1A] px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                Vendor A
              </div>

              {/* Vendor Header */}
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-bold text-sm border ${vendorA.avatarColor}`}
                >
                  {vendorA.avatarText}
                </div>
                <div className="pr-16">
                  <h4 className="font-editorial text-lg font-bold text-stone-900 leading-tight">
                    {vendorA.name}
                  </h4>
                  <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-600 mt-1 inline-block">
                    {vendorA.category}
                  </span>
                </div>
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center justify-between border-y border-stone-100 py-2.5">
                <span className="font-medium text-stone-500">Client Rating:</span>
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center text-amber-500">
                    <Star className="h-4 w-4 fill-amber-400" />
                    <span className="font-tabular font-bold text-sm text-stone-900 ml-1">
                      {vendorA.rating}
                    </span>
                  </div>
                  <span className="text-stone-400">({vendorA.reviewCount} verified reviews)</span>
                </div>
              </div>

              {/* Pricing & Terms */}
              <div className="space-y-2 rounded-xl bg-[#FBF9F5] p-3.5 border border-stone-100">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-stone-500">Quoted Total:</span>
                  <span className="font-editorial text-xl font-bold text-stone-900">
                    {formatCurrency(vendorA.cost)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-stone-400">Cost / Guest ({activeEvent.guestCount} guests):</span>
                  <span className="font-tabular font-bold text-stone-700">
                    ${costPerGuestA} / attendee
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-stone-200/50">
                  <span className="text-stone-400">Payment Milestones:</span>
                  <span className="font-medium text-stone-700 text-right">
                    {vendorA.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Contract & Services Scope */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  Services &amp; Execution Scope
                </span>
                <p className="text-stone-700 leading-relaxed bg-white rounded-lg border border-stone-200/70 p-3">
                  {vendorA.notes}
                </p>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-stone-500">Contract Status:</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-bold ${
                      vendorA.status === 'Contract Signed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {vendorA.status}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => onDraftInquiry(vendorA)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#F4ECE1] py-2 text-xs font-semibold text-[#802A05] hover:bg-[#EBDDCB] transition"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#9D3E1A]" />
                  <span>Draft Inquiry</span>
                </button>
                <a
                  href={`mailto:${vendorA.contactEmail}`}
                  className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition"
                  title={vendorA.contactEmail}
                >
                  <Mail className="h-3.5 w-3.5" />
                </a>
                <a
                  href={`tel:${vendorA.contactPhone}`}
                  className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition"
                  title={vendorA.contactPhone}
                >
                  <Phone className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* VENDOR B COLUMN */}
            {vendorB && (
              <div className="rounded-2xl border-2 border-stone-200/90 bg-white p-5 shadow-sm space-y-4 relative">
                <div className="absolute top-4 right-4 rounded-full bg-stone-600 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                  Vendor B
                </div>

                {/* Vendor Header */}
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-bold text-sm border ${vendorB.avatarColor}`}
                  >
                    {vendorB.avatarText}
                  </div>
                  <div className="pr-16">
                    <h4 className="font-editorial text-lg font-bold text-stone-900 leading-tight">
                      {vendorB.name}
                    </h4>
                    <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-600 mt-1 inline-block">
                      {vendorB.category}
                    </span>
                  </div>
                </div>

                {/* Rating & Reviews */}
                <div className="flex items-center justify-between border-y border-stone-100 py-2.5">
                  <span className="font-medium text-stone-500">Client Rating:</span>
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center text-amber-500">
                      <Star className="h-4 w-4 fill-amber-400" />
                      <span className="font-tabular font-bold text-sm text-stone-900 ml-1">
                        {vendorB.rating}
                      </span>
                    </div>
                    <span className="text-stone-400">({vendorB.reviewCount} verified reviews)</span>
                  </div>
                </div>

                {/* Pricing & Terms */}
                <div className="space-y-2 rounded-xl bg-[#FBF9F5] p-3.5 border border-stone-100">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-stone-500">Quoted Total:</span>
                    <span className="font-editorial text-xl font-bold text-stone-900">
                      {formatCurrency(vendorB.cost)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-stone-400">Cost / Guest ({activeEvent.guestCount} guests):</span>
                    <span className="font-tabular font-bold text-stone-700">
                      ${costPerGuestB} / attendee
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-stone-200/50">
                    <span className="text-stone-400">Payment Milestones:</span>
                    <span className="font-medium text-stone-700 text-right">
                      {vendorB.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Contract & Services Scope */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    Services &amp; Execution Scope
                  </span>
                  <p className="text-stone-700 leading-relaxed bg-white rounded-lg border border-stone-200/70 p-3">
                    {vendorB.notes}
                  </p>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-stone-500">Contract Status:</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-bold ${
                        vendorB.status === 'Contract Signed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {vendorB.status}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => onDraftInquiry(vendorB)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#F4ECE1] py-2 text-xs font-semibold text-[#802A05] hover:bg-[#EBDDCB] transition"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-[#9D3E1A]" />
                    <span>Draft Inquiry</span>
                  </button>
                  <a
                    href={`mailto:${vendorB.contactEmail}`}
                    className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition"
                    title={vendorB.contactEmail}
                  >
                    <Mail className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={`tel:${vendorB.contactPhone}`}
                    className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition"
                    title={vendorB.contactPhone}
                  >
                    <Phone className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* AI Comparative Evaluation Section */}
          <div className="rounded-2xl border border-[#C57B57]/40 bg-gradient-to-br from-[#FDFBF7] to-[#F4ECE1]/60 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#9D3E1A] text-white">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <h4 className="font-editorial text-sm font-bold text-stone-900">
                  AI Comparative Planning Evaluation
                </h4>
              </div>

              {loadingAi && (
                <span className="flex items-center gap-1 text-[11px] font-medium text-stone-500">
                  <Sparkles className="h-3 w-3 animate-spin text-[#9D3E1A]" />
                  Synthesizing vendor analysis...
                </span>
              )}
            </div>

            <div className="text-stone-700 leading-relaxed whitespace-pre-wrap bg-white/70 p-3.5 rounded-xl border border-stone-200/50">
              {aiAnalysis || 'Comparing pricing, rating reliability, and delivery capacity...'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2 shrink-0">
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="focus-visible:ring-2 focus-visible:ring-[#9D3E1A] rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
          >
            Close Matrix
          </button>
        </div>
      </div>
    </div>
  );
};
