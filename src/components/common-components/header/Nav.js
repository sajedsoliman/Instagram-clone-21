import { Link as RouterLink, useHistory } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import clsx from "clsx"

// Material-UI imports
import { Badge } from '@material-ui/core'
import makeStyles from "@material-ui/core/styles/makeStyles"
import Link from "@material-ui/core/Link"
import Avatar from "@material-ui/core/Avatar"

// icons
import HomeOutlined from '@material-ui/icons/HomeOutlined';
import Home from "@material-ui/icons/Home"
import InboxIcon from '@material-ui/icons/Inbox';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import { Favorite, PostAdd, Search } from '@material-ui/icons'

// component imports / info
import CustomMenuList from "../CustomMenuList"
import { AuthedUser } from '../../user-context/AuthedUserContext'
import LoggedUserAction from '../../app-components/header/LoggedUserAction'
import PopUp from '../PopUp'
import LoginForm from '../../app-components/forms/LoginForm'
import RegisterForm from '../../app-components/forms/RegisterForm'
import Store from '../firebase/Store'
import IF from '../utilities/IF'
import UserProfileMenu from '../../app-components/header/UserProfileMenu'
import ActivityList from '../user-related/ActivityList'

// Hooks
import useWindowWidth from '../../common-components/hooks/useWindowWidth'

const useStyles = makeStyles((theme) => ({
    linkNav: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",

        [theme.breakpoints.down("xs")]: {
            justifyContent: "space-between",
            width: "100%",
        },

        "& a": {
            cursor: "default",
            color: theme.palette.text.primary,
        }
    },
    secondaryLinks: {
        display: "inherit",
        marginLeft: theme.spacing(3),
        paddingTop: 2,

        "& a": {
            marginRight: theme.spacing(2),

            "& svg, & i": {
                fontSize: 26,
            }
        }
    },
    userAvatar: {
        width: "1.2em",
        height: "1.2em",
        top: .5,
        transition: "box-shadow .25s",

        "&.active": {
            boxShadow: "0 0 0 2px white, 0 0 0 3.3px #000"
        }
    },
    menuPopper: {
        [theme.breakpoints.down("xs")]: {
            top: "-12px !important",
        }
    },
}))

export default function Nav({ navClassName }) {
    const classes = useStyles()
    const user = AuthedUser()

    // Refs
    const activityLinkRef = useRef()

    // Router
    const history = useHistory()

    // State vars
    const [anchorEl, setAnchorEl] = useState(null)
    const [loginModal, setLoginModal] = useState({ title: null, isOpen: false })
    const [registerModal, setRegisterModal] = useState({ title: null, isOpen: false })
    const [chats, setChats] = useState([])
    const [showNotifications, setShowNotifications] = useState(false)
    const [notifications, setNotifications] = useState([])

    // Get window width from the hook
    const { windowWidth } = useWindowWidth()

    // Import Store component to get chats
    const { getUserChats, getNotifications } = Store()


    // a Listener to listen the user chats' changes
    useEffect(() => {
        if (user != null && user != "no user") {
            // Get chats
            getUserChats(user.id, setChats)

            // Set a listener on noti
            getNotifications(setNotifications)
        }
    }, [user])

    const handleLoginModalOpen = () => {
        setLoginModal(prev => ({
            ...prev, isOpen: true
        }))
    }

    const handleRegisterModalOpen = () => {
        setRegisterModal(prev => ({
            ...prev, isOpen: true
        }))
    }

    const handleLoginModalClose = () => {
        setLoginModal(prev => ({
            ...prev, isOpen: false
        }))
    }

    const handleRegisterModalClose = () => {
        setRegisterModal(prev => ({
            ...prev, isOpen: false
        }))
    }

    const handleAnchorEl = (e) => {
        setAnchorEl(prev => prev == null ? e.currentTarget : null)
    }

    const handleCloseMenu = () => {
        setAnchorEl(null)
    }

    // handle close notification popper
    const handleCloseNotifications = () => {
        setShowNotifications(false)
    }

    // Check if there any are unread messages
    const isThereUnreadMessages = chats.some(chat => {
        return !chat.chat.seen
    })

    // Check if there are unseen notifications
    const isThereUnseenNoti = notifications.some(noti => !noti.body.seen)

    // Handle show notification popper
    const handleToggleNotifications = () => {
        // Check if the window screen is less that 600 then go the full activities page
        if (windowWidth < 600)
            history.replace("/accounts/activity", { notifications })
        else setShowNotifications(prev => {
            return !prev
        })
    }


    return (
        <nav className={clsx(classes.linkNav, navClassName)}>
            <Link to="/" component={RouterLink}>
                {Boolean(anchorEl) ? <HomeOutlined fontSize="large" /> : <Home fontSize="large" />}
            </Link>

            {
                user !== "no user" ?
                    <div className={classes.secondaryLinks}>
                        {windowWidth < 600 && (
                            <>
                                <Link to="/search-user" component={RouterLink}>
                                    <Search />
                                </Link>
                                <Link to="/add-post" component={RouterLink}>
                                    <PostAdd color="secondary" />
                                </Link>
                            </>
                        )}
                        <Link to="/direct/inbox" component={RouterLink}>
                            <Badge variant="dot"
                                overlap="circle" color="secondary"
                                invisible={!isThereUnreadMessages}>
                                <InboxIcon />
                            </Badge>
                        </Link>
                        {/* Activities */}
                        <Link ref={activityLinkRef} onClick={handleToggleNotifications}>
                            <Badge
                                variant="dot" color="secondary"
                                invisible={!isThereUnseenNoti} overlap="circle">
                                <IF condition={showNotifications}
                                    elseChildren={<FavoriteBorderIcon />}>
                                    <Favorite />
                                </IF>
                            </Badge>

                        </Link>
                        <Link onClick={handleAnchorEl} aria-haspopup="true">
                            <Avatar className={clsx(classes.userAvatar, { "active": anchorEl })} src={user?.avatar} alt="Profile Avatar" />
                        </Link>

                        <CustomMenuList
                            popperClassName={classes.menuPopper}
                            placement={windowWidth < 600 ? "top-start" : "bottom-end"}
                            anchorEl={anchorEl}
                            handleClose={handleCloseMenu}>
                            <UserProfileMenu handleCloseMenu={handleCloseMenu} />
                        </CustomMenuList>
                    </div>
                    : (
                        <LoggedUserAction handleLoginModalOpen={handleLoginModalOpen}
                            handleRegisterModalOpen={handleRegisterModalOpen} />
                    )
            }

            {/* Activities popper */}
            <CustomMenuList
                popperClassName={classes.menuPopper}
                placement={windowWidth < 600 ? "top-start" : "bottom-end"}
                anchorEl={activityLinkRef.current}
                open={showNotifications}
                handleClose={handleCloseNotifications}>
                <ActivityList handleCloseNotifications={handleCloseNotifications}
                    notification={notifications} />
            </CustomMenuList>

            {/* Login Modal */}
            <PopUp infoFunc={loginModal} closeHandle={handleLoginModalClose}>
                <LoginForm handleLoginModalClose={handleLoginModalClose} />
            </PopUp>

            {/* Register Modal */}
            <PopUp infoFunc={registerModal} closeHandle={handleRegisterModalClose}>
                <RegisterForm handleCloseModal={handleRegisterModalClose} />
            </PopUp>
        </nav>
    )
}
