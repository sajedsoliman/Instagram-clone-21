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
                // Destructuring the authed user
                // update user's active state to true
                db.collection("members")
                    .doc(authedUser.uid)
                    .get()
                    .then(userDoc => {
                        if (userDoc.exists) {
                            userDoc.ref.update({
                                active: true
                            }).then(_ => {
                                const fetchedUser = userDoc.data()
                                // setAuthUser({ ...fetchedUser, uid: authedUser.uid })
                                setAuthUser({ ...fetchedUser, uid: authedUser.uid })
                            })
                        }
                    })
            } else {
                // if the user has logged out -> remove them
                setAuthUser("no user")
            }
        })
    }, [])

    if (authUser == null || authUser == undefined) return null
    return (
        <AuthedUserContext.Provider value={authUser}>
            {children}
        </AuthedUserContext.Provider>
    )
}
