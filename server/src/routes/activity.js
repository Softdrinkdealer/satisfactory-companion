import { Router } from 'express';
import { queryAll } from '../database.js';

const router = Router();

// GET recent activity (default last 20)
router.get('/', (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const logs = queryAll(
    `SELECT a.*, p.name as player_name
     FROM activity_log a
     LEFT JOIN players p ON a.player_id = p.id
     ORDER BY a.created_at DESC
     LIMIT ?`,
    [limit]
  );
  res.json(logs);
});

export default router;
