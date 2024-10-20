import express from "express";
import dotenv from 'dotenv';
import db from "../db/conn.mjs";
import statsCTL from '../controllers/statsControllers.mjs'
dotenv.config();
const router = express.Router();

router.get('/gt70',statsCTL.getStats);
router.get('/:id',statsCTL.getStatsWithId);



export default router;