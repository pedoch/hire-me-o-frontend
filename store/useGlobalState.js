import { useState } from 'react';

function useGlobalState() {
  const [state, setState] = useState({
    user: null,
    token: null,
    isLoggedIn: false,
  });

  const actions = (action) => {
    const { type, payload } = action;
    switch (type) {
      case 'setUser':
        return setState({ ...state, user: payload });
      case 'login':
        return setState({ ...state, user: payload.user, token: payload.token, isLoggedIn: true });
      case 'logout':
        localStorage.removeItem('user');
        localStorage.removeItem('userToken');
        return window.location.replace('/login?logout=true');
      case 'setIsLoggedIn':
        return setState({ ...state, user: null, token: null, isLoggedIn: false });
      default:
        return state;
    }
  };

  return { state, actions };
}

export default useGlobalState;
