import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getRecipeById, deleteRecipe } from '../services/recipeService';
import { useAuth } from '../context/AuthContext';
import { Clock, Users, ArrowLeft, Edit, Trash2, Calendar, User, CheckSquare, Square } from 'lucide-react';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkedIngredients, setCheckedIngredients] = useState({});

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipeById(id);
        setRecipe(data);
      } catch (err) {
        console.error(err);
        setError('Recipe could not be loaded. It may have been deleted or the server is down.');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you absolutely sure you want to delete this delicious recipe?')) {
      try {
        await deleteRecipe(id);
        navigate('/');
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || 'Failed to delete the recipe.');
      }
    }
  };

  const toggleIngredient = (index) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="spinner-large" />
        <p style={{ color: 'var(--text-secondary)' }}>Preheating oven...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', borderRadius: '20px', margin: '2rem auto', maxWidth: '600px' }}>
        <p style={{ color: '#f87171', fontSize: '1.1rem', marginBottom: '1.5rem' }}>{error || 'Recipe not found'}</p>
        <Link to="/" className="btn btn-secondary" style={{ display: 'inline-flex', gap: '0.5rem' }}>
          <ArrowLeft size={16} />
          <span>Back to Discover</span>
        </Link>
      </div>
    );
  }

  const isAuthor = user && recipe.author && user._id === recipe.author._id;
  const recipeImage = recipe.image
    ? recipe.image.startsWith('http')
      ? recipe.image
      : `http://localhost:5001${recipe.image}`
    : 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=1200';

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div className="detail-actions-row">
        <button onClick={() => navigate(-1)} className="btn btn-secondary detail-btn-back">
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        {isAuthor && (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to={`/recipes/${recipe._id}/edit`} className="btn btn-secondary detail-btn-edit">
              <Edit size={16} style={{ color: 'var(--primary)' }} />
              <span>Edit</span>
            </Link>
            <button onClick={handleDelete} className="btn btn-danger detail-btn-delete">
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', borderRadius: '24px' }}>
        
        <div className="detail-hero-banner">
          <img src={recipeImage} alt={recipe.title} className="detail-hero-img" />
          <div className="detail-hero-overlay">
            <span className="badge badge-primary" style={{ marginBottom: '0.75rem', fontSize: '0.8rem' }}>{recipe.category}</span>
            <h1 className="serif-title">{recipe.title}</h1>
          </div>
        </div>

        <div className="detail-content-wrapper">
          <p className="detail-description">
            "{recipe.description}"
          </p>

          <div className="detail-stats-grid">
            <div className="detail-stat-card">
              <div className="detail-stat-icon-wrapper primary">
                <Clock size={20} style={{ color: 'var(--primary)' }} />
              </div>
              <div>
                <div className="detail-stat-label">COOKING TIME</div>
                <div className="detail-stat-value">{recipe.cookingTime} Minutes</div>
              </div>
            </div>

            <div className="detail-stat-card">
              <div className="detail-stat-icon-wrapper accent">
                <Users size={20} style={{ color: 'var(--accent)' }} />
              </div>
              <div>
                <div className="detail-stat-label">SERVINGS</div>
                <div className="detail-stat-value">{recipe.servings} Servings</div>
              </div>
            </div>

            <div className="detail-stat-card">
              <div className="detail-stat-icon-wrapper blue">
                <Calendar size={20} style={{ color: '#60a5fa' }} />
              </div>
              <div>
                <div className="detail-stat-label">PUBLISHED</div>
                <div className="detail-stat-value">{new Date(recipe.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>

          <div className="recipe-details-grid">
            
            <div>
              <h2 className="serif-title" style={{ fontSize: '1.6rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Ingredients</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>({recipe.ingredients.length})</span>
              </h2>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recipe.ingredients.map((ingredient, index) => {
                  const isChecked = !!checkedIngredients[index];
                  return (
                    <li 
                      key={index} 
                      onClick={() => toggleIngredient(index)}
                      className="ingredient-item"
                      style={{ 
                        color: isChecked ? 'var(--text-muted)' : 'var(--text-primary)',
                        textDecoration: isChecked ? 'line-through' : 'none'
                      }}
                    >
                      <span className="ingredient-checkbox" style={{ color: isChecked ? 'var(--primary)' : 'var(--text-muted)' }}>
                        {isChecked ? <CheckSquare size={18} /> : <Square size={18} />}
                      </span>
                      <span style={{ fontSize: '1rem', lineHeight: '1.4' }}>{ingredient}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <h2 className="serif-title" style={{ fontSize: '1.6rem', marginBottom: '1.5rem' }}>Instructions</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {recipe.steps.map((step, index) => (
                  <div key={index} className="instruction-step">
                    <div className="instruction-step-num">
                      {index + 1}
                    </div>
                    <div style={{ pt: '0.15rem' }}>
                      <p style={{ lineHeight: '1.6', fontSize: '1.05rem', color: 'var(--text-primary)' }}>{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="author-box-footer">
            {recipe.author?.profileImage ? (
              <img 
                src={recipe.author.profileImage.startsWith('http') ? recipe.author.profileImage : `http://localhost:5001${recipe.author.profileImage}`} 
                alt="author avatar" 
                className="author-large-avatar"
              />
            ) : (
              <div className="author-large-avatar-placeholder">
                <User size={30} style={{ color: 'var(--text-muted)' }} />
              </div>
            )}
            <div>
              <div className="detail-stat-label">RECIPE CREATOR</div>
              <h4 style={{ fontSize: '1.2rem', margin: '0.1rem 0' }}>{recipe.author?.username || 'Gourmet Chef'}</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '500px' }}>
                {recipe.author?.bio || 'An avid culinary creator sharing recipes on FlavorShare.'}
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default RecipeDetailPage;
