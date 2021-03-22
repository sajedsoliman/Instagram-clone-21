// react router
import { Route, Switch, useLocation } from 'react-router-dom'

// component imports
import Header from "./app-components/Header"
import MainBody from "./app-components/MainBody"
import CreatePost from "./app-components/pages/create-post/CreatePost"
import { AuthedUserProvider } from './user-context/AuthedUserContext'
import { NotificationContext } from "./notification-context/NotificationContext"
import UserProfile from "./app-components/pages/user-profile/UserProfile"
import SinglePost from './app-components/pages/single-post/SinglePost'
import UserSettings from './app-components/pages/user-profile/settings-section/UserSettings'
import UserFollowers from './app-components/pages/user-profile/UserFollowers'
import UserFollowing from './app-components/pages/user-profile/UserFollowing'
import UsersModal from './app-components/pages/user-profile/UsersModal'
import FullScreenPostModal from './app-components/Posts/FullScreenPostModal'
import NotFound from './app-components/pages/404-page/NotFound'
import AuthRoute from './common-components/router/AuthRoute'
import UnAuthRoute from './common-components/router/UnAuthRoute'
import Login from '../components/app-components/pages/auth/Login'
import SignUp from './app-components/pages/auth/SignUp'


// style stuff
import "normalize.css"
import "../styles/dist/main.min.css"
import { ThemeProvider } from "@material-ui/core"
import commonTheme from "./commonTheme"
import Inbox from './app-components/pages/inbox/Inbox'
import ActiveChat from './app-components/pages/inbox/single-chat/ActiveChat'


export default function App() {
    const location = useLocation()
    const background = location.state && location.state.background


    return (
        <div>
            <ThemeProvider theme={commonTheme}>
                {/* Header */}
                <NotificationContext>
                    <AuthedUserProvider>
                        <Header />
                        <Switch location={background || location}>
                            {/* App body */}
                            <Route path="/" exact children={<MainBody />} />
                            <Route path="/home" exact children={<MainBody />} />

                            {/* upload a post to database page (create a post) */}
                            {/* Use auth route because only logged users can add a post */}
                            <Route path="/add-post" exact>
                                <CreatePost />
                            </Route>

                            {/* Login Page */}
                            <Route path="/login" exact render={(props) => <Login />} />

                            {/* Register Page */}
                            <Route path="/register" exact>
                                <SignUp />
                            </Route>

                            {/* User profile page */}
                            <Route path="/:username" exact render={(props) => (
                                <UserProfile />
                            )} />

                            {/* User inbox page - authed */}
                            <AuthRoute path="/direct/inbox">
                                <Inbox />
                            </AuthRoute>

                            {/* User followers page - popup in desktops and full list in mobiles */}
                            <Route path="/:userId/followers" exact render={() => {
                                return (
                                    <UserFollowers />
                                )
                            }} />

                            {/* User's following users page - full list in mobiles */}
                            <Route path="/:userId/following" exact render={() => {
                                return (
                                    <UserFollowing />
                                )
                            }} />

                            {/* User settings page - authed */}
                            <AuthRoute path="/accounts/:id">
                                <UserSettings />
                            </AuthRoute>

                            {/* Single post page */}
                            <Route path="/:userId/p/:postId" render={(props) => (
                                <SinglePost />
                            )} />
                        </Switch>

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
                            background && (
                                <Route path="/direct/inbox/t/:chatId" render={(props) => <ActiveChat />
                                } />
                            )
                        }
                    </AuthedUserProvider>
                </NotificationContext>
            </ThemeProvider>

            {/* Content -- Sidebar */}
        </div>
    )
}

/*

                            404 page & route
                            <Route path="*" render={(props) => (
                                <NotFound />
                            )} />
*/