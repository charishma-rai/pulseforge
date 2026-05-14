/**
 * PulseForge Secure AI Client
 * Refactored to use internal Vercel API proxy for secret protection.
 */

export const askGemini = async (prompt, history = null) => {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, history }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'AI Request failed');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('[GeminiClient] Error:', error);
    throw error;
  }
};

// Legacy compatibility stub
export const genAI = {
  getGenerativeModel: () => ({
    generateContent: async (prompt) => {
      const text = await askGemini(prompt);
      return { response: { text: () => text } };
    }
  })
};
