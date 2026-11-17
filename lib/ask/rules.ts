// Questions the site deliberately does not answer. These are checked before any search.
export const scopeRules: { pattern: RegExp; message: string }[] = [
  {
    pattern: /\b(visa|sponsor(ship)?|work (authori[sz]ation|permit|eligibility)|authori[sz]ed to work|legally (able|allowed) to work|citizen(ship)?|green card|h-?1b|immigration|cpt|opt)\b/i,
    message: 'Work authorization is not covered on this site, so I would rather not guess. Please ask me directly by email.',
  },
  {
    pattern: /\b(salary|salaries|compensation|hourly rate|pay (range|expectation|rate)|expected pay|how much (do|would) you (want|expect|charge))\b/i,
    message: 'I have not put pay expectations on this site. Please ask me directly by email.',
  },
  {
    pattern: /\b(phone number|your number|call you|cell number|whatsapp|home address|street address|date of birth|how old are you|marital status|religion)\b/i,
    message: 'I keep personal details like that off this site. Email is the best way to reach me.',
  },
  {
    pattern: /\b(remote(ly)?|hybrid|on-?site|in-?office|work from home|wfh|commute|relocation (package|assistance))\b/i,
    message: 'This site does not cover work arrangements. What I can say is that I am open to relocation and targeting the Bay Area for Summer 2027. Please ask me directly by email for anything more specific.',
  },
  {
    pattern: /^(please |can you |could you |would you |will you )?(write|generate|debug|fix|translate|summari[sz]e)\b[^.?!]{0,30}\b(code|program|script|essay|poem|story|email|cover letter)\b/i,
    message: 'I can only answer questions about Pubudu using what is on this site, so I cannot write or review code or other content.',
  },
];

export const fallbackMessage =
  'I do not have a good answer to that on this site. Try one of the suggested questions, or email me and I will reply.';
