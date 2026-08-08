import Recipe from '../models/Recipe.js';

const parseArrayInput = (input) => {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      return input
        .split(/[,\n]/)
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    }
  }
  return [];
};

export const createRecipe = async (req, res) => {
  try {
    const { title, description, category, cookingTime, servings } = req.body;
    
    const ingredients = parseArrayInput(req.body.ingredients);
    const steps = parseArrayInput(req.body.steps);

    if (!title || !description || ingredients.length === 0 || steps.length === 0 || !cookingTime || !servings) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    let imagePath = '';
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    const recipe = await Recipe.create({
      title,
      description,
      ingredients,
      steps,
      category: category || 'Main Course',
      cookingTime: Number(cookingTime),
      servings: Number(servings),
      image: imagePath,
      author: req.user._id,
    });

    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecipes = async (req, res) => {
  try {
    const { search, category } = req.query;
    const queryObject = {};

    if (category) {
      queryObject.category = category;
    }

    if (search) {
      queryObject.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const recipes = await Recipe.find(queryObject)
      .populate('author', 'username profileImage')
      .sort({ createdAt: -1 });

    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate(
      'author',
      'username profileImage bio'
    );

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json(recipe);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getMyRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ author: req.user._id })
      .populate('author', 'username profileImage')
      .sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this recipe' });
    }

    const { title, description, category, cookingTime, servings } = req.body;

    recipe.title = title || recipe.title;
    recipe.description = description || recipe.description;
    recipe.category = category || recipe.category;
    recipe.cookingTime = cookingTime ? Number(cookingTime) : recipe.cookingTime;
    recipe.servings = servings ? Number(servings) : recipe.servings;

    if (req.body.ingredients) {
      recipe.ingredients = parseArrayInput(req.body.ingredients);
    }
    if (req.body.steps) {
      recipe.steps = parseArrayInput(req.body.steps);
    }

    if (req.file) {
      recipe.image = `/uploads/${req.file.filename}`;
    }

    const updatedRecipe = await recipe.save();
    res.json(updatedRecipe);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this recipe' });
    }

    await recipe.deleteOne();
    res.json({ message: 'Recipe removed successfully' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(500).json({ message: error.message });
  }
};
