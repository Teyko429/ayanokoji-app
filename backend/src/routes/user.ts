import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  const { username } = req.body;
  try {
    const user = await prisma.user.create({ data: { username } });
    res.json(user);
  } catch {
    res.status(400).json({ error: 'Username already exists' });
  }
});

router.get('/profile/:id', async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { exercises: true },
  });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});
router.post('/login', async (req: Request, res: Response) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Username required' });

  let user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    user = await prisma.user.create({ data: { username } });
  }
  res.json(user);
});
router.patch('/profile/:id', async (req: Request, res: Response) => {
  const { username } = req.body;
  if (!username || !username.trim()) {
    return res.status(400).json({ error: 'Username required' });
  }
  try {
    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: { username: username.trim() },
    });
    res.json(user);
  } catch {
    res.status(400).json({ error: 'Username already taken or user not found' });
  }
});
export default router;
