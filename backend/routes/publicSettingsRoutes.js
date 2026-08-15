import express from 'express';
import { getPublicSettings } from '../controllers/publicSettingsController.js';

const router = express.Router();

router.get('/public', getPublicSettings);

export default router;
