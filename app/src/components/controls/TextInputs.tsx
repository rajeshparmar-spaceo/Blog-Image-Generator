import { useEditorStore } from '../../store/useEditorStore';
function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

export function TextInputs() {
  const {
    brandId, variant,
    headline, setHeadline,
    subtitle, setSubtitle,
    stepItems, setStepItems,
    chatLines, setChatLines,
    titleColor, setTitleColor,
    subtitleColor, setSubtitleColor,
  } = useEditorStore();

  const showStepList = (variant === 'typeD' && (brandId === 'soc' || brandId === 'soa' || brandId === 'soi' || brandId === 'mcb')) ||
    (brandId === 'contentbridge' && variant === 'typeE');
  const showChatLines = brandId === 'welco' && (variant === 'typeA1' || variant === 'typeA2');

  return (
    <section className="flex flex-col gap-3">
      {/* Headline */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Headline
          </label>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500">Color</span>
            <input
              type="color"
              value={titleColor}
              onChange={(e) => setTitleColor(e.target.value)}
              className="w-7 h-7 rounded cursor-pointer border border-slate-600 bg-transparent p-0.5"
              title="Headline color"
            />
          </div>
        </div>
        <textarea
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          rows={2}
          className="w-full bg-slate-800 text-slate-100 text-sm rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-blue-500 resize-none"
          placeholder="Enter blog headline…"
        />
      </div>

      {/* Subtitle */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Subtitle
          </label>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500">Color</span>
            <input
              type="color"
              value={subtitleColor}
              onChange={(e) => setSubtitleColor(e.target.value)}
              className="w-7 h-7 rounded cursor-pointer border border-slate-600 bg-transparent p-0.5"
              title="Subtitle color"
            />
          </div>
        </div>
        <textarea
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          rows={2}
          className="w-full bg-slate-800 text-slate-100 text-sm rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-blue-500 resize-none"
          placeholder="Enter subtitle…"
        />
      </div>

      {/* Step list */}
      {showStepList && (
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Feature List
          </label>
          <div className="flex flex-col gap-1.5">
            {stepItems.map((item, i) => (
              <div key={i} className="flex gap-1.5">
                <span className="flex-none w-5 h-7 flex items-center justify-center text-xs text-slate-500">{i + 1}</span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const next = [...stepItems];
                    next[i] = e.target.value;
                    setStepItems(next);
                  }}
                  className="flex-1 bg-slate-800 text-slate-100 text-xs rounded-md px-2.5 py-1.5 border border-slate-700 focus:outline-none focus:border-blue-500"
                  placeholder={`Feature ${i + 1}`}
                />
                <button
                  onClick={() => setStepItems(stepItems.filter((_, j) => j !== i))}
                  className="flex-none w-7 h-7 flex items-center justify-center text-slate-500 hover:text-red-400 rounded-md hover:bg-slate-700 transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
            {stepItems.length < 6 && (
              <button
                onClick={() => setStepItems([...stepItems, ''])}
                className="text-xs text-slate-400 hover:text-slate-200 py-1 text-left pl-6 transition-colors"
              >
                + Add item
              </button>
            )}
          </div>
        </div>
      )}

      {/* Chat lines */}
      {showChatLines && (
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Chat Conversation
          </label>
          <div className="flex flex-col gap-1.5">
            {chatLines.map((line, i) => (
              <div key={line.id} className="flex gap-1.5 items-start">
                <button
                  onClick={() => {
                    const next = [...chatLines];
                    next[i] = { ...line, speaker: line.speaker === 'agent' ? 'caller' : 'agent' };
                    setChatLines(next);
                  }}
                  className={`
                    flex-none mt-1 text-xs px-1.5 py-0.5 rounded font-medium transition-colors
                    ${line.speaker === 'agent'
                      ? 'bg-blue-600/30 text-blue-300 hover:bg-blue-600/50'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }
                  `}
                  title="Click to toggle speaker"
                >
                  {line.speaker === 'agent' ? 'Agt' : 'Cal'}
                </button>
                <input
                  type="text"
                  value={line.text}
                  onChange={(e) => {
                    const next = [...chatLines];
                    next[i] = { ...line, text: e.target.value };
                    setChatLines(next);
                  }}
                  className="flex-1 bg-slate-800 text-slate-100 text-xs rounded-md px-2.5 py-1.5 border border-slate-700 focus:outline-none focus:border-blue-500"
                  placeholder="Message text…"
                />
                <button
                  onClick={() => setChatLines(chatLines.filter((_, j) => j !== i))}
                  className="flex-none w-7 h-7 flex items-center justify-center text-slate-500 hover:text-red-400 rounded-md hover:bg-slate-700 mt-0.5"
                >
                  ×
                </button>
              </div>
            ))}
            {chatLines.length < 5 && (
              <button
                onClick={() => setChatLines([...chatLines, { id: generateId(), speaker: 'caller', text: '' }])}
                className="text-xs text-slate-400 hover:text-slate-200 py-1 text-left pl-6 transition-colors"
              >
                + Add message
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
