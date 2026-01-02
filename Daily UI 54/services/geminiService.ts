
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function generateConfirmationMessage(scenario: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a clear, high-stakes confirmation dialog content for the following scenario: "${scenario}". 
      Return a title (max 5 words) and a descriptive message (max 20 words) that emphasizes clarity and impact.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            message: { type: Type.STRING },
          },
          required: ["title", "message"],
        },
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      title: "Are you sure?",
      message: "Please confirm your action to proceed.",
    };
  }
}
