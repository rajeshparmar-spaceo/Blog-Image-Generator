import { useRef, useCallback, type DragEvent } from 'react';
import { useEditorStore } from '../../store/useEditorStore';

export function StockImageDropzone() {
  const { stockImage, setStockImage } = useEditorStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => setStockImage(img);
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, [setStockImage]);

  const onDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) loadFile(file);
  }, [loadFile]);

  const onDragOver = (e: DragEvent) => e.preventDefault();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
    e.target.value = '';
  };

  return (
    <section>
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
        Stock Photo
      </label>

      {stockImage ? (
        <div className="relative">
          <img
            src={stockImage.src}
            alt="Stock photo preview"
            className="w-full h-20 object-cover rounded-lg"
          />
          <button
            onClick={() => setStockImage(null)}
            className="absolute top-1.5 right-1.5 w-6 h-6 flex items-center justify-center bg-slate-900/80 text-slate-300 hover:text-white rounded-full text-xs transition-colors"
          >
            ×
          </button>
          <button
            onClick={() => inputRef.current?.click()}
            className="mt-1.5 w-full text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            Replace photo
          </button>
        </div>
      ) : (
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-slate-700 hover:border-slate-500 rounded-lg p-4 flex flex-col items-center gap-1.5 cursor-pointer transition-colors group"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-slate-700 flex items-center justify-center transition-colors">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-xs text-slate-400 text-center">
            Drop photo here<br />
            <span className="text-slate-500">or click to browse</span>
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />
    </section>
  );
}
