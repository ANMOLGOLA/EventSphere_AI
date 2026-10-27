import React, { useState } from 'react';
import {
  Users2,
  CheckCircle2,
  Clock,
  Star,
  Mail,
  Phone,
  Sparkles,
  Plus,
  Search,
  ExternalLink,
  ShieldCheck,
  FileCheck,
  Layers,
  ArrowRightLeft,
  X,
  Check,
} from 'lucide-react';
import { VendorItem, EventData } from '@/types';

interface VendorsTabProps {
  activeEvent: EventData;
  vendors: VendorItem[];
  onAddVendor: () => void;
  onDraftInquiry: (vendor: VendorItem) => void;
  onOpenCopilotWithPrompt: (prompt: string) => void;
  onOpenCompareModal: (vendorA?: VendorItem, vendorB?: VendorItem) => void;
}

export const VendorsTab: React.FC<VendorsTabProps> = ({
  activeEvent,
  vendors,
  onAddVendor,
  onDraftInquiry,
  onOpenCopilotWithPrompt,
  onOpenCompareModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const categories = [
    'All',
    'Venue',
    'Catering',
    'Photography',
    'Music & Sound',
    'Florals',
    'Officiant',
  ];

  const signedCount = vendors.filter((v) => v.status === 'Contract Signed').length;
  const reviewCount = vendors.filter((v) => v.status === 'In Review' || v.status === 'Under Negotiation').length;

  const filteredVendors = vendors.filter((v) => {
    const matchesCat =
      selectedCategory === 'All' || v.category === selectedCategory;
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.notes.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleCompare = (vendorId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(vendorId)) {
        return prev.filter((id) => id !== vendorId);
      }
      if (prev.length >= 2) {
        // Replace second vendor
        return [prev[0], vendorId];
      }
      return [...prev, vendorId];
    });
  };

  const handleLaunchCompare = () => {
    if (compareIds.length >= 2) {
      const vA = vendors.find((v) => v.id === compareIds[0]);
      const vB = vendors.find((v) => v.id === compareIds[1]);
      onOpenCompareModal(vA, vB);
    } else if (compareIds.length === 1) {
      const vA = vendors.find((v) => v.id === compareIds[0]);
      const other = vendors.find((v) => v.id !== compareIds[0]);
      onOpenCompareModal(vA, other);
    } else {
      onOpenCompareModal(vendors[0], vendors[1]);
    }
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="space-y-6 relative pb-16">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="flex items-center justify-between rounded-2xl border border-[#E6D5C3]/80 bg-white p-5 shadow-sm">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Active Vendors
            </span>
            <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              {vendors.length} Partners
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">Assigned to {activeEvent.title}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F4ECE1] text-[#9D3E1A]">
            <Users2 className="h-6 w-6" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-[#E6D5C3]/80 bg-white p-5 shadow-sm">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Contracts Signed
            </span>
            <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-emerald-700 mt-1">
              {signedCount} Verified
            </h3>
            <p className="text-xs text-emerald-600 mt-0.5">Deposits and COI on file</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <FileCheck className="h-6 w-6" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-[#E6D5C3]/80 bg-white p-5 shadow-sm">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Pending Approvals
            </span>
            <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#9D3E1A] mt-1">
              {reviewCount} Reviewing
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">Negotiating terms and rider</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <Clock className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar with Compare Tool Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#E6D5C3]/80 bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-[#9D3E1A] text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200/70'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
            <input
              type="text"
              placeholder="Search vendors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-xl border border-stone-200 bg-stone-50/70 pl-8 pr-3 py-1.5 text-xs text-stone-800 focus:border-[#9D3E1A] focus:outline-none"
            />
          </div>

          {/* Compare Tool Trigger Button */}
          <button
            onClick={handleLaunchCompare}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition shadow-2xs ${
              compareIds.length > 0
                ? 'border-[#9D3E1A] bg-[#F4ECE1] text-[#802A05]'
                : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50 hover:text-stone-900'
            }`}
            title="Open side-by-side comparison modal"
          >
            <ArrowRightLeft className="h-3.5 w-3.5 text-[#9D3E1A]" />
            <span>
              Compare Tool {compareIds.length > 0 && `(${compareIds.length}/2)`}
            </span>
          </button>

          <button
            onClick={onAddVendor}
            className="flex items-center gap-1.5 rounded-xl bg-[#9D3E1A] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#802A05] transition"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Shortlist Vendor</span>
          </button>
        </div>
      </div>

      {/* Floating Comparison Tray (Sticky when 1 or 2 vendors selected) */}
      {compareIds.length > 0 && (
        <div className="sticky top-20 z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-[#9D3E1A]/40 bg-[#F4ECE1]/95 px-4 py-3 shadow-md backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#9D3E1A] text-white">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#802A05]">
                {compareIds.length === 1
                  ? '1 Vendor Selected for Comparison'
                  : '2 Vendors Ready for Side-by-Side Evaluation'}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-stone-600 mt-0.5">
                {compareIds.map((id, index) => {
                  const v = vendors.find((item) => item.id === id);
                  return (
                    <span key={id} className="font-semibold text-stone-900">
                      {v?.name} {index === 0 && compareIds.length === 2 && 'vs.'}
                    </span>
                  );
                })}
                {compareIds.length === 1 && (
                  <span className="text-stone-500 italic">
                    (Select a 2nd vendor card below or click View Matrix)
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCompareIds([])}
              className="rounded-xl border border-stone-300 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-50 transition"
            >
              Clear
            </button>
            <button
              onClick={handleLaunchCompare}
              className="flex items-center gap-1.5 rounded-xl bg-[#9D3E1A] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#802A05] transition active:scale-98"
            >
              <ArrowRightLeft className="h-3.5 w-3.5" />
              <span>View Side-by-Side Matrix</span>
            </button>
          </div>
        </div>
      )}

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.map((vendor) => {
          const isSelectedForCompare = compareIds.includes(vendor.id);
          const compareIndex = compareIds.indexOf(vendor.id);

          return (
            <div
              key={vendor.id}
              className={`group rounded-2xl border bg-white p-5 shadow-sm transition-all flex flex-col justify-between relative ${
                isSelectedForCompare
                  ? 'border-[#9D3E1A] ring-2 ring-[#9D3E1A]/20 bg-[#FDFBF7]'
                  : 'border-[#E6D5C3]/80 hover:border-[#9D3E1A]/40 hover:shadow-md'
              }`}
            >
              {/* Compare Checkbox Affordance in Card Top-Right */}
              <div className="absolute top-4 right-4 z-10">
                <button
                  type="button"
                  onClick={() => toggleCompare(vendor.id)}
                  className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold transition ${
                    isSelectedForCompare
                      ? 'bg-[#9D3E1A] text-white shadow-xs'
                      : 'border border-stone-200 bg-stone-50/80 text-stone-600 hover:border-[#9D3E1A]/50 hover:bg-white'
                  }`}
                  title="Toggle side-by-side comparison"
                >
                  {isSelectedForCompare ? (
                    <>
                      <Check className="h-3 w-3" />
                      <span>Compare #{compareIndex + 1}</span>
                    </>
                  ) : (
                    <>
                      <ArrowRightLeft className="h-2.5 w-2.5" />
                      <span>Compare</span>
                    </>
                  )}
                </button>
              </div>

              <div>
                {/* Header with Avatar & Category */}
                <div className="flex items-start justify-between gap-3 mb-3 pr-20">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-bold text-sm border ${vendor.avatarColor}`}
                    >
                      {vendor.avatarText}
                    </div>
                    <div>
                      <h4 className="font-editorial text-base font-bold text-stone-900 group-hover:text-[#9D3E1A] transition">
                        {vendor.name}
                      </h4>
                      <span className="text-[11px] font-semibold text-stone-500">
                        {vendor.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rating & Reviews */}
                <div className="mb-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                    <span className="font-tabular text-xs font-bold text-stone-800">
                      {vendor.rating}
                    </span>
                    <span className="text-[10px] text-stone-400">({vendor.reviewCount})</span>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      vendor.status === 'Contract Signed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : vendor.status === 'In Review'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {vendor.status}
                  </span>
                </div>

                {/* Status & Commitment */}
                <div className="mb-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-500">Quoted Commitment:</span>
                    <span className="font-tabular font-bold text-stone-900">
                      {formatCurrency(vendor.cost)}
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-500 italic bg-[#FBF9F5] p-2 rounded-lg border border-stone-100">
                    {vendor.paymentStatus}
                  </p>
                </div>

                {/* Notes */}
                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                  {vendor.notes}
                </p>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-stone-100 space-y-2">
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${vendor.contactEmail}`}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50/70 py-2 text-xs font-medium text-stone-700 hover:bg-stone-100 transition"
                    title={vendor.contactEmail}
                  >
                    <Mail className="h-3.5 w-3.5 text-stone-500" />
                    <span>Email</span>
                  </a>
                  <a
                    href={`tel:${vendor.contactPhone}`}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50/70 py-2 text-xs font-medium text-stone-700 hover:bg-stone-100 transition"
                    title={vendor.contactPhone}
                  >
                    <Phone className="h-3.5 w-3.5 text-stone-500" />
                    <span>Call</span>
                  </a>
                </div>

                {/* One-Click AI Inquiry Generator */}
                <button
                  onClick={() => onDraftInquiry(vendor)}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-[#F4ECE1] py-2 text-xs font-semibold text-[#802A05] hover:bg-[#EBDDCB] transition active:scale-98"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#9D3E1A]" />
                  <span>✨ Draft Inquiry with AI</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
