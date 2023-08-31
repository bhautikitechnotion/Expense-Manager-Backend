import express from 'express';
import { createNewSubCategory, getAllSubCategories, getSubCategoryById } from './controller/subCategory.controller';

const subCategoryRouter = express.Router();

//! GET request routes
subCategoryRouter.get('/all', getAllSubCategories)
subCategoryRouter.get('/:sub_category_id', getSubCategoryById)


//! POST request routes
subCategoryRouter.post('/', createNewSubCategory)

export default subCategoryRouter;
