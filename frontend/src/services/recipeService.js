import API from './api';

export const getRecipes = async (search = '', category = '') => {
  let url = '/recipes';
  const params = [];
  
  if (search) {
    params.push(`search=${encodeURIComponent(search)}`);
  }
  if (category) {
    params.push(`category=${encodeURIComponent(category)}`);
  }
  
  if (params.length > 0) {
    url += `?${params.join('&')}`;
  }
  
  const { data } = await API.get(url);
  return data;
};

export const getRecipeById = async (id) => {
  const { data } = await API.get(`/recipes/${id}`);
  return data;
};

export const getMyRecipes = async () => {
  const { data } = await API.get('/recipes/user/me');
  return data;
};

export const createRecipe = async (recipeData) => {
  const { data } = await API.post('/recipes', recipeData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const updateRecipe = async (id, recipeData) => {
  const { data } = await API.put(`/recipes/${id}`, recipeData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const deleteRecipe = async (id) => {
  const { data } = await API.delete(`/recipes/${id}`);
  return data;
};
