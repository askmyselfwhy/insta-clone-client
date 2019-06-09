const tokenKey = 'insta-clone-token';
const userDataKey = 'insta-clone-user';

export const saveToLocalStorage = ({ token, user }) => {
  localStorage.setItem(tokenKey, token);
  localStorage.setItem(userDataKey, JSON.stringify(user));
}

export const removeFromLocalStorage = () => {
  localStorage.removeItem(tokenKey);
  localStorage.removeItem(userDataKey);
}

export const getFromLocalStorage = () => {
  const token = localStorage.getItem(tokenKey);
  const user = JSON.parse(localStorage.getItem(userDataKey));
  return token && user ? { token, user } : null
}