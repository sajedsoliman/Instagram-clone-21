import { useEffect, useState } from 'react'
import { Link as RouterLink, Route, Switch, useLocation, useRouteMatch } from 'react-router-dom'

// Material-Ui imports
import { List, makeStyles, Typography } from '@material-ui/core'

// component imports
import Store from '../../../../common-components/firebase/Store'
import UserFollowers from '../UserFollowers'
import PopUp from '../../../../common-components/PopUp'
import UserCard from '../../../../common-components/user-related/UserCard'

// Contexts
import { AuthedUser } from '../../../../user-context/AuthedUserContext'

// utilities
import { withS } from '../../../utilities/functions'

// style
const useStyles = makeStyles(theme => ({
    figuresList: {
        display: "flex",
        alignItems: "center",
        padding: 0,
        marginBottom: 20,
        justifyContent: "space-between",
        "& a": {
            color: "black",
            textDecoration: "none"
        }
    },
}))

function UserStatistics({ userId, username }) {
    const classes = useStyles()

    // Router imports
    const location = useLocation()

    // State vars
    const [posts, setPosts] = useState([])
    const [followers, setFollowers] = useState([])
    const [following, setFollowing] = useState([])

    // import required function from Store component
    const { getUserPosts, getUserFollowers, getFollowing } = Store()

    // UseEffect to fetch user statistics
    useEffect(() => {
        //  Fetch posts count
        getUserPosts(userId, setPosts)

        // Fetch user followers
        getUserFollowers(userId, setFollowers)

        // Fetch user following users
        getFollowing(userId, setFollowing)
    }, [username])

    return (
        <ul className={classes.figuresList}>
            {/* Post count */}
            <Typography>{posts.length} Post{withS(posts)}</Typography>

            {/* Followers */}
            {/* the branch is wether users followers or following  */}
            <Typography to={{
                state: { branch: "followers", users: followers, ...(window.innerWidth >= 600 ? { background: location } : {}) },
                pathname: `/${username}/followers`,
            }} component={RouterLink}>
                {followers.length} Follower{withS(followers)}</Typography>

            {/* Following */}
            <Typography to={{
                pathname: `/${username}/following`,
                state: { branch: "following", users: following, ...(window.innerWidth >= 600 ? { background: location } : {}) }
            }} component={RouterLink}>{following.length} Following</Typography>
        </ul >
    )
}

export default UserStatistics
