import { json, Router } from "express";

import { ping } from '../controllers/index.controllers.js';
const router = Router();

router.get('/', ping);

export default router;