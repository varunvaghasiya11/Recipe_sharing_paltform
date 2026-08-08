import API from './api';

export const login = async (email, password) => {
  const { data } = await API.post('/auth/login', { email, password });
  if (data) {
    localStorage.setItem('userInfo', JSON.stringify(data));
  }
  return data;
};

export const register = async (username, email, password) => {
  const { data } = await API.post('/auth/register', { username, email, password });
  if (data) {
    localStorage.setItem('userInfo', JSON.stringify(data));
  }
  return data;
};

export const logout = () => {
  localStorage.removeItem('userInfo');
};

export const getProfile = async () => {
  const { data } = await API.get('/auth/profile');
  return data;
};

export const updateProfile = async (profileData) => {
  const { data } = await API.put('/auth/profile', profileData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  if (data) {
    const localUser = JSON.parse(localStorage.getItem('userInfo'));
    const updatedLocal = { ...localUser, ...data };
    localStorage.setItem('userInfo', JSON.stringify(updatedLocal));
  }
  return data;
};
