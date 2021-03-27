import React, { useEffect, useState } from 'react'

// Router imports
import { useParams, useHistory } from 'react-router-dom'

// Material-Ui imports
import { Container, makeStyles } from '@material-ui/core'

// component imports
import UserInfo from './UserInfo'
import UserFollowers from '../user-profile/UserFollowers'
import UserMedia from './user-media-section/UserMedia'
import { db } from '../../../common-components/firebase/database'
import PopUp from '../../../common-components/PopUp'
import AppPage from '../AppPage'

// style stuff
const useStyles = makeStyles(theme => ({
}))

function UserProfile() {
    const classes = useStyles()

    const [user, setUser] = useState(null)

    // Router
    const history = useHistory()
    const { username } = useParams()

    // Fetch the user from database according to their username
    useEffect(() => {
        let unsubscribe = db
            .collection("members")
            .where("username", "==", username)
            .onSnapshot(value => {
                const user = value.empty
                // check if the user is existed or not
                if (user) {
                    history.replace("/users/not-found")
                } else {
                    setUser({ ...value.docs[0].data(), id: value.docs[0].id })
                }
            })

        // clean up the before user
        return () => {
            unsubscribe()
        }
    }, [username])

    if (user == null) return null

    return (
        <AppPage className={classes.pageWrapper}>
            <Container maxWidth="md">
                <UserInfo user={user} />
                <UserMedia user={user} />
            </Container>
        </AppPage>
    )
}

export default UserProfile
