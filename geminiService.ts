
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "./types";

const SYSTEM_PROMPT = `You are the "Nuskha-Verify Scholar," a multimodal expert in both modern Clinical Medicine (Pharmacology/Internal Medicine) and Indian Traditional Knowledge Systems (Ayurveda, Unani, and Siddha). Your goal is to analyze viral health claims from videos/images with high precision and zero hallucination.

Multimodal Analysis Instructions:
1. Visual Processing: Identify specific ingredients, preparation methods, and dosage forms.
2. Audio/Text Transcription: Extract exact health claims, flagging "miracle" or "cure" language.

Response Structure:
Return a JSON object strictly matching this schema:
{
  "ingredients": {
    "identified": ["list of strings"],
    "visualEvidence": "description of what confirmed these"
  },
  "claim": "Summary of the viral claim",
  "realityCheck": {
    "traditionalPerspective": "What classical texts like Charaka Samhita say",
    "modernScientificView": "Clinical trial data or medical consensus (use Google Search)",
    "theGap": "Where the viral content exaggerates"
  },
  "verdict": {
    "safetyRating": "SAFE" | "USE CAUTION" | "DANGEROUS",
    "riskLevel": "Explanation of risks"
  },
  "multilingualSummary": {
    "english": "2-sentence summary",
    "local": "2-sentence summary in a local Indian language relevant to the content"
  }
}

Constraint: Always include: "This is a safety verification, not a prescription. Consult a doctor before trying any remedy."
Tone: Respectful to tradition, firm on scientific facts.`;

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const analyzeClaim = async (
  fileData: { base64: string; mimeType: string },
  retryCount = 0
): Promise<AnalysisResult> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: fileData.base64,
              mimeType: fileData.mimeType,
            },
          },
          {
            text: "Analyze this health remedy/claim. Use Google Search to find scientific evidence for or against it.",
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        tools: [{ googleSearch: {} }],
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ingredients: {
              type: Type.OBJECT,
              properties: {
                identified: { type: Type.ARRAY, items: { type: Type.STRING } },
                visualEvidence: { type: Type.STRING },
              },
              required: ["identified", "visualEvidence"],
            },
            claim: { type: Type.STRING },
            realityCheck: {
              type: Type.OBJECT,
              properties: {
                traditionalPerspective: { type: Type.STRING },
                modernScientificView: { type: Type.STRING },
                theGap: { type: Type.STRING },
              },
              required: ["traditionalPerspective", "modernScientificView", "theGap"],
            },
            verdict: {
              type: Type.OBJECT,
              properties: {
                safetyRating: { type: Type.STRING, enum: ["SAFE", "USE CAUTION", "DANGEROUS"] },
                riskLevel: { type: Type.STRING },
              },
              required: ["safetyRating", "riskLevel"],
            },
            multilingualSummary: {
              type: Type.OBJECT,
              properties: {
                english: { type: Type.STRING },
                local: { type: Type.STRING },
              },
              required: ["english", "local"],
            },
          },
          required: ["ingredients", "claim", "realityCheck", "verdict", "multilingualSummary"],
        },
      },
    });

    const result = JSON.parse(response.text || '{}') as AnalysisResult;
    
    // Extract grounding sources
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.searchEntryPoint?.renderedContent;
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
      result.groundingSources = chunks
        .filter(c => c.web)
        .map(c => ({
          title: c.web?.title || "Search Result",
          uri: c.web?.uri || ""
        }));
    }

    return result;
  } catch (error) {
    if (retryCount < 5) {
      const delay = Math.pow(2, retryCount) * 1000;
      console.warn(`API Error, retrying in ${delay}ms...`, error);
      await wait(delay);
      return analyzeClaim(fileData, retryCount + 1);
    }
    throw error;
  }
};
