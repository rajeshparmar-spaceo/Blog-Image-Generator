import { useState } from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { fetchBlogContent, detectImageOpportunities } from '../../utils/blogAnalyzer';

const TYPE_COLORS: Record<string, string> = {
  steps:      'bg-blue-900 text-blue-200',
  comparison: 'bg-purple-900 text-purple-200',
  metrics:    'bg-emerald-900 text-emerald-200',
  benefits:   'bg-amber-900 text-amber-200',
  process:    'bg-cyan-900 text-cyan-200',
  review:     'bg-rose-900 text-rose-200',
  concept:    'bg-slate-700 text-slate-300',
};

export function InternalImagePanel() {
  const [fetchStatus, setFetchStatus] = useState('');

  const {
    blogUrl, setBlogUrl,
    blogContent, setBlogContent,
    isAnalyzing, setIsAnalyzing,
    analyzeError, setAnalyzeError,
    imageOpportunities, setImageOpportunities,
    selectedOpportunityId, setSelectedOpportunityId,
    bumpLayoutSeed,
  } = useEditorStore();

  async function handleFetch() {
    if (!blogUrl.trim()) return;
    setIsAnalyzing(true);
    setAnalyzeError('');
    setFetchStatus('Fetching…');
    setImageOpportunities([]);
    setSelectedOpportunityId('');

    const { text, error } = await fetchBlogContent(blogUrl.trim());
    setIsAnalyzing(false);
    setFetchStatus('');

    if (!text || error) {
      setAnalyzeError(error ?? 'Could not load URL. Paste the article text below instead.');
      return;
    }

    setBlogContent(text);
    setFetchStatus('');
    const opps = detectImageOpportunities(text);
    setImageOpportunities(opps);
    if (opps.length > 0) setSelectedOpportunityId(opps[0].id);
    if (opps.length === 0) setAnalyzeError('No clear image opportunities detected. Try pasting more article content.');
  }

  function handleAnalyzePasted() {
    const text = blogContent.trim();
    if (!text) return;
    setAnalyzeError('');
    bumpLayoutSeed();
    const opps = detectImageOpportunities(text);
    setImageOpportunities(opps);
    if (opps.length > 0) setSelectedOpportunityId(opps[0].id);
    if (opps.length === 0) setAnalyzeError('No clear image spots found. Make sure the text has sections, lists, or numbered steps.');
  }

  return (
    <div className="flex flex-col gap-3">

      {/* URL fetch */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Blog URL</label>
        <div className="flex gap-1.5">
          <input
            type="url"
            value={blogUrl}
            onChange={(e) => setBlogUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
            placeholder="https://yourblog.com/post"
            className="flex-1 min-w-0 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs px-2.5 py-2 placeholder-slate-600 focus:outline-none focus:border-slate-500"
          />
          <button
            onClick={handleFetch}
            disabled={isAnalyzing || !blogUrl.trim()}
            className="flex-none px-3 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white text-xs font-semibold transition-colors min-w-[52px]"
          >
            {isAnalyzing ? (
              <span className="inline-block animate-spin">↻</span>
            ) : 'Fetch'}
          </button>
        </div>
        {fetchStatus && (
          <p className="text-xs text-slate-500 animate-pulse">{fetchStatus}</p>
        )}
        <p className="text-[10px] text-slate-600 leading-snug">
          Note: some sites block external fetch. If it fails, paste the article text below.
        </p>
      </div>

      {/* OR divider */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-slate-800" />
        <span className="text-xs text-slate-600">or paste content</span>
        <div className="flex-1 h-px bg-slate-800" />
      </div>

      {/* Paste area */}
      <div className="flex flex-col gap-1.5">
        <textarea
          value={blogContent}
          onChange={(e) => setBlogContent(e.target.value)}
          rows={12}
          placeholder="Paste the full article text here…"
          className="w-full rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs px-3 py-2 placeholder-slate-600 resize-y focus:outline-none focus:border-slate-500 leading-relaxed"
        />
        <button
          onClick={handleAnalyzePasted}
          disabled={!blogContent.trim()}
          className="w-full py-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-slate-200 text-xs font-semibold transition-colors"
        >
          Analyze Content &amp; Generate
        </button>
      </div>

      {/* Error */}
      {analyzeError && (
        <p className="text-xs text-rose-400 bg-rose-950/50 rounded-lg px-3 py-2">{analyzeError}</p>
      )}

      {/* Opportunities list */}
      {imageOpportunities.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {imageOpportunities.length} Image{imageOpportunities.length > 1 ? 's' : ''} Found
          </p>
          <div className="flex flex-col gap-1.5">
            {imageOpportunities.map((opp) => (
              <button
                key={opp.id}
                onClick={() => setSelectedOpportunityId(opp.id)}
                className={[
                  'text-left rounded-lg px-3 py-2.5 border transition-all',
                  selectedOpportunityId === opp.id
                    ? 'bg-slate-700 border-violet-500'
                    : 'bg-slate-800 border-slate-700 hover:border-slate-600',
                ].join(' ')}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-400">#{opp.index}</span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${TYPE_COLORS[opp.visualType] ?? TYPE_COLORS.concept}`}>
                    {opp.reason}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium leading-snug line-clamp-2">
                  {opp.sectionTitle}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
