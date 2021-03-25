import { Link } from 'react-router-dom'

// Material-UI imports
import { Container, makeStyles, Grid, Fab } from "@material-ui/core"

// Icons
import PostAdd from '@material-ui/icons/PostAdd';

// Component imports
import Posts from "./Posts/Posts"
import SideBar from './side-bar/SideBar';
import AppPage from './pages/AppPage';

// Contexts
import { AuthedUser } from '../user-context/AuthedUserContext';

// styles
const useStyles = makeStyles(theme => ({
    appBody: {
        background: "#fafafa",
        minHeight: "100vh"
    },
    pageContainer: {
        [theme.breakpoints.down("xs")]: {
            padding: 0
        }
    },
    postsWrapper: {
        [theme.breakpoints.up("sm")]: {
            paddingRight: theme.spacing(3)
        }
    },
}))


export default function MainBody() {
    const user = AuthedUser()

    const classes = useStyles()
    return (
        <AppPage additionalClass={classes.appBody}>

            <Container className={classes.pageContainer}>
                <Grid container>
                    {/* Left-side (Posts) */}
                    <Grid item xs={12} md={6} className={classes.postsWrapper}>
                        <Posts loggedUser={user} />
                    </Grid>
                    {/* Right-side (Some Info & Suggestions) */}
                    <Grid item xs={12} md={5}>
                        {
                            user !== "no user" ? <SideBar /> : null
                        }
                    </Grid>
                </Grid>
            </Container>

        </AppPage>
    )
}
