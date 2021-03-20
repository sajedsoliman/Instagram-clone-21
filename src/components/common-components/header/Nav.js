import { Link as RouterLink } from 'react-router-dom'
import { useContext, useState } from 'react'
import clsx from "clsx"

// Material-UI imports
import makeStyles from "@material-ui/core/styles/makeStyles"
import Link from "@material-ui/core/Link"
import Avatar from "@material-ui/core/Avatar"
import Button from "@material-ui/core/Button"
import MenuItem from "@material-ui/core/MenuItem"

// icons
import HomeOutlined from '@material-ui/icons/HomeOutlined';
import Home from "@material-ui/icons/Home"
import InboxIcon from '@material-ui/icons/Inbox';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import { Settings, SupervisedUserCircle } from '@material-ui/icons'

// component imports / info
import CustomMenuList from "../CustomMenuList"
import info from "./info"
import { auth } from "../firebase/database"
import { AuthedUser } from '../../user-context/AuthedUserContext'
import { Divider } from '@material-ui/core'


const useStyles = makeStyles((theme) => ({
    linkNav: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
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
    signinBtn: {
        marginLeft: 20,
        marginRight: 5
    },
    item: {
        marginRight: "0 !important",
        "& svg": {
            marginRight: 15
        }
    },
    menu: {
        minWidth: 200
    },
}))

export default function Nav({ handleLoginModalOpen, handleRegisterModalOpen }) {
    const user = AuthedUser()

    const [anchorEl, setAnchorEl] = useState(null)

    const handleAnchorEl = (e) => {
        setAnchorEl(e.currentTarget)
    }

    const handleCloseMenu = () => {
        setAnchorEl(null)
    }

    // handle logout
    const handleLogout = () => {
        auth.signOut()
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
        <nav className={classes.linkNav}>
            <Link href="/">
                {Boolean(anchorEl) ? <HomeOutlined fontSize="large" /> : <Home fontSize="large" />}
            </Link>

            {
                user ?
                    <div className={classes.secondaryLinks}>
                        <Link to="/direct/inbox" component={RouterLink}>
                            <InboxIcon />
                        </Link>
                        <Link href="/" >
                            <i className="far fa-compass" />
                        </Link>
                        <Link href="/">
                            <FavoriteBorderIcon />
                        </Link>
                        <Link onClick={handleAnchorEl} aria-haspopup="true">
                            <Avatar className={clsx(classes.userAvatar, { "active": anchorEl })} src={user.avatar} alt="Profile Avatar" />
                        </Link>

                        {Boolean(anchorEl) &&
                            (<CustomMenuList menuClassName={classes.menu} placement={"bottom"} anchorEl={anchorEl} handleClose={handleCloseMenu}>
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

                    : (
                        <>
                            <Button className={classes.signinBtn} variant="outlined" color="primary" size="small" onClick={handleLoginModalOpen}>Login</Button>

                            <Button className={classes.registerBtn} variant="outlined" color="primary" size="small" onClick={handleRegisterModalOpen}>Register</Button>
                        </>
                    )
            }
        </nav>
    )
}
