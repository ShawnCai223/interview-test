import { VoiceEntry, ProcessedResult } from './types'

/**
 * processEntries
 * --------------
 * PURE function — no IO, no mutation, deterministic.
 */

const stopwords = [
  'the', 'to', 'and', 'a', 'of', 'in', 'for', 'on', 'with', 'at', 'by',
  'an', 'be', 'is', 'are', 'was', 'were', 'do', 'does', 'did', 'this',
  'that', 'it', 'as', 'from', 'or', 'have', 'has', 'had', 'i', 'you',
  'he', 'she', 'we', 'they', 'them', 'me', 'my', 'your', 'our', 'their',
  'will', 'would', 'can', 'could', 'should', 'shall', 'may', 'might', 'must'
];

/**
 * Extract due date from English phrases
 */
function extractDueDate(text: string): string | undefined {
  const lower = text.toLowerCase();
  if (lower.includes('tomorrow')) return 'tomorrow';
  if (lower.includes('today')) return 'today';
  if (lower.includes('next week')) return 'next week';
  if (lower.includes('friday')) return 'friday';
  if (lower.includes('end of month')) return 'end of month';
  return undefined;
}

/**
 * Extract a task from transcript if actionable intent is found
 */
function extractTask(transcript: string): { task_text: string; due_date?: string; status: 'todo' } | null {
  const patterns = [
    /(need to\s.+?)(\.|$)/i,
    /(have to\s.+?)(\.|$)/i,
    /(remember to\s.+?)(\.|$)/i,
    /(don't forget to\s.+?)(\.|$)/i,
    /(should\s.+?)(\.|$)/i,
    /(must\s.+?)(\.|$)/i,
    /(schedule\s.+?)(\.|$)/i,
    /(email\s.+?)(\.|$)/i,
    /(call\s.+?)(\.|$)/i,
  ];

  for (const pattern of patterns) {
    const match = transcript.match(pattern);
    if (match) {
      const taskText = match[1].trim();
      return {
        task_text: taskText,
        due_date: extractDueDate(taskText),
        status: 'todo',
      };
    }
  }
  return null;
}

/**
 * Extract keyword tokens from task text
 */
function extractKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')     // remove punctuation
    .split(/\s+/)                 // split by whitespace
    .filter(word => word && !stopwords.includes(word));
}



export function processEntries(entries: VoiceEntry[]): ProcessedResult {
  const tagFrequencies: Record<string, number> = {}
  const tasks: { task_text: string; due_date?: string; status: 'todo' }[] = [];
  const keywordMap = new Map<string, number>();

  for (const e of entries) {
    for (const tag of e.tags_user) {
      tagFrequencies[tag] = (tagFrequencies[tag] || 0) + 1
    }
    const transcript = e.transcript_user || e.transcript_raw || '';
    const task = extractTask(transcript);
    if (task) {
      tasks.push(task);

      const keywords = extractKeywords(task.task_text);
      for (const word of keywords) {
        keywordMap.set(word, (keywordMap.get(word) || 0) + 1);
      }
    }
  }

  const topKeywords = [...keywordMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([keyword, count]) => ({ keyword, count }));

  return {
    summary: `Processed ${entries.length} entries`,
    tagFrequencies,
    tasks,
    topKeywords,
  }
}

export default processEntries 