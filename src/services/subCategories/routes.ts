import express from 'express';
import {
    createNewSubCategory,
    getAllSubCategories,
    getSubCategoryById,
    getSubCategoryListByMainCategory,
} from './controller/subCategory.controller';

const subCategoryRouter = express.Router();

//! GET request routes
subCategoryRouter.get('/all', getAllSubCategories)
subCategoryRouter.get('/:sub_category_id', getSubCategoryById)
subCategoryRouter.get('/sub_category_list/:main_category_id', getSubCategoryListByMainCategory)


//! POST request routes
subCategoryRouter.post('/', createNewSubCategory)

export default subCategoryRouter;
