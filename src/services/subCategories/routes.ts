import express from 'express';
import { createNewSubCategory, getAllSubCategories } from './controller/subCategory.controller';

const subCategoryRouter = express.Router();

//! GET request routes
subCategoryRouter.get('/all', getAllSubCategories)


//! POST request routes
subCategoryRouter.post('/', createNewSubCategory)

export default subCategoryRouter;
