import express from 'express';
import { createCategory, deleteCategory, getAllCategories, getCategoryById } from './controller/category.controller';

const categoryRouter = express.Router();


//! GET request routes
categoryRouter.get('/all', getAllCategories)
categoryRouter.get('/:categoryId', getCategoryById)

//! POST request routes
categoryRouter.post('/', createCategory);

//! DELETE request routes
categoryRouter.delete('/:categoryId', deleteCategory);

export default categoryRouter;
