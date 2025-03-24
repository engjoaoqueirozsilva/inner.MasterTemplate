import { useState, createContext, useEffect } from 'react';

import {  Redirect } from 'react-router-dom'

export const AuthContext = createContext({});

function AuthProvider({ children }){
  const [user, setUser] = useState(null)
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser(){
      const storageUser = localStorage.getItem('@inSetPro')

      if(storageUser){
        setUser(JSON.parse(storageUser))
        setLoading(false);
      }


      setLoading(false);

    }

    loadUser();
  }, [])


  async function signIn(email, password){
    setLoadingAuth(true);

    if(email !== null && email !== undefined && email !== '' && password !== null && password !== undefined && password !== ''){
        if(email === 'joao@trator.com' && password === '193178')
        {
            setUser(JSON.stringify({ email: email, password: password}))
        }

        <Redirect to="/admin/Atletas" />
    }
    else{
        alert('UsuarioInvalido');
    }
    // Chamada Login
    setLoadingAuth(false);
  }


  // Cadastrar um novo user
  

  function storageUser(data){
    localStorage.setItem('@ticketsPRO', JSON.stringify(data))
  }

  async function logout(){
    //Chamada Logout

    localStorage.removeItem('@ticketsPRO');
    setUser(null);
  }

  return(
    <AuthContext.Provider 
      value={{
        signed: !!user,
        user,
        signIn,
        logout,
        loadingAuth,
        loading,
        storageUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;