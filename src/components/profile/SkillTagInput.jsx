import React, { useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';

export default function SkillTagInput({ skills = [], onChange, error, disabled = false }) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill();
    }
  };

  const addSkill = () => {
    const trimmed = inputValue.trim().replace(/,/g, '');
    if (!trimmed) return;

    if (!skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      onChange([...skills, trimmed]);
    }
    setInputValue('');
  };

  const removeSkill = (indexToRemove) => {
    if (disabled) return;
    const next = skills.filter((_, idx) => idx !== indexToRemove);
    onChange(next);
  };

  const suggestedSkills = ['React', 'Node.js', 'Python', 'Docker', 'AWS', 'SQL', 'TypeScript', 'Java', 'Git'];

  return (
    <div className="space-y-2">
      <div
        className={`min-h-[52px] p-2 bg-white rounded-xl border transition-all flex flex-wrap items-center gap-2 ${
          error ? 'border-rose-300 ring-2 ring-rose-50' : 'border-slate-300 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100'
        } ${disabled ? 'bg-slate-50 opacity-80 cursor-not-allowed' : ''}`}
      >
        {skills.map((skill, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 border border-brand-200 text-brand-700 text-xs font-medium rounded-lg group animate-in fade-in zoom-in duration-150"
          >
            <span>{skill}</span>
            {!disabled && (
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="text-brand-400 hover:text-brand-700 hover:bg-brand-100 p-0.5 rounded transition-colors"
                aria-label={`Remove ${skill}`}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </span>
        ))}

        {!disabled && (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={addSkill}
            placeholder={skills.length === 0 ? 'Type a skill (e.g. React, Python) and press Enter...' : 'Add another skill...'}
            className="flex-1 min-w-[180px] bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none px-2 py-1"
          />
        )}
      </div>

      {!disabled && (
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Suggestions:
            </span>
            {suggestedSkills
              .filter((s) => !skills.some((curr) => curr.toLowerCase() === s.toLowerCase()))
              .slice(0, 4)
              .map((suggestion) => (
                <button
                  type="button"
                  key={suggestion}
                  onClick={() => onChange([...skills, suggestion])}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                >
                  +{suggestion}
                </button>
              ))}
          </div>
          <span>Press Enter or comma to add</span>
        </div>
      )}

      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  );
}
