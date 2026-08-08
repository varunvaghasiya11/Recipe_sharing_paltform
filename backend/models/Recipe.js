import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Recipe title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Recipe description is required'],
    },
    ingredients: {
      type: [String],
      required: [true, 'Ingredients are required'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'A recipe must have at least one ingredient',
      },
    },
    steps: {
      type: [String],
      required: [true, 'Cooking steps are required'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'A recipe must have at least one cooking step',
      },
    },
    image: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Breakfast', 'Main Course', 'Dessert', 'Appetizer', 'Beverage'],
        message: '{VALUE} is not a valid recipe category',
      },
      default: 'Main Course',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cookingTime: {
      type: Number,
      required: [true, 'Cooking time is required in minutes'],
      min: [1, 'Cooking time must be at least 1 minute'],
    },
    servings: {
      type: Number,
      required: [true, 'Number of servings is required'],
      min: [1, 'Servings must be at least 1'],
    },
  },
  {
    timestamps: true,
  }
);

recipeSchema.index({ title: 'text', description: 'text' });

const Recipe = mongoose.model('Recipe', recipeSchema);
export default Recipe;
