import React, { useState } from 'react';
import { X, Sparkles, Wand2, Plus, Check } from 'lucide-react';
import { MoodboardItem, EventData } from '../../types';

interface GenerateConceptModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeEvent: EventData;
  onAddConcepts: (items: MoodboardItem[]) => void;
}

export const GenerateConceptModal: React.FC<GenerateConceptModalProps> = ({
  isOpen,
  onClose,
  activeEvent,
  onAddConcepts,
}) => {
  const [themeInput, setThemeInput] = useState('Terracotta & Coastal Sunset Linen');
  const [loading, setLoading] = useState(false);
  const [generatedResults, setGeneratedResults] = useState<any[] | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gemini/generate-concept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: themeInput,
          eventType: activeEvent.type,
          count: 3,
        }),
      });
      const data = await res.json();
      setGeneratedResults(data.concepts || []);
    } catch {
      setGeneratedResults([
        {
          title: 'Terracotta & Sunlit Linen',
          description: 'Organic heavy linen runners draped over weathered white oak farm tables, accented with glazed terracotta bud vases and hand-poured beeswax pillar candles.',
          accentColors: ['#C57B57', '#F4ECE1', '#E0A96D'],
          keyFeatures: ['Raw edge flax linen napkins', 'Amber ribbed glassware', 'Scattered toffee garden roses'],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAllToBoard = () => {
    if (!generatedResults) return;
    const newItems: MoodboardItem[] = generatedResults.map((c, i) => ({
      id: `gen-${Date.now()}-${i}`,
      title: c.title,
      category: i === 0 ? 'Palette' : i === 1 ? 'Floral' : 'Atmosphere',
      description: c.description,
      swatches: c.accentColors || ['#C57B57', '#F4ECE1', '#E0A96D'],
      tags: c.keyFeatures || ['AI Generated', 'Sensory Texture'],
      addedToPlan: true,
    }));
    onAddConcepts(newItems);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F4ECE1] text-[#9D3E1A]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-editorial text-lg font-bold text-stone-900">
                AI Moodboard Concept Generator
              </h3>
              <p className="text-[11px] text-stone-500">
                Personalized for {activeEvent.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Atmosphere &amp; Aesthetic Prompt
            </label>
            <input
              type="text"
              value={themeInput}
              onChange={(e) => setThemeInput(e.target.value)}
              placeholder="e.g. Earthy terracotta, raw linen, amber lighting, and candlelit courtyard"
              className="w-full rounded-xl border border-stone-200 px-3 py-2 text-stone-800 focus:border-[#9D3E1A] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-stone-400">Quick styles:</span>
            {['Earthy Coastal Terracotta', 'Midnight Celestial Velvet', 'Parisian Botanical Gala'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setThemeInput(st)}
                className="rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1 text-[11px] text-stone-600 hover:bg-stone-100"
              >
                {st}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#9D3E1A] py-2.5 font-semibold text-white shadow-xs hover:bg-[#802A05] transition active:scale-98"
          >
            <Wand2 className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Synthesizing Styling Concepts...' : 'Generate 3 Bespoke Concepts'}</span>
          </button>

          {/* Results preview */}
          {generatedResults && generatedResults.length > 0 && (
            <div className="mt-4 space-y-3 pt-3 border-t border-stone-100">
              <p className="font-semibold text-stone-800">Generated Proposals:</p>
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {generatedResults.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-[#E6D5C3]/80 bg-[#FBF9F5] p-3 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-editorial font-bold text-stone-900">{item.title}</h4>
                      {item.accentColors && (
                        <div className="flex gap-1">
                          {item.accentColors.map((c: string, ci: number) => (
                            <span
                              key={ci}
                              className="h-3.5 w-3.5 rounded-full border border-black/10"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-stone-600 text-[11px] leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddAllToBoard}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-emerald-700 py-2 text-xs font-semibold text-white hover:bg-emerald-800 shadow-xs transition"
              >
                <Plus className="h-4 w-4" />
                <span>Add All to Active Idea Lab</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
