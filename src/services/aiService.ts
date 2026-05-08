import { GoogleGenAI, Type } from "@google/genai";
import { CheckMetadata } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeCheckImages(frontBase64: string, backBase64: string): Promise<CheckMetadata> {
  const result = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            text: `Analyze these two images (Front and Back of a standard US Bank Check). 
            Perform the following tasks:
            1. Extract MICR line data (Routing, Account, Check Number).
            2. Extract the Courtesy Amount (digits) and Legal Amount (handwritten words).
            3. Verify if a signature is present and compare it against standard patterns for validity.
            4. Check the back for the endorsement "For Mobile Deposit Only".
            5. Extract date and payee.
            
            Return the data in the specified JSON schema.`
          },
          {
            inlineData: {
              data: frontBase64.split(',')[1] || frontBase64,
              mimeType: "image/jpeg"
            }
          },
          {
            inlineData: {
              data: backBase64.split(',')[1] || backBase64,
              mimeType: "image/jpeg"
            }
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          routingNumber: { type: Type.STRING },
          accountNumber: { type: Type.STRING },
          checkNumber: { type: Type.STRING },
          amount: { type: Type.NUMBER },
          legalAmountText: { type: Type.STRING },
          payee: { type: Type.STRING },
          date: { type: Type.STRING },
          signatureVerified: { type: Type.BOOLEAN },
          endorsementDetected: { type: Type.BOOLEAN },
          duplicateDetected: { type: Type.BOOLEAN }
        },
        required: ["routingNumber", "accountNumber", "checkNumber", "amount", "signatureVerified", "endorsementDetected"]
      }
    }
  });

  try {
    return JSON.parse(result.text || "{}") as CheckMetadata;
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    throw new Error("AI analysis failed to generate valid data.");
  }
}
