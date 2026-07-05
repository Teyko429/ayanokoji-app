import { Router, Request, Response } from 'express';
import { getChatResponse, getChessMove } from '../services/openai';
import { ChatRequest } from '../types';

const router = Router();

router.post('/chat', async (req: Request, res: Response) => {
  const { message, type } = req.body as ChatRequest;

  if (!message || !type) {
    return res.status(400).json({ error: 'Missing message or type' });
  }

  try {
    const reply = await getChatResponse(message, type);
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get response' });
  }
});
router.post('/scenario', async (req: Request, res: Response) => {
  const { type } = req.body;
  if (!type) return res.status(400).json({ error: 'Missing type' });

  try {
    const scenario = await getChatResponse(
      "Génère un SEUL scénario de mise en situation courte (3-4 phrases maximum) où quelqu'un essaie d'utiliser une technique de manipulation ou de psychologie sur l'utilisateur. Termine par une question directe du type 'Comment réagis-tu ?'. Ne donne aucune analyse, juste le scénario.",
      type
    );
    res.json({ scenario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate scenario' });
  }
});

router.post('/scenario/evaluate', async (req: Request, res: Response) => {
  const { type, scenario, userResponse } = req.body;
  if (!type || !scenario || !userResponse) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const evaluation = await getChatResponse(
      `Voici un scénario : "${scenario}"\n\nRéponse de l'utilisateur : "${userResponse}"\n\nÉvalue sa réaction : points forts, points faibles, et ce qu'un expert aurait fait de mieux. Sois direct et constructif.`,
      type
    );
    res.json({ evaluation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to evaluate response' });
  }
});
router.post('/chess-move', async (req: Request, res: Response) => {
  const { fen } = req.body;
  if (!fen) return res.status(400).json({ error: 'Missing fen' });
  try {
    const move = await getChessMove(fen);
    res.json({ move });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get move' });
  }
});

export default router;
