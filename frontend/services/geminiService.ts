import { GoogleGenAI } from "@google/genai";


const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export const getTradeAdvice = async (
  query: string,
  context?: any
): Promise<string> => {
  try {
    const contextString = context
      ? `Trade context: ${context.productName}, HS ${context.hsCode},
         from ${context.originCountry} to ${context.destinationCountry}`
      : "";

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `${contextString}\nUser Query: ${query}`,
    });

    return response.text;
  } catch (error) {
    console.error(error);
    return "AI service unavailable.";
  }
};
