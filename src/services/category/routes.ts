import express from 'express';
import { createCategory, deleteCategory } from './controller/category.controller';

const categoryRouter = express.Router();

//! POST request routes
categoryRouter.post('/', createCategory);

//! DELETE request routes
categoryRouter.delete('/:categoryId', deleteCategory);

export default categoryRouter;
