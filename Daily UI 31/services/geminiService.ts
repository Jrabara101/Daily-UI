import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize Gemini
// Note: process.env.API_KEY is injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result as string;
      const base64Content = base64Data.split(',')[1];
      resolve({
        inlineData: {
          data: base64Content,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeSpectralEntity = async (file: File): Promise<string> => {
  try {
    const modelId = file.type.startsWith('image/') ? 'gemini-2.5-flash-image' : 'gemini-2.5-flash';
    
    // Convert file to compatible part
    const filePart = await fileToGenerativePart(file);

    const prompt = `
      You are a P.K.E. (Psychokinetic Energy) Meter looking at a contained digital entity (file).
      
      1. If it is an image, describe what "paranormal" (or normal) objects you see in a scientific, slightly sci-fi Ghostbusters-esque tone.
      2. If it is text, summarize the "ectoplasmic resonance" (content) briefly.
      
      Keep it short (max 2 sentences), fun, and thematic.
      Example: "Class 5 Full Roaming Vapor detected. It appears to be a receipt for coffee."
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          filePart,
          { text: prompt }
        ]
      },
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "Entity manifested no discernible traits.";
  } catch (error) {
    console.error("PKE Meter Malfunction:", error);
    return "PKE Meter interference detected. Analysis failed.";
  }
};