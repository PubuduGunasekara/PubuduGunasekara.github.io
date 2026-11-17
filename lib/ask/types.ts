export type ChunkKind =
  | 'faq'
  | 'about'
  | 'education'
  | 'experience'
  | 'skills'
  | 'project'
  | 'case-study'
  | 'leadership'
  | 'certification'
  | 'story'
  | 'contact';

export type Source = { label: string; href: string };

export type Chunk = {
  id: string;
  kind: ChunkKind;
  title: string;
  text: string;
  href: string;
  // FAQ chunks only
  question?: string;
  answer?: string[];
  sources?: Source[];
  chip?: boolean;
  // regex source: this curated answer is only shown for questions that match it
  cue?: string;
  // FAQ chunks only: grouping for the browse list, whether to list it there, and curated follow-ups (chunk ids)
  category?: string;
  browse?: boolean;
  next?: string[];
};

export type AskTech = {
  name: string;
  category: string | null;
  aliases: string[]; // already normalized (see normalize in search.ts)
  usedIn: Source[];
  members?: string[]; // for broad terms such as "Cloud": the specific technologies it covers
};

export type Suggestion = { id: string; question: string };

export type AskMeta = {
  email: string;
  resumeHref: string;
  linkedin: string;
  github: string;
};

export type AskIndex = {
  version: number;
  model: string;
  dims: number;
  hash: string;
  meta: AskMeta;
  chips: string[]; // curated question ids shown as one-click suggestions, in order
  categories: string[]; // order of the groups in the browse list
  chunks: Chunk[];
  techs: AskTech[];
  // alternate phrasings of each curated question; each one is embedded separately and points at its FAQ chunk
  aliases: { chunk: number; text: string }[];
  // base64 of an Int8Array: one row per chunk, then one row per alias (each dims wide), unit vectors scaled
  // by 127; null when embedding was unavailable
  embeddings: string | null;
};

export type SearchMode = 'meaning and keywords' | 'keywords only' | 'curated';

export type Passage = { chunk: Chunk; snippet: string };

export type AskResult =
  | { type: 'faq'; faq: Chunk; mode: SearchMode }
  | { type: 'passages'; passages: Passage[]; mode: SearchMode }
  | { type: 'tech'; techs: AskTech[]; mode: SearchMode }
  | { type: 'notListed'; term: string }
  | { type: 'scope'; message: string }
  | { type: 'none' };
