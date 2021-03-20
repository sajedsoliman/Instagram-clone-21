// Router
import { useLocation } from "react-router"

// UI imports
import { Container, makeStyles, Typography } from "@material-ui/core"

// component imports
import AppPage from '../AppPage'
import UserCard from "../../../common-components/user-related/UserCard"

// contexts
import { AuthedUser } from "../../../user-context/AuthedUserContext"

// styles
const useStyles = makeStyles(theme => ({
    page: {
        paddingTop: 100
    },
    list: {
        minWidth: 300,
        maxHeight: 350,
        overflowY: "auto"
    }
}))

function UserFollowing() {
    const classes = useStyles()
    const loggedUser = AuthedUser()

    const location = useLocation()
    // Get followers from location's state
    const following = location.state && location.state.users

    // map through follower - put them in list - import user card
    const mappedFollowing = following.map(follower => {
        if (!(follower.id == loggedUser?.id)) {
            return <UserCard key={follower.id} user={follower} />
        }
    })

    // the app render depend on screen width

    return <AppPage additionalClass={classes.page}>
        <Container>
            <Typography variant="h5" align="center">Users you have followed</Typography>
            {mappedFollowing}
        </Container>
    </AppPage>

}

export default UserFollowing
