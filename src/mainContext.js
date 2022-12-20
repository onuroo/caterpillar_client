import React, { useState } from 'react'

const MainContext = React.createContext()

const MainProvider = ({ children }) => {
    const [name, setName] = useState('')

    return (
        <MainContext.Provider value={{ name, setName }}>
            {children}
        </MainContext.Provider>
    )
}

export { MainContext, MainProvider } 