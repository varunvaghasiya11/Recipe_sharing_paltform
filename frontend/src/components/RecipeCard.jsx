import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, User } from 'lucide-react';

const RecipeCard = ({ recipe }) => {
  const imageUrl = recipe.image
    ? recipe.image.startsWith('http')
      ? recipe.image
      : `http://localhost:5001${recipe.image}`
    : 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=600';

  const categoryBadgeClass =
    recipe.category === 'Dessert'
      ? 'badge-accent'
      : recipe.category === 'Beverage'
      ? 'badge-accent'
      : 'badge-primary';

  return (
    <div className="glass-panel recipe-card animate-fade-in">
      <div className="recipe-card-image-container">
        <img src={imageUrl} alt={recipe.title} className="recipe-card-img" />
        <div className="recipe-card-overlay">
          <span className={`badge ${categoryBadgeClass}`}>
            {recipe.category}
          </span>
        </div>
      </div>

      <div className="recipe-card-body">
        <Link to={`/recipes/${recipe._id}`}>
          <h3 className="recipe-card-title serif-title">{recipe.title}</h3>
        </Link>
        <p className="recipe-card-description">{recipe.description}</p>

        <div className="recipe-card-footer">
          <div className="avatar-wrapper">
            {recipe.author?.profileImage ? (
              <img
                src={
                  recipe.author.profileImage.startsWith('http')
                    ? recipe.author.profileImage
                    : `http://localhost:5001${recipe.author.profileImage}`
                }
                alt="author avatar"
                className="avatar"
              />
            ) : (
              <div
                className="avatar"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255,255,255,0.05)',
                }}
              >
                <User size={14} style={{ color: 'var(--text-secondary)' }} />
              </div>
            )}
            <span style={{ fontWeight: 500 }}>
              {recipe.author?.username || 'Chef'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <span className="recipe-meta-icon">
              <Clock size={14} style={{ color: 'var(--primary)' }} />
              <span>{recipe.cookingTime}m</span>
            </span>
            <span className="recipe-meta-icon">
              <Users size={14} style={{ color: 'var(--accent)' }} />
              <span>{recipe.servings}srv</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
