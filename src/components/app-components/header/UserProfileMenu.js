import { useLocation, Link as RouterLink } from 'react-router-dom'

// UI imports
import { MenuItem, MenuList, Divider, makeStyles, ClickAwayListener } from '@material-ui/core'

// Icons
import { Settings, SupervisedUserCircle } from '@material-ui/icons'

// Contexts
import { AuthedUser } from '../../user-context/AuthedUserContext'

// server
import { auth, db } from '../../common-components/firebase/database'

// Component imports
import Store from '../../common-components/firebase/Store'

// Styles
const useStyles = makeStyles(theme => ({
    menu: {
        minWidth: 200,
    },
    item: {
        marginRight: "0 !important",
        "& svg": {
            marginRight: 15
        }
    },
}))

function UserProfileMenu({ handleCloseMenu }) {
    const loggedUser = AuthedUser()
    const classes = useStyles()

    // Router
    const location = useLocation()

    // Import Store component to offline the user
    const { changeUserActiveState } = Store()

    // handle logout the user
    const handleLogout = () => {
        auth.signOut()


        // empty the location state
        if (location.state && location.state.user) {
            location.state.user = false
        }

        // close the popper when logout
        handleCloseMenu()
    }


    // menu link common props
    const menuItemProps = {
        className: classes.item,
        dense: true,
        component: RouterLink,
        onClick: handleCloseMenu
    }

    return (
        <ClickAwayListener onClickAway={handleCloseMenu}>
            <MenuList disablePadding autoFocusItem className={classes.menu}>
                {/* Profile */}
                <MenuItem
                    {...menuItemProps}
                    to={`/${loggedUser.username}`}>
                    <SupervisedUserCircle /> Profile
            </MenuItem>
                {/* Settings */}
                <MenuItem
                    {...menuItemProps}
                    to={`/accounts/edit`}>
                    <Settings /> Settings
            </MenuItem>
                <Divider />
                {/* Logout Functionality */}
                <MenuItem dense onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
        </ClickAwayListener>
    )
}

export default UserProfileMenu
