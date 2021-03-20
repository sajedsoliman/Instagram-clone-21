import React, { useEffect, useState } from 'react'

// Router imports
import { Route, useLocation, useParams, Switch, useHistory } from 'react-router-dom'

// Material-Ui imports
import { Container, makeStyles } from '@material-ui/core'

// component imports
import UserInfo from './UserInfo'
import UserFollowers from '../user-profile/UserFollowers'
import UserMedia from './user-media-section/UserMedia'
import { db } from '../../../common-components/firebase/database'
import PopUp from '../../../common-components/PopUp'

// style stuff
const useStyles = makeStyles(theme => ({
    pageWrapper: {
        paddingTop: 100,
    }
}))

function UserProfile() {
    const classes = useStyles()

    const [user, setUser] = useState(null)

    // Router
    const history = useHistory()
    const { username } = useParams()

    // Fetch the user from database according to their username
    useEffect(() => {
        db.collection("members")
            .where("username", "==", username)
            .onSnapshot(value => {
                const user = value.empty
                // check if the user is existed or not
                if (user) {
                    history.replace("/user/not-found")
                } else {
                    setUser({ ...value.docs[0].data(), id: value.docs[0].id })
                }
            })
    }, [username])


    if (user == null) {
        return null
    } else {
        return (
            <div className={classes.pageWrapper}>
                <Container maxWidth="md">
                    <UserInfo user={user} />
                    <UserMedia user={user} />
                </Container>
            </div>
        )
    }
}

export default UserProfile
