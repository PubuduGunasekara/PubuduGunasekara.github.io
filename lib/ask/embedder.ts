// Loads the embedding model in the browser, on demand. Nothing here runs on the server or at page load.
// The model files (about 35 MB, cached by the browser after the first visit) come from huggingface.co and
// the WebAssembly runtime from cdn.jsdelivr.net. The question itself never leaves the browser.

import { QUERY_PREFIX, type QueryVectors } from './search';

type Extractor = (
  input: string[],
  opts: { pooling: 'cls'; normalize: boolean },
) => Promise<{ data: Float32Array; dims: number[] }>;

type ProgressInfo = { status: string; file?: string; loaded?: number; total?: number };

let loading: Promise<Extractor> | null = null;

export function loadEmbedder(model: string, onProgress: (percent: number) => void): Promise<void> {
  if (!loading) {
    loading = (async () => {
      const { pipeline, env } = await import('@huggingface/transformers');
      env.allowLocalModels = false;
      const files = new Map<string, { loaded: number; total: number }>();
      const extractor = await pipeline('feature-extraction', model, {
        dtype: 'q8',
        progress_callback: (info: ProgressInfo) => {
          if (info.status !== 'progress' || !info.file || !info.total) return;
          files.set(info.file, { loaded: info.loaded ?? 0, total: info.total });
          let loaded = 0;
          let total = 0;
          for (const f of files.values()) {
            loaded += f.loaded;
            total += f.total;
          }
          onProgress(total > 0 ? Math.min(99, Math.round((100 * loaded) / total)) : 0);
        },
      });
      return extractor as unknown as Extractor;
    })();
    loading.catch(() => {
      loading = null;
    });
  }
  return loading.then(() => undefined);
}

export async function embedQuestion(question: string, dims: number): Promise<QueryVectors> {
  if (!loading) throw new Error('Embedder is not loaded');
  const extractor = await loading;
  const out = await extractor([QUERY_PREFIX + question, question], { pooling: 'cls', normalize: true });
  const all = Float32Array.from(out.data);
  return { prefixed: all.slice(0, dims), plain: all.slice(dims, dims * 2) };
}
