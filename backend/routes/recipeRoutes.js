import express from 'express';
import {
  createRecipe,
  getRecipes,
  getRecipeById,
  getMyRecipes,
  updateRecipe,
  deleteRecipe,
} from '../controllers/recipeController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(getRecipes)
  .post(protect, upload.single('image'), createRecipe);

router.route('/user/me').get(protect, getMyRecipes);

router
  .route('/:id')
  .get(getRecipeById)
  .put(protect, upload.single('image'), updateRecipe)
  .delete(protect, deleteRecipe);

export default router;
