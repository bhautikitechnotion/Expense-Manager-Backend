import express from 'express';
import { createNewSubCategory } from './controller/subCategory.controller';

const subCategoryRouter = express.Router();

//! POST request routes
subCategoryRouter.post('/', createNewSubCategory)

export default subCategoryRouter;
