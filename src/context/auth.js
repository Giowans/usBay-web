import React, { createContext, useContext, useReducer } from 'react';
import { post } from '../api/Services';

/**
 * Auth reducer
 */

const authReducer = (state, action) => {
  switch (action.type) {
    case 'signin':
      return {
        userId: action.payload.userId,
        token: action.payload.token,
      };
    case 'logout':
      return {
        userId: '',
        token: '',
      };
    default:
      return state;
  }
};

/* Actions */

/**
 * Sign in / log in
 */
const signin = dispatch => async ({ email, password, onSuccess, onError }) => {
  try {
    const res = await post({
      email: email,
      password: password
    },
    "AppUsers/login", "");
    const data = {
        "token": res.id,
        "userId": res.userId,
    }
    dispatch({ type: 'signin', payload: data });
    localStorage.setItem('token', data.token);
    onSuccess(data);
  } catch (err) {
    console.error('ERROR: ' + err);
    onError();
  }
};

/**
 * Log out
 */
const logout = dispatch => onCompleted => {
  dispatch({ type: 'logout' });
  localStorage.removeItem('token');
  // onCompleted is a callback function that redirects user to login
  onCompleted();
};


/* Context */
export const AuthContext = createContext();

/* Hook */
export function useAuth() {
  return useContext(AuthContext);
}

/* Provider */
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, {
    id_empleado: 0,
    token: '',
    cargo: '',
    correo: '',
    nombre: ''
  });

  const boundActions = {
    signin: signin(dispatch),
    logout: logout(dispatch),
  };

  return (
    <AuthContext.Provider value={{ state, ...boundActions }}>
      {children}
    </AuthContext.Provider>
  );
}
