
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, Account } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialInsights = async (
  transactions: Transaction[], 
  accounts: Account[], 
  query?: string
) => {
  const ai = getAI();
  const context = `
    User accounts: ${JSON.stringify(accounts.map(a => ({ name: a.name, balance: a.balance, type: a.type })))}
    Recent transactions: ${JSON.stringify(transactions.slice(-10))}
    Current Locale: English
  `;

  const prompt = query 
    ? `Context: ${context}. Question: ${query}. Please provide advice in English.`
    : `Context: ${context}. Analyze these financial records and provide 3 actionable insights to improve financial health in English. Focus on the accounting equation Assets = Liabilities + Equity.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        systemInstruction: "You are an expert financial advisor specializing in double-entry bookkeeping and wealth management. Be concise and professional."
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Insights Error:", error);
    return "Sorry, I couldn't perform the analysis right now.";
  }
};

export const scanReceipt = async (base64Image: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: "Extract transaction details from this receipt: Date, Merchant, Total Amount, Currency. Return as JSON." }
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
