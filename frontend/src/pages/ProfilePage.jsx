import React, { useState, useEffect } from 'react';
import { getMyRecipes } from '../services/recipeService';
import { useAuth } from '../context/AuthContext';
import RecipeCard from '../components/RecipeCard';
import { User, Mail, BookOpen, Edit2, Check, X, Camera, Loader, AlertCircle } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfileDetails } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [recipesLoading, setRecipesLoading] = useState(true);
  
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserRecipes = async () => {
      try {
        const data = await getMyRecipes();
        setRecipes(data);
      } catch (err) {
        console.error('Failed to fetch my recipes', err);
      } finally {
        setRecipesLoading(false);
      }
    };
    
    fetchUserRecipes();
    
    if (user) {
      setUsername(user.username || '');
      setBio(user.bio || '');
      if (user.profileImage) {
        setAvatarPreview(user.profileImage.startsWith('http') ? user.profileImage : `http://localhost:5001${user.profileImage}`);
      }
    }
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Username cannot be empty');
      return;
    }

    setUpdateLoading(true);
    const formData = new FormData();
    formData.append('username', username);
    formData.append('bio', bio);
    if (avatarFile) {
      formData.append('profileImage', avatarFile);
    }

    try {
      await updateProfileDetails(formData);
      setEditMode(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update profile details.');
    } finally {
      setUpdateLoading(false);
    }
  };

  const cancelEdit = () => {
    setUsername(user.username || '');
    setBio(user.bio || '');
    if (user.profileImage) {
      setAvatarPreview(user.profileImage.startsWith('http') ? user.profileImage : `http://localhost:5001${user.profileImage}`);
    } else {
      setAvatarPreview('');
    }
    setAvatarFile(null);
    setEditMode(false);
  };

  const userAvatar = avatarPreview || '';

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      
      <div className="glass-panel profile-overview-card">
        {editMode ? (
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 className="serif-title" style={{ fontSize: '1.5rem' }}>Edit Personal Kitchen Details</h2>
            
            {error && (
              <div className="error-box">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <div className="profile-form-row">
              <div className="profile-avatar-container">
                {userAvatar ? (
                  <img src={userAvatar} alt="avatar preview" className="profile-avatar-img" />
                ) : (
                  <div className="profile-avatar-placeholder">
                    <User size={40} style={{ color: 'var(--text-muted)' }} />
                  </div>
                )}
                <div className="profile-avatar-camera-btn">
                  <Camera size={16} style={{ color: 'white' }} />
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleAvatarChange} 
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0, cursor: 'pointer' }}
                  />
                </div>
              </div>

              <div className="profile-form-inputs">
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="profile-username-input">Chef Handle Name</label>
                  <input
                    id="profile-username-input"
                    type="text"
                    className="form-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="profile-bio-input">Kitchen Bio</label>
                  <textarea
                    id="profile-bio-input"
                    className="form-input"
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about your culinary philosophy, favorite ingredients, or specialties..."
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>
            </div>

            <div className="profile-form-actions">
              <button type="button" onClick={cancelEdit} className="btn btn-secondary" style={{ border: 'none', display: 'flex', gap: '0.4rem' }}>
                <X size={16} />
                <span>Cancel</span>
              </button>
              <button type="submit" className="btn btn-primary" style={{ display: 'flex', gap: '0.4rem' }} disabled={updateLoading}>
                {updateLoading ? <div className="spinner" /> : (
                  <>
                    <Check size={16} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-info-grid">
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center', flexGrow: 1 }}>
              
              <div>
                {userAvatar ? (
                  <img src={userAvatar} alt="user avatar" style={{ width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} />
                ) : (
                  <div style={{ width: '110px', height: '110px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '2px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={50} style={{ color: 'var(--text-muted)' }} />
                  </div>
                )}
              </div>

              <div className="profile-text-content">
                <h2>
                  <span>{user?.username}</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 500 }}>Chef Master</span>
                </h2>
                <p className="profile-email-row">
                  <Mail size={14} style={{ color: 'var(--primary)' }} />
                  <span>{user?.email}</span>
                </p>
                <p className="profile-bio-text">
                  {user?.bio || "This chef hasn't written a biography yet."}
                </p>
              </div>

            </div>

            <button onClick={() => setEditMode(true)} className="btn btn-secondary profile-edit-btn">
              <Edit2 size={15} style={{ color: 'var(--primary)' }} />
              <span>Edit Profile</span>
            </button>
          </div>
        )}
      </div>

      <div>
        <h2 className="serif-title" style={{ fontSize: '1.8rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen size={22} style={{ color: 'var(--primary)' }} />
          <span>My Recipe Contributions</span>
          <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>({recipes.length})</span>
        </h2>

        {recipesLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '20vh' }}>
            <Loader size={24} style={{ animation: 'spin 1.5s linear infinite', color: 'var(--primary)' }} />
          </div>
        ) : recipes.length === 0 ? (
          <div className="glass-panel" style={{ padding: '3.5rem 2rem', textAlign: 'center', borderRadius: '20px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              You haven't posted any recipes yet. Your culinary creations will display here.
            </p>
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

export default ProfilePage;
