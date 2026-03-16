import { useEditorStore } from '../../store/useEditorStore';

export function SourceContentInput() {
  const { sourceContent, setSourceContent } = useEditorStore();

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
        Article Content
        <span className="ml-1 text-slate-600 normal-case font-normal">(paste for smart illustration)</span>
      </label>
      <textarea
        value={sourceContent}
        onChange={(e) => setSourceContent(e.target.value)}
        rows={5}
        placeholder={
          'Paste your article text, blog post, or key points here.\n\nThe tool will detect the topic and generate the right visual — steps, comparison, metrics, etc.'
        }
        className="w-full rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs px-3 py-2 placeholder-slate-600 resize-none focus:outline-none focus:border-slate-500 leading-relaxed"
      />
      {sourceContent.trim() && (
        <button
          onClick={() => setSourceContent('')}
          className="self-end text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  );
}
