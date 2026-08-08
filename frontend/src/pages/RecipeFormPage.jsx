import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createRecipe, getRecipeById, updateRecipe } from '../services/recipeService';
import { ArrowLeft, Plus, Trash2, Save, Upload, AlertCircle } from 'lucide-react';

const CATEGORIES = ['Breakfast', 'Main Course', 'Dessert', 'Appetizer', 'Beverage'];

const RecipeFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Main Course');
  const [cookingTime, setCookingTime] = useState('');
  const [servings, setServings] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [ingredients, setIngredients] = useState(['']);
  const [steps, setSteps] = useState(['']);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      const fetchRecipe = async () => {
        setFetching(true);
        try {
          const data = await getRecipeById(id);
          setTitle(data.title);
          setDescription(data.description);
          setCategory(data.category);
          setCookingTime(data.cookingTime.toString());
          setServings(data.servings.toString());
          setIngredients(data.ingredients);
          setSteps(data.steps);
          if (data.image) {
            setImagePreview(
              data.image.startsWith('http') ? data.image : `http://localhost:5001${data.image}`
            );
          }
        } catch (err) {
          console.error(err);
          setError('Failed to fetch recipe details for editing.');
        } finally {
          setFetching(false);
        }
      };
      fetchRecipe();
    }
  }, [id, isEditMode]);

  const handleIngredientChange = (index, value) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const removeIngredient = (index) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const handleStepChange = (index, value) => {
    const updated = [...steps];
    updated[index] = value;
    setSteps(updated);
  };

  const addStep = () => {
    setSteps([...steps, '']);
  };

  const removeStep = (index) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !description || !cookingTime || !servings) {
      setError('Please fill in all mandatory text fields.');
      return;
    }

    const filteredIngredients = ingredients.map((i) => i.trim()).filter((i) => i.length > 0);
    const filteredSteps = steps.map((s) => s.trim()).filter((s) => s.length > 0);

    if (filteredIngredients.length === 0) {
      setError('Please supply at least one ingredient.');
      return;
    }
    if (filteredSteps.length === 0) {
      setError('Please detail at least one instructions step.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('cookingTime', cookingTime);
    formData.append('servings', servings);
    formData.append('ingredients', JSON.stringify(filteredIngredients));
    formData.append('steps', JSON.stringify(filteredSteps));

    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      if (isEditMode) {
        await updateRecipe(id, formData);
        navigate(`/recipes/${id}`);
      } else {
        const newRecipe = await createRecipe(formData);
        navigate(`/recipes/${newRecipe._id}`);
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 'Something went wrong while submitting the recipe.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <div className="spinner-large" />
        <p style={{ color: 'var(--text-secondary)' }}>Retrieving recipe details...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div className="form-header-row">
        <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem 1rem', border: 'none' }}>
          <ArrowLeft size={16} />
          <span>Cancel</span>
        </button>
        <h1 className="serif-title" style={{ fontSize: '2rem' }}>
          {isEditMode ? 'Edit Recipe Details' : 'Share a New Recipe'}
        </h1>
      </div>

      <div className="glass-panel form-card">
        {error && (
          <div className="error-box" style={{ marginBottom: '2rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <span className="form-label">Recipe Display Photo</span>
            <div 
              className="image-dropzone"
              style={{
                background: imagePreview ? `url(${imagePreview}) center/cover no-repeat` : 'rgba(15, 23, 42, 0.3)',
              }}
            >
              {!imagePreview && (
                <>
                  <Upload size={32} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Click to upload cover photo</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>(JPEG, PNG, WebP)</span>
                </>
              )}
              {imagePreview && (
                <div className="image-dropzone-overlay">
                  <Upload size={24} style={{ color: 'white' }} />
                  <span style={{ fontSize: '0.9rem', color: 'white', marginLeft: '0.5rem' }}>Replace Photo</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="image-dropzone-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="title-input">Recipe Title</label>
            <input
              id="title-input"
              type="text"
              className="form-input"
              placeholder="e.g. Grandma's Famous Lemon Meringue Pie"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description-input">Recipe Summary / Story</label>
            <textarea
              id="description-input"
              className="form-input"
              rows={3}
              placeholder="Give a short preview of the dish, how it tastes, or where the recipe comes from..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ resize: 'vertical' }}
              required
            />
          </div>

          <div className="form-grid-three">
            <div className="form-group">
              <label className="form-label" htmlFor="category-select">Category</label>
              <select
                id="category-select"
                className="form-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ appearance: 'none', background: 'rgba(15, 23, 42, 0.5)' }}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} style={{ background: 'var(--bg-main)', color: 'var(--text-primary)' }}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="cooking-time-input">Cooking Time (minutes)</label>
              <input
                id="cooking-time-input"
                type="number"
                min="1"
                className="form-input"
                placeholder="e.g. 45"
                value={cookingTime}
                onChange={(e) => setCookingTime(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="servings-input">Servings</label>
              <input
                id="servings-input"
                type="number"
                min="1"
                className="form-input"
                placeholder="e.g. 4"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <div className="list-manager-header">
              <span className="form-label" style={{ margin: 0 }}>Ingredients List</span>
              <button
                type="button"
                onClick={addIngredient}
                className="btn btn-secondary list-manager-btn-add"
              >
                <Plus size={14} style={{ color: 'var(--primary)' }} />
                <span>Add Ingredient</span>
              </button>
            </div>

            <div className="list-manager-inputs">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="list-manager-row">
                  <input
                    type="text"
                    className="form-input"
                    placeholder={`e.g. ${index === 0 ? '2 cups sifted cake flour' : index === 1 ? '1/2 cup organic honey' : 'Ingredient details'}`}
                    value={ingredient}
                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    disabled={ingredients.length <= 1}
                    className="btn btn-secondary list-manager-btn-delete"
                    style={{
                      color: ingredients.length <= 1 ? 'var(--text-muted)' : '#f87171',
                      cursor: ingredients.length <= 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="list-manager-header">
              <span className="form-label" style={{ margin: 0 }}>Step-by-Step Directions</span>
              <button
                type="button"
                onClick={addStep}
                className="btn btn-secondary list-manager-btn-add"
              >
                <Plus size={14} style={{ color: 'var(--primary)' }} />
                <span>Add Step</span>
              </button>
            </div>

            <div className="list-manager-inputs">
              {steps.map((step, index) => (
                <div key={index} className="list-manager-row" style={{ alignItems: 'flex-start' }}>
                  <div className="step-num-badge">
                    {index + 1}
                  </div>
                  <textarea
                    rows={2}
                    className="form-input"
                    placeholder="e.g. Whisk eggs and butter in a large container until fluffy..."
                    value={step}
                    onChange={(e) => handleStepChange(index, e.target.value)}
                    style={{ resize: 'vertical' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeStep(index)}
                    disabled={steps.length <= 1}
                    className="btn btn-secondary list-manager-btn-delete"
                    style={{
                      color: steps.length <= 1 ? 'var(--text-muted)' : '#f87171',
                      cursor: steps.length <= 1 ? 'not-allowed' : 'pointer',
                      alignSelf: 'stretch',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', marginTop: '1rem', gap: '0.5rem' }}
            disabled={loading}
          >
            {loading ? <div className="spinner" /> : (
              <>
                <Save size={18} />
                <span>{isEditMode ? 'Update Recipe' : 'Publish Recipe'}</span>
              </>
            )}
          </button>

        </form>
      </div>

      <style>{`
        div:hover > .image-dropzone-overlay {
          opacity: 1 !important;
        }
      `}</style>

    </div>
  );
};

export default RecipeFormPage;
