import { Router, Request, Response } from 'express';
//const express = require("express");

import { FeedRouter } from './feed/routes/feed.router';
import { UserRouter } from './users/routes/user.router';

const router: Router = Router();
//const router = express.Router();

router.use('/feed', FeedRouter);
router.use('/users', UserRouter);

//router.get('/', async (req: Request, res: Response) => {    
router.get('/', async (req: Request, res: Response) => { 
    res.send(`V0`);
});

export const IndexRouter: Router = router;
//export const IndexRouter = router;