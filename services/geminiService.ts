import { GoogleGenAI, Type } from "@google/genai";
import { Product, AIRecommendation } from '../types';

// Helper to safely get API key without crashing if process is undefined
const getApiKey = () => {
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    return process.env.API_KEY;
  }
  return '';
};

// Lazy initialization of the AI client
let aiClient: GoogleGenAI | null = null;

const getAI = (): GoogleGenAI => {
  if (!aiClient) {
    const apiKey = getApiKey();
    // Initialize with the key. If key is empty, the SDK might behave differently,
    // but doing it here prevents top-level module crash.
    aiClient = new GoogleGenAI({ apiKey: apiKey });
  }
  return aiClient;
};

export const getProductRecommendations = async (
  userQuery: string,
  allProducts: Product[],
  lang: 'ru' | 'tj' = 'ru'
): Promise<AIRecommendation> => {
  try {
    const catalogSummary = allProducts.map(p => 
      `ID: ${p.id}, Name: ${p.name}, Category: ${p.category}, Price: ${p.price} TJS, Desc: ${p.description}, Colors: ${p.colors.join(',')}`
    ).join('\n');

    const prompt = `
      You are a professional fashion stylist and assistant for "Grand Market Fashion".
      Current language: ${lang === 'ru' ? 'Russian' : 'Tajik'}.
      
      User Query: "${userQuery}"
      
      Product Catalog:
      ${catalogSummary}
      
      Task:
      1. Analyze the user's style request.
      2. Select matching products.
      3. Write a polite, helpful, and stylish response in ${lang === 'ru' ? 'Russian' : 'Tajik'}.
      4. If the user asks for advice (e.g., "what to wear to a wedding"), suggest a full outfit from available items.
      
      Return JSON.
    `;

    // Use the lazy getter
    const ai = getAI();

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            message: {
              type: Type.STRING,
              description: "Fashion advice and explanation."
            },
            productIds: {
              type: Type.ARRAY,
              items: { type: Type.NUMBER },
              description: "Matching product IDs."
            }
          },
          required: ["message", "productIds"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as AIRecommendation;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      message: lang === 'ru' 
        ? "Извините, сейчас я не могу подключиться к серверу моды. Посмотрите наши новинки!" 
        : "Бахшиш, ҳоло ман ба сервер пайваст шуда наметавонам. Навиҳои моро бубинед!",
      productIds: [] 
    };
  }
};