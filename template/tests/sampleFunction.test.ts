// eslint-disable-next-line import/no-extraneous-dependencies
// ts-expect-error vitest types are provided via tsconfig "types"
import { describe, it, expect } from 'vitest'
import { mockVoiceEntries } from '../src/lib/mockData.js'
import processEntries from '../src/lib/sampleFunction.js'

describe('processEntries', () => {
  it('counts reflection tag correctly', () => {
    const result = processEntries(mockVoiceEntries)
    expect(result.tagFrequencies.reflection).toBe(mockVoiceEntries.length)
  })

  it('extracts tasks and keywords from custom actionable entries', () => {
    const mockActionableEntries = [
      {
        id: '1',
        user_id: 'test',
        audio_url: null,
        transcript_raw: '',
        transcript_user: 'I need to send the report to Alice tomorrow.',
        language_detected: 'en',
        language_rendered: 'en',
        tags_model: [],
        tags_user: [],
        category: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        emotion_score_score: null,
        embedding: null,
      },
      {
        id: '2',
        user_id: 'test',
        audio_url: null,
        transcript_raw: '',
        transcript_user: 'Remember to schedule a call with Bob.',
        language_detected: 'en',
        language_rendered: 'en',
        tags_model: [],
        tags_user: [],
        category: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        emotion_score_score: null,
        embedding: null,
      },
    ]

    const result = processEntries(mockActionableEntries)

    expect(result.tasks?.length).toBeGreaterThan(0)
    for (const task of result.tasks!) {
      expect(task.task_text).toBeDefined()
      expect(task.status).toBe('todo')
    }

    expect(result.topKeywords?.length).toBeGreaterThan(0)
    for (const kw of result.topKeywords!) {
      expect(typeof kw.keyword).toBe('string')
      expect(kw.count).toBeGreaterThan(0)
    }
  })

  it('returns summary with correct format', () => {
    const result = processEntries(mockVoiceEntries.slice(0, 10))
    expect(typeof result.summary).toBe('string')
    expect(result.summary).toMatch(/Processed \d+ entries/)
  })
})