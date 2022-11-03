//import { Router, Request, Response } from 'express';
const express = require("express");

import { User } from '../models/User';
import { AuthRouter, requireAuth } from './auth.router';

//const router: Router = Router();
const router = express.Router();

router.use('/auth', AuthRouter);

router.get('/', async (req: Request, res: Response) => {
});

//router.get('/:id', async (req: Request, res: Response) => {
router.get('/:id', async (req, res) => {
    let { id } = req.params;
    const item = await User.findByPk(id);
    res.send(item);
});

//export const UserRouter: Router = router;
export const UserRouter = router;