import axios from 'axios';

export const useLogout = () => {
  const logout = async () => {
    try {
      await axios.post('/api/logout');
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return logout;
};
