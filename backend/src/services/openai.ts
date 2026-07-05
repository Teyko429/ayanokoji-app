import OpenAI from 'openai';
import { SYSTEM_PROMPTS } from './prompts';

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

export async function getChatResponse(
  message: string,
  type: keyof typeof SYSTEM_PROMPTS
): Promise<string> {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPTS[type] },
      { role: 'user', content: message },
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  return completion.choices[0]?.message?.content || '...';
}

export async function getChessMove(fen: string): Promise<string> {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: "Tu es un moteur d'échecs. On te donne une position au format FEN. Réponds UNIQUEMENT avec le meilleur coup au format UCI (exemple : e2e4, g8f6, e7e8q pour une promotion). Aucune explication, aucun texte, juste le coup.",
      },
      { role: 'user', content: fen },
    ],
    temperature: 0.3,
    max_tokens: 10,
  })
  return completion.choices[0]?.message?.content?.trim() || ''
}

