import React, { useContext, useState, useEffect } from 'react'
import { auth, db } from '../common-components/firebase/database'

const AuthedUserContext = React.createContext()

// custom hook to access the user
export function AuthedUser() {

    return useContext(AuthedUserContext)
}

export function AuthedUserProvider({ children }) {
    const [authUser, setAuthUser] = useState(null)

    useEffect(() => {
        auth.onAuthStateChanged(authedUser => {
            if (authedUser) {
                // update user's active state to true
                db.collection("members")
                    .doc(authedUser.uid)
                    .update({
                        active: true
                    }).then(success => {
                        // get user info from database
                        db.collection("members")
                            .doc(authedUser.uid)
                            .get()
                            .then(savedUser => {
                                const fetchedUser = savedUser.data()
                                setAuthUser({ ...fetchedUser, uid: authedUser.uid })
                            })
                    })
            } else {
                // if the user has logged out -> remove them
                setAuthUser(null)
            }
        })
    }, [])

    return (
        <AuthedUserContext.Provider value={authUser}>
            {children}
        </AuthedUserContext.Provider>
    )
}
