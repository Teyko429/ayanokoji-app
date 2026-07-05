import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

const EXERCISES = {
  manipulation: [
    { q: "Quelle est la première règle de la manipulation ?", a: "Observer sans être vu" },
    { q: "Comment créer une dette psychologique ?", a: "Rendre un service inattendu" },
  ],
  chess: [
    { q: "Quel est le meilleur premier coup aux échecs ?", a: "e4" },
    { q: "Comment s'appelle le sacrifice de la dame pour un mat rapide ?", a: "Matin de l'opéra" },
  ],
  martial_arts: [
    { q: "Quel est le principe de base de l'Aikido ?", a: "Utiliser la force de l'adversaire" },
    { q: "Comment contrôler sa respiration en combat ?", a: "Inspirer par le nez, expirer par la bouche" },
  ],
  psychology: [
    { q: "Qu'est-ce qu'un micro-expression ?", a: "Expression faciale involontaire de moins d'une seconde" },
    { q: "Quel biais cognitif pousse à surestimer ses capacités ?", a: "Effet Dunning-Kruger" },
  ],
};

router.post('/exercise', async (req: Request, res: Response) => {
  const { type, userId } = req.body;
  const pool = EXERCISES[type as keyof typeof EXERCISES];
  if (!pool) return res.status(400).json({ error: 'Invalid type' });
  const random = pool[Math.floor(Math.random() * pool.length)];
  res.json({ question: random.q, answer: random.a });
});

router.post('/answer', async (req: Request, res: Response) => {
  const { userId, type, question, userAnswer, correctAnswer } = req.body;
  const correct = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
  await prisma.exercise.create({
    data: {
      userId,
      type,
      question,
      answer: userAnswer,
      correct,
    },
  });
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user) {
    const newXp = user.xp + (correct ? 10 : 0);
    const newLevel = Math.floor(newXp / 100) + 1;
    await prisma.user.update({
      where: { id: userId },
      data: { xp: newXp, level: newLevel },
    });
  }
  res.json({ correct, xpGained: correct ? 10 : 0 });
});

export default router;