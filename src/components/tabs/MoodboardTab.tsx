import React, { useState } from 'react';
import {
  Palette,
  Sparkles,
  Copy,
  Check,
  Plus,
  Share2,
  RefreshCw,
  Wine,
  Flame,
  BookmarkCheck,
  BookmarkPlus,
  Layers,
} from 'lucide-react';
import { MoodboardItem, EventData } from '../../types';

interface MoodboardTabProps {
  activeEvent: EventData;
  moodboardItems: MoodboardItem[];
  onToggleAddToPlan: (id: string) => void;
  onOpenGenerateConceptModal: () => void;
  onOpenCopilotWithPrompt: (prompt: string) => void;
}

export const MoodboardTab: React.FC<MoodboardTabProps> = ({
  activeEvent,
  moodboardItems,
  onToggleAddToPlan,
  onOpenGenerateConceptModal,
  onOpenCopilotWithPrompt,
}) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const tags = ['All', 'Palette', 'Cocktails', 'Floral', 'Atmosphere', 'Stationery'];

  const filteredItems = moodboardItems.filter((item) => {
    if (selectedTag === 'All') return true;
    return item.category === selectedTag;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Generation Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#E6D5C3]/80 bg-white p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-editorial text-lg font-bold text-stone-900">
              Generative AI Moodboard &amp; Personalized Idea Lab
            </h3>
            <span className="rounded-full bg-[#F4ECE1] px-2.5 py-0.5 text-[10px] font-bold text-[#802A05]">
              Autonomous Curation
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Curate color swatches, bespoke signature cocktails, sensory lighting cues, and guest experiences
          </p>
        </div>

        <button
          onClick={onOpenGenerateConceptModal}
          className="flex items-center gap-2 rounded-xl bg-[#9D3E1A] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#802A05] transition active:scale-98"
        >
          <Sparkles className="h-4 w-4" />
          <span>✨ Generate New Concept</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              selectedTag === tag
                ? 'bg-[#9D3E1A] text-white shadow-xs'
                : 'bg-white text-stone-700 border border-stone-200/80 hover:bg-stone-50'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Grid of Concept Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group rounded-2xl border border-[#E6D5C3]/80 bg-white shadow-sm hover:border-[#9D3E1A]/40 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
          >
            <div>
              {/* Image banner if present */}
              {item.image && (
                <div
                  className="h-48 w-full bg-cover bg-center relative overflow-hidden"
                  style={{ backgroundImage: `url(${item.image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                    <span className="rounded-md bg-white/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-stone-900 uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-5">
                {!item.image && (
                  <div className="flex items-center justify-between mb-3">
                    <span className="rounded-md bg-[#F4ECE1] px-2.5 py-0.5 text-[10px] font-bold text-[#802A05] uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>
                )}

                <h4 className="font-editorial text-base sm:text-lg font-bold text-stone-900 group-hover:text-[#9D3E1A] transition">
                  {item.title}
                </h4>

                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  {item.description}
                </p>

                {/* Swatches if palette item */}
                {item.swatches && (
                  <div className="mt-4 pt-3 border-t border-stone-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-medium text-stone-500">
                        Click swatch to copy hex:
                      </span>
                      {copiedHex && (
                        <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                          <Check className="h-3 w-3" /> Copied {copiedHex}!
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {item.swatches.map((hex) => (
                        <button
                          key={hex}
                          onClick={() => copyToClipboard(hex)}
                          className="group/swatch relative flex h-10 flex-1 rounded-xl shadow-xs transition hover:scale-105 active:scale-95 border border-black/5"
                          style={{ backgroundColor: hex }}
                          title={`Copy ${hex}`}
                        >
                          <span className="sr-only">Copy {hex}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cocktail recipe details */}
                {item.recipe && (
                  <div className="mt-4 rounded-xl border border-stone-200/80 bg-[#FBF9F5] p-3 text-xs space-y-1.5">
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-stone-700">
                      <Wine className="h-3 w-3 text-[#9D3E1A]" />
                      <span>Glass: {item.recipe.glass}</span>
                    </div>
                    <div className="text-stone-600 space-y-0.5 text-[11px]">
                      {item.recipe.ingredients.map((ing, i) => (
                        <p key={i}>• {ing}</p>
                      ))}
                    </div>
                    <p className="text-[11px] text-stone-500 pt-1 border-t border-stone-200/50">
                      <em>Garnish:</em> {item.recipe.garnish}
                    </p>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-4">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-5 pt-0 border-t border-stone-100 flex items-center justify-between gap-2 mt-2">
              <button
                onClick={() => onToggleAddToPlan(item.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition ${
                  item.addedToPlan
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {item.addedToPlan ? (
                  <>
                    <BookmarkCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span>In Active Plan</span>
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="h-3.5 w-3.5" />
                    <span>Add to Plan</span>
                  </>
                )}
              </button>

              <button
                onClick={() =>
                  onOpenCopilotWithPrompt(
                    `Regenerate bespoke styling variations and lighting cues based on "${item.title}".`
                  )
                }
                className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition"
                title="Regenerate Concept with AI"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
