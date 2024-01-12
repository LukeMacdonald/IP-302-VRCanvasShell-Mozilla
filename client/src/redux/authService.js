import { linkAccount, signIn } from '../database/api';
import { clearToken, clearCourse, clearCourses, setToken } from './reducers';

const authService = {
  signup: async (id, password, token, dispatch) => {
    await linkAccount(id, password, token);
    dispatch(setToken(token));
  },

  login: async (id, password, dispatch) => {
    const token = await signIn(id, password);

    if (!token) {
      throw new Error('Invalid credentials'); // Add a meaningful error message
    }

    dispatch(setToken(token));
    return token; // Return the token for potential further use
  },

  logout: (dispatch, navigate) => {
    // Clear Redux state
    dispatch(clearToken());
    dispatch(clearCourses());
    dispatch(clearCourse());

    // Clear local storage
    localStorage.removeItem('token');

    // Redirect to the login page or any other desired page after logout
    navigate('/#/');
  },
};

export default authService;
