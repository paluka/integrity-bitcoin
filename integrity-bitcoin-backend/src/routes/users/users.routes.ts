import express from 'express';

const router = express.Router();

router.get('/', (req, res, next) => {
  res.send('<p>Apple</p>');
});

export default router;
