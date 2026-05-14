const { GoogleGenerativeAI } = require("@google-generative-ai/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { headers, samples, type } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const targetSchema = type === 'students' 
      ? "full_name, usn, branch, year, section"
      : "usn, status, date, session_id";

    const prompt = `
      You are an AI data engineer for PulseForge, a mentor management platform.
      A mentor is uploading a ${type} file. I have extracted the headers and some sample rows.
      
      UPLOADED HEADERS:
      ${JSON.stringify(headers)}

      SAMPLE DATA:
      ${JSON.stringify(samples)}

      TARGET SYSTEM SCHEMA:
      ${targetSchema}

      TASK:
      Map the uploaded headers to the target schema fields. 
      Return ONLY a JSON object where keys are target fields and values are the corresponding uploaded header names.
      If a field cannot be mapped, omit it.
      
      JSON FORMAT ONLY:
      {
        "target_field": "uploaded_header"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean JSON from markdown if needed
    const jsonStr = text.replace(/```json|```/gi, '').trim();
    const mapping = JSON.parse(jsonStr);

    return res.status(200).json(mapping);
  } catch (error) {
    console.error('[AI Ingest] Error:', error);
    return res.status(500).json({ message: 'AI Mapping failed', error: error.message });
  }
}
