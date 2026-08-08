import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecipes } from '../services/recipeService';
import RecipeCard from '../components/RecipeCard';
import { Search, RefreshCw, AlertCircle, Plus } from 'lucide-react';

const CATEGORIES = ['All', 'Breakfast', 'Main Course', 'Dessert', 'Appetizer', 'Beverage'];

const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const navigate = useNavigate();

  const fetchRecipesData = async (searchTerm = '', categoryTerm = 'All') => {
    setLoading(true);
    setError('');
    try {
      const cat = categoryTerm === 'All' ? '' : categoryTerm;
      const data = await getRecipes(searchTerm, cat);
      setRecipes(data);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve recipes. Please make sure the server is online.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipesData(search, selectedCategory);
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRecipesData(search, selectedCategory);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      
      <div className="glass-panel hero-banner">
        <span className="badge badge-primary hero-badge">
          🍽️ Over 10,000+ Gourmet Recipes
        </span>
        <h1 className="serif-title hero-title">
          Discover & Share <span className="text-gradient">Culinary Delights</span>
        </h1>
        <p className="hero-desc">
          Unleash your inner chef. Explore handpicked recipes, customize your ingredients, and share your unique flavor stories.
        </p>

        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-wrapper">
            <Search size={20} className="input-icon" />
            <input 
              type="text" 
              placeholder="Search recipes, ingredients, keyword..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input search-input"
            />
          </div>
          <button type="submit" className="btn btn-primary search-btn">
            Search
          </button>
        </form>
      </div>

      <div>
        <div className="section-header">
          <h2 className="serif-title" style={{ fontSize: '1.8rem' }}>Browse Categories</h2>
          {search && (
            <button 
              onClick={() => { setSearch(''); fetchRecipesData('', selectedCategory); }}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', border: 'none' }}
            >
              Clear Search "{search}"
            </button>
          )}
        </div>

        <div className="categories-container">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className="btn"
              style={{
                background: selectedCategory === category ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                color: selectedCategory === category ? '#fff' : 'var(--text-secondary)',
                border: selectedCategory === category ? '1px solid var(--primary)' : '1px solid var(--glass-border)',
                padding: '0.5rem 1.25rem',
                borderRadius: '20px',
                fontSize: '0.9rem',
                whiteSpace: 'nowrap',
                transition: 'var(--transition-fast)'
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div>
        {loading ? (
          <div className="loading-wrapper">
            <div className="spinner-large" />
            <p style={{ color: 'var(--text-secondary)' }}>Gathering secret recipes...</p>
          </div>
        ) : error ? (
          <div className="glass-panel error-panel">
            <AlertCircle size={40} style={{ color: '#f87171' }} />
            <h3 style={{ fontSize: '1.25rem' }}>Failed to Load</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>{error}</p>
            <button 
              onClick={() => fetchRecipesData(search, selectedCategory)} 
              className="btn btn-secondary"
              style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}
            >
              <RefreshCw size={16} />
              <span>Retry Connection</span>
            </button>
          </div>
        ) : recipes.length === 0 ? (
          <div className="glass-panel empty-panel animate-fade-in">
            <div style={{ fontSize: '3rem' }}>🥣</div>
            <h3 className="serif-title" style={{ fontSize: '1.5rem' }}>No Recipes Found</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '450px' }}>
              We couldn't find any recipes matching your current filters. Why not be the first to share one?
            </p>
            <button 
              onClick={() => navigate('/create')}
              className="btn btn-primary"
              style={{ display: 'flex', gap: '0.5rem', borderRadius: '12px' }}
            >
              <Plus size={16} />
              <span>Post Your Recipe</span>
            </button>
          </div>
        ) : (
          <div className="recipe-grid animate-fade-in">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
