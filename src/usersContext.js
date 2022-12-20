import React, { useEffect, useState } from 'react'

const UsersContext = React.createContext()

const UsersProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    useEffect(() => {
      const user = JSON.parse(localStorage.getItem('cp_user'));
      if (user) {
        setUser(user);
      }
    }, []);

    return (
        <UsersContext.Provider value={{ user, setUser }}>
            {children}
        </UsersContext.Provider>
    )
}

export { UsersContext, UsersProvider } 