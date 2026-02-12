import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

// Using process.env.API_KEY as the Google GenAI Key container
const API_KEY = process.env.API_KEY || '';

// Initialize client only if key exists to avoid immediate crash, handle error in call
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export const streamLegalResponse = async (
  messages: { role: string; content: string }[],
  onChunk: (text: string) => void,
  contextFiles?: { data: string, mimeType: string }[]
) => {
  try {
    if (!ai) {
      throw new Error("API_KEY_MISSING");
    }

    // 1. Convert app messages to Gemini Content format
    // App uses 'model'/'user', Gemini uses 'model'/'user'
    const contents = messages.map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.content }] as { text?: string; inlineData?: { mimeType: string; data: string } }[]
    }));

    // 2. Handle Multimodal (Images/Files)
    // If there are context files, attach them to the LAST message (which should be the current user prompt)
    if (contextFiles && contextFiles.length > 0) {
      const lastMsgIndex = contents.length - 1;
      const lastMsg = contents[lastMsgIndex];
      
      if (lastMsg.role === 'user') {
        const fileParts = contextFiles.map(file => ({
          inlineData: {
            mimeType: file.mimeType,
            data: file.data
          }
        }));
        // Attach files before the text prompt to provide context first
        lastMsg.parts = [...fileParts, ...lastMsg.parts];
      }
    }

    // 3. Call Gemini API (Streaming)
    // Using gemini-3-pro-preview for complex legal reasoning and high-quality generation
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3-pro-preview',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.5, // Lower temperature for more precise legal reasoning
        topK: 40,
        topP: 0.95,
      }
    });

    // 4. Handle Stream
    for await (const chunk of responseStream) {
      if (chunk.text) {
        onChunk(chunk.text);
      }
    }

  } catch (error: any) {
    console.error("Gemini Service Error:", error);
    
    let errorMessage = "\n\n[ERRO CRÍTICO]: Conexão com o Motor Jurídico interrompida.";
    
    if (error.message === "API_KEY_MISSING") {
      errorMessage = "\n\n⚠️ **CONFIGURAÇÃO PENDENTE**: A Chave de API do Google (Gemini) não foi configurada no servidor de hospedagem. Por favor, adicione a variável de ambiente 'API_KEY' nas configurações do seu provedor (Vercel/Netlify).";
    } else if (error.message?.includes("429")) {
      errorMessage = "\n\n⏳ **LIMITE ATINGIDO**: O sistema está com muitas requisições no momento. Tente novamente em alguns segundos.";
    }

    onChunk(errorMessage);
  }
};