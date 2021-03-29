import { useEffect, useState } from 'react'
// react router
import { Route, Switch, useLocation, Link as RouterLink } from 'react-router-dom'

// Material imports
import { Button, Fab, makeStyles, ThemeProvider } from "@material-ui/core"

// notistack imports (for snackbars)
import { useSnackbar } from 'notistack';


// Icons
import { PostAdd } from '@material-ui/icons'


// component imports
import Header from "./app-components/header/Header"
import MainBody from "./app-components/MainBody"
import CreatePost from "./app-components/pages/create-post/CreatePost"
import { AuthedUser } from './user-context/AuthedUserContext'
import { NotificationContext } from "./notification-context/NotificationContext"
import UserProfile from "./app-components/pages/user-profile/UserProfile"
import SinglePost from './app-components/pages/single-post/SinglePost'
import UserSettings from './app-components/pages/user-profile/settings-section/UserSettings'
import UserFollowers from './app-components/pages/user-profile/UserFollowers'
import UserFollowing from './app-components/pages/user-profile/UserFollowing'
import UsersModal from './app-components/pages/user-profile/UsersModal'
import FullScreenPostModal from './app-components/Posts/FullScreenPostModal'
import AuthRoute from './common-components/router/AuthRoute'
import UnAuthRoute from './common-components/router/UnAuthRoute'
import Login from '../components/app-components/pages/auth/Login'
import SignUp from './app-components/pages/auth/SignUp'
import { LayoutContextProvider } from './contexts/layout-context/LayoutContext'
import NotFound from './app-components/pages/404-page/NotFound'
import Inbox from './app-components/pages/inbox/Inbox'
import ActiveChat from './app-components/pages/inbox/single-chat/ActiveChat'
import MobileBottomBar from './app-components/header/MobileBottomBar'
import SearchUser from './app-components/pages/search-user/SearchUser'


// style stuff
import "normalize.css"
import "../styles/dist/main.min.css"
import commonTheme from "./commonTheme"
import { db } from './common-components/firebase/database'

const useStyles = makeStyles(theme => ({
    addPostBtn: {
        position: "fixed",
        left: 9,
        bottom: 10,
        zIndex: 2000,

        "& .MuiSvgIcon-root": {
            fontSize: 27
        },

        [theme.breakpoints.down("xs")]: {
            display: "none"
        }
    }
}))


export default function App() {
    const classes = useStyles()
    const loggedUser = AuthedUser()

    const location = useLocation()
    const background = location.state && location.state.background
    const mobile = location.state && location.state.mobile

    // Import notiStack snackBars
    const { enqueueSnackbar } = useSnackbar()

    // State vars

    // set a listener for notifications
    useEffect(() => {
        // add the listener
        db.collection("members")
            .doc(loggedUser.uid)
            .collection("notifications")
            .onSnapshot(snapshot => {
                /* const unSeenNotifications =  */
                snapshot.docs
                    .map(doc => ({ id: doc.id, body: doc.data() }))
                    .forEach(alert => {
                        if (!(alert.body.show)) {
                            const { text, link, variant } = alert.body
                            enqueueSnackbar(text, {
                                anchorOrigin: {
                                    horizontal: "right",
                                    vertical: "bottom"
                                },
                                action: (
                                    <Button to={link} component={RouterLink}>Go</Button>
                                ),
                                variant,
                                resumeHideDuration: 1000,
                                autoHideDuration: 2500
                            })
                        }
                    })

                // handle show notifications
                snapshot.docs.forEach(doc => {
                    doc.ref.update({
                        show: true
                    })
                })
            })
    }, [])


    return (
        <div>
            <ThemeProvider theme={commonTheme}>
                {/* Header */}
                <NotificationContext>
                    <LayoutContextProvider>
                        <Header />
                        {!mobile &&
                            <Switch location={background || location}>
                                {/* App body */}
                                <Route path="/" exact children={<MainBody />} />

                                <Route path="/home" children={<MainBody />} />

                                {/* upload a post to database page (create a post) */}
                                {/* Use auth route because only logged users can add a post */}
                                <AuthRoute path="/add-post">
                                    <CreatePost />
                                </AuthRoute>

                                {/* Login Page */}
                                <UnAuthRoute path="/login">
                                    <Login />
                                </UnAuthRoute>

                                {/* Register Page */}
                                <UnAuthRoute path="/register">
                                    <SignUp />
                                </UnAuthRoute>

                                {/* search a user page */}
                                <Route path="/search-user">
                                    <SearchUser />
                                </Route>

                                {/* User followers page - popup in desktops and full list in mobiles */}
                                <Route path="/:userId/followers" exact render={() => {
                                    return (
                                        <UserFollowers />
                                    )
                                }} />

                                {/* User's following users page - full list in mobiles */}
                                <Route path="/:userId/following" render={() => {
                                    return (
                                        <UserFollowing />
                                    )
                                }} />

                                {/* User inbox page - authed */}
                                <AuthRoute path="/direct/inbox">
                                    <Inbox />
                                </AuthRoute>

                                {/* Single post page */}
                                <Route path="/:userId/p/:postId" render={(props) => (
                                    <SinglePost />
                                )} />

                                {/* User settings page - authed */}
                                <AuthRoute path="/accounts/:id">
                                    <UserSettings />
                                </AuthRoute>

                                {/* User profile page */}
                                <Route path="/:username" exact render={(props) => (
                                    <UserProfile />
                                )} />

                                {/* 404 page & route */}
                                <Route render={(props) => (
                                    <NotFound />
                                )} />
                            </Switch>
                        }

                        {/* User followers page - popup in desktops and full list in mobiles */}
                        {
                            background && (
                                <Route path="/:userId/followers" render={(props) => <UsersModal />
                                } />
                            )
                        }
                        {/* User's following users page - Popup in desktops */}
                        {
                            background && (
                                <Route path="/:userId/following" render={(props) => <UsersModal />
                                } />
                            )
                        }
                        {/* Full screen post popup in desktops */}
                        {
                            background && (
                                <Route path="/:userId/p/:postId" render={(props) => <FullScreenPostModal />
                                } />
                            )
                        }
                        {/* Show the whole active chat if the window width < 960px */}
                        {
                            mobile && (
                                <Route path="/direct/inbox/t/:chatId" render={(props) => <ActiveChat />
                                } />
                            )
                        }

                        {/* Add post button for desktop */}
                        <Fab
                            className={classes.addPostBtn}
                            color="secondary"
                            component={RouterLink}
                            to="/add-post">
                            <PostAdd />
                        </Fab>

                        {/* Mobile DownBar */}
                        <MobileBottomBar />
                    </LayoutContextProvider>
                </NotificationContext>
            </ThemeProvider>

            {/* Content -- Sidebar */}
        </div>
    )
}

/*


*/