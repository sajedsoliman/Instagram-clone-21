import React, { useContext } from 'react'

const LayoutContext = React.createContext()

// custom hook to access the user
export function Layout() {

    return useContext(LayoutContext)
}

export function LayoutContextProvider({ children }) {

    const layout = {
        header: {
            desktop: {
                height: 66
            },
            mobile: {
                height: 62
            }
        }
    }

    return (
        <LayoutContext.Provider value={layout}>
            {children}
        </LayoutContext.Provider>
    )
}
