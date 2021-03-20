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

function UserFollowers() {
    const classes = useStyles()
    const loggedUser = AuthedUser()

    const location = useLocation()
    // Get followers from location's state
    const followers = location.state && location.state.users

    // map through follower - put them in list - import user card
    const mappedFollowers = followers.map(follower => {
        if (!(follower.id == loggedUser?.id)) {
            return <UserCard key={follower.id} user={follower} />
        }
    })

    // the app render depend on screen width

    return <AppPage additionalClass={classes.page}>
        <Container>
            <Typography variant="h5" align="center">All Followers</Typography>
            {mappedFollowers}
        </Container>
    </AppPage>

}

export default UserFollowers
