
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, Account, Language } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getFinancialInsights = async (
  transactions: Transaction[], 
  accounts: Account[], 
  language: Language = 'en',
  query?: string
) => {
  const ai = getAI();
  const model = "gemini-3.1-pro-preview";
  
  const context = `
    User accounts: ${JSON.stringify(accounts.map(a => ({ name: a.name, balance: a.balance, type: a.type })))}
    Recent transactions: ${JSON.stringify(transactions.slice(-10))}
    Current Language: ${language === 'hi' ? 'Hindi' : 'English'}
  `;

  const systemInstruction = `
    You are an expert financial advisor specializing in double-entry bookkeeping and wealth management. 
    Be concise and professional. 
    Always respond in the specified language: ${language === 'hi' ? 'Hindi' : 'English'}.
    Focus on the accounting equation Assets = Liabilities + Equity.
  `;

  const prompt = query 
    ? `Context: ${context}. Question: ${query}.`
    : `Context: ${context}. Analyze these financial records and provide 3 actionable insights to improve financial health.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        temperature: 0.7,
        systemInstruction
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Insights Error:", error);
    return "Sorry, I couldn't perform the analysis right now.";
  }
};

export const scanReceipt = async (base64Image: string, language: Language = 'en') => {
  const ai = getAI();
  const model = "gemini-3.1-pro-preview";
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: `Extract transaction details from this receipt: Date, Merchant, Total Amount, Currency. Return as JSON. Language: ${language === 'hi' ? 'Hindi' : 'English'}.` }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            merchant: { type: Type.STRING },
            amount: { type: Type.NUMBER },
            date: { type: Type.STRING },
            currency: { type: Type.STRING }
          },
          required: ["merchant", "amount", "date"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("OCR Scanning Error:", error);
    return null;
  }
};
