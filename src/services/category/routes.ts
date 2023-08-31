import express from 'express';
import { createCategory } from './controller/category.controller';

const categoryRouter = express.Router();

//! POST request routes
categoryRouter.post('/', createCategory);

export default categoryRouter;
