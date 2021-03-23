import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'

// Component imports
import Posts from "./Posts/Posts"
import MobileBottomBar from './MobileBottomBar';
import SideBar from './side-bar/SideBar';

// Contexts
import { useAlert } from '../notification-context/NotificationContext';
import { AuthedUser } from '../user-context/AuthedUserContext';

// Material-UI imports
import { Container, makeStyles, Grid, Fab } from "@material-ui/core"
import PostAdd from '@material-ui/icons/PostAdd';

// styles
const useStyles = makeStyles(theme => ({
    appBody: {
        background: "#fafafa",
        paddingTop: 150,
        paddingBottom: 50,
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
    addPostBtn: {
        position: "fixed",
        left: 34,
        bottom: 29,
        [theme.breakpoints.down("sm")]: {
            display: "none"
        }
    }
}))


export default function MainBody() {
    const user = AuthedUser()

    const classes = useStyles()
    return (
        <div className={classes.appBody}>

            <Container className={classes.pageContainer}>
                <Grid container>
                    {/* Left-side (Posts) */}
                    <Grid item xs={12} md={6} className={classes.postsWrapper}>
                        <Posts loggedUser={user} />
                    </Grid>
                    {/* Right-side (Some Info & Suggestions) */}
                    <Grid item xs={12} md={5}>
                        {
                            user != "no user" && <SideBar />
                        }
                    </Grid>
                </Grid>

                {/* Add post button for desktop */}
                {user != "no user" && (
                    <>
                        <Fab
                            className={classes.addPostBtn}
                            color="secondary"
                            variant="extended"
                            component={Link} to="/add-post"
                        >
                            <PostAdd />  Add Post
                        </Fab>

                        {/* Mobile DownBar */}
                        <MobileBottomBar />
                    </>
                )}
            </Container>

        </div>
    )
}
