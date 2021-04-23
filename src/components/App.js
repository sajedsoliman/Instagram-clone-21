import { useEffect } from 'react'
// react router
import { Route, Switch, useLocation, Link as RouterLink } from 'react-router-dom'

// Material imports
import { Fab, makeStyles } from "@material-ui/core"
// Icons
import { PostAdd } from '@material-ui/icons'

// component imports
import Header from "./app-components/header/Header"
import MainBody from "./app-components/MainBody"
import UsersModal from './app-components/pages/user-profile/UsersModal'
import FullScreenPostModal from './app-components/Posts/FullScreenPostModal'
import AuthRoute from './common-components/router/AuthRoute'
import UnAuthRoute from './common-components/router/UnAuthRoute'
import MobileBottomBar from './app-components/header/MobileBottomBar'
import Store from './common-components/firebase/Store';

// Contexts
import { AuthedUser } from './user-context/AuthedUserContext'

// Pages
import CreatePost from "./app-components/pages/create-post/CreatePost"
import UserProfile from "./app-components/pages/user-profile/UserProfile"
import SinglePost from './app-components/pages/single-post/SinglePost'
import UserSettings from './app-components/pages/user-profile/settings-section/UserSettings'
import UserFollowers from './app-components/pages/user-profile/UserFollowers'
import UserFollowing from './app-components/pages/user-profile/UserFollowing'
import NotFound from './app-components/pages/404-page/NotFound'
import Login from '../components/app-components/pages/auth/Login'
import SignUp from './app-components/pages/auth/SignUp'
import Activities from './app-components/pages/user-activity/Activities';
import SearchUser from './app-components/pages/search-user/SearchUser'
import ActiveChat from './app-components/pages/inbox/single-chat/ActiveChat'
import Inbox from './app-components/pages/inbox/Inbox'


// style stuff
import "normalize.css"
import "../styles/dist/main.min.css"

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

    // Import Store component to show notification like messenger
    const { handleShowNotifications, changeUserActiveState } = Store()


    // set a listener for notifications
    useEffect(() => {
        // add the listener if there is a user
        // put the listener inside a variable to unsubscribe it in the clean up
        let unsubscribe
        if (window.innerWidth > 700) {
            unsubscribe = handleShowNotifications()
        }

        // If there is a user set them to active(status)
        if (loggedUser != "no user" && loggedUser.active == false) {
            changeUserActiveState(true)
        }

        return () => {
            // unsubscribe notifications
            unsubscribe()
        }
    }, [loggedUser])


    return (
        <div>
            {/* Header */}
            <Header />
            {/* If we are at mobile disable the switch and show the full page (single chat) */}
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

                    {/* User activities - authed */}
                    <AuthRoute path="/accounts/activity">
                        <Activities />
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
                    <Route path={`/direct/inbox/t/:chatId`} render={({ location }) => {
                        return <ActiveChat />
                    }} />
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
            {/* Content -- Sidebar */}
        </div>
    )
}