import React, { useState, useEffect } from 'react'
// Router
import { Link as RouterLink } from 'react-router-dom'

// Material-UI imports 
import { List, makeStyles, Typography } from '@material-ui/core'
// Icons

// Contexts
import { AuthedUser } from '../../user-context/AuthedUserContext'

// Hooks

// Components
import Store from '../../common-components/firebase/Store'

// styles
const useStyles = makeStyles(theme => ({
}))

export default function UserSuggestions(props) {
    const classes = useStyles()
    const loggedUser = AuthedUser()

    // State vars 
    const [suggestedUser, setSuggestedUser] = useState([])

    // Imports Store component to get suggestions
    const { getSuggestedUsers } = Store()

    // Fetch some suggested users
    useEffect(() => {
        getSuggestedUsers(setSuggestedUser)
    }, [])

    // map through users

    return (
        <div>
            <Typography variant="body2" color="testPrimary">Suggested Users</Typography>

            {/* List of users */}
            <List>

            </List>
        </div>
    )
}