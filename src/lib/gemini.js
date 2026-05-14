import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY

if (!apiKey) {
  console.warn(
    '[PulseForge] Gemini API key is missing.\n' +
    'Add VITE_GEMINI_API_KEY to your .env.local file.'
  )
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null

/**
 * Get a Gemini model instance.
 * @param {string} modelName - Default: 'gemini-2.0-flash'
 */
export function getGeminiModel(modelName = 'gemini-2.0-flash') {
  if (!genAI) {
    throw new Error('Gemini AI is not initialized. Check your VITE_GEMINI_API_KEY.')
  }
  return genAI.getGenerativeModel({ model: modelName })
}

/**
 * Generate structured JSON content via Gemini.
 * Returns parsed JSON or null on failure.
 */
export async function generateStructuredContent(prompt, schema) {
  const model = getGeminiModel()
  const fullPrompt = schema
    ? `${prompt}\n\nRespond ONLY with valid JSON matching this schema:\n${JSON.stringify(schema, null, 2)}`
    : prompt

  try {
    const result = await model.generateContent(fullPrompt)
    const text = result.response.text()
    // Strip markdown code fences if present
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(cleaned)
  } catch (err) {
    console.error('[Gemini] generateStructuredContent error:', err)
    return null
  }
}

export { genAI }
