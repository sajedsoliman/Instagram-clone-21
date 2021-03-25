import { Link as RouterLink } from 'react-router-dom'
import { useState } from 'react'
import clsx from "clsx"

// Material-UI imports
import makeStyles from "@material-ui/core/styles/makeStyles"
import Link from "@material-ui/core/Link"
import Avatar from "@material-ui/core/Avatar"
import MenuItem from "@material-ui/core/MenuItem"

// icons
import HomeOutlined from '@material-ui/icons/HomeOutlined';
import Home from "@material-ui/icons/Home"
import InboxIcon from '@material-ui/icons/Inbox';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import { PostAdd, Search, Settings, SupervisedUserCircle } from '@material-ui/icons'

// component imports / info
import CustomMenuList from "../CustomMenuList"
import { auth, db } from "../firebase/database"
import { AuthedUser } from '../../user-context/AuthedUserContext'
import { Divider } from '@material-ui/core'

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
    item: {
        marginRight: "0 !important",
        "& svg": {
            marginRight: 15
        }
    },
    menuPopper: {
        [theme.breakpoints.down("xs")]: {
            top: "-12px !important",
        }
    },
    menu: {
        minWidth: 200
    },
}))

export default function Nav({ navClassName }) {
    const user = AuthedUser()

    const [anchorEl, setAnchorEl] = useState(null)

    const handleAnchorEl = (e) => {
        setAnchorEl(prev => prev == null ? e.currentTarget : null)
    }

    const handleCloseMenu = () => {
        setAnchorEl(null)
    }

    // Get window width from the hook
    const { windowWidth } = useWindowWidth()

    // handle logout
    const handleLogout = () => {
        // close the menu when logout
        handleCloseMenu()

        // update user's active state to false
        db.collection("members")
            .doc(user.uid)
            .update({
                active: false
            }).then(success => {
                auth.signOut()
            })
    }

    const classes = useStyles()

    // menu link common props
    const menuProps = {
        className: classes.item,
        dense: true,
        component: RouterLink,
        onClick: handleCloseMenu
    }

    return (
        <nav className={clsx(classes.linkNav, navClassName)}>
            <Link to="/" component={RouterLink}>
                {Boolean(anchorEl) ? <HomeOutlined fontSize="large" /> : <Home fontSize="large" />}
            </Link>

            {
                user !== "no user" &&
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
                        <InboxIcon />
                    </Link>
                    <Link to="/" >
                        <FavoriteBorderIcon />
                    </Link>
                    <Link onClick={handleAnchorEl} aria-haspopup="true">
                        <Avatar className={clsx(classes.userAvatar, { "active": anchorEl })} src={user?.avatar} alt="Profile Avatar" />
                    </Link>

                    {Boolean(anchorEl) &&
                        (<CustomMenuList
                            popperClassName={classes.menuPopper}
                            menuClassName={classes.menu}
                            placement={windowWidth < 600 ? "top-start" : "bottom-end"}
                            anchorEl={anchorEl}
                            handleClose={handleCloseMenu}>
                            {/* Profile */}
                            <MenuItem
                                {...menuProps}
                                to={`/${user.username}`}>
                                <SupervisedUserCircle /> Profile
                                    </MenuItem>
                            {/* Settings */}
                            <MenuItem
                                {...menuProps}
                                to={`/accounts/edit`}>
                                <Settings /> Settings
                                    </MenuItem>
                            <Divider />
                            {/* Logout Functionality */}
                            <MenuItem dense onClick={handleLogout}>Logout</MenuItem>
                        </CustomMenuList>)}
                </div>
            }
        </nav>
    )
}
