import React, { useState, useEffect } from 'react'

// Material-UI imports 
import { List, makeStyles, Typography } from '@material-ui/core'
// Icons

// Contexts

// Hooks

// Util
import IF from '../../common-components/utilities/IF'

// Components
import Store from '../../common-components/firebase/Store'
import UserCard from '../../common-components/user-related/UserCard'

// styles
const useStyles = makeStyles(theme => ({
    list: {
        marginBottom: 10
    },
    noUsersMsg: {
        marginTop: 10
    }
}))

export default function UserSuggestions(props) {
    const classes = useStyles()

    // State vars 
    const [suggestedUsers, setSuggestedUsers] = useState([])

    // Imports Store component to get suggestions
    const { getSuggestedUsers } = Store()

    // Fetch some suggested users
    useEffect(() => {
        getSuggestedUsers(setSuggestedUsers)
    }, [])

    // map through users
    const mappedUsers = suggestedUsers.slice(0, 4).map(user => {
        // Render the user card with the ability to follow and unFollow when do
        return <UserCard key={user.id} user={user} branch="followers" />
    })

    // No suggested user message
    const noUsers = (
        <Typography className={classes.noUsersMsg} paragraph color="textSecondary">No users to show</Typography>
    )

    return (
        <div>
            <Typography variant="body2" color="testPrimary">Suggested Users</Typography>

            {/* List of users */}
            <IF condition={mappedUsers.length != 0} elseChildren={noUsers}>
                <List className={classes.list}>
                    {mappedUsers}
                </List>
            </IF>

        </div>
    )
}