import { Link as RouterLink } from 'react-router-dom'
// Material-Ui imports
import { List, ListItem, ListItemText, makeStyles } from '@material-ui/core'

// component imports
import { auth } from '../../../../common-components/firebase/database'

// styles
const useStyles = makeStyles(theme => ({
    list: {

        "& .MuiListItem-root": {
            textAlign: "center"
        }
    }
}))

function SettingsMenu({ closeMenu }) {
    const classes = useStyles()

    // handle logout - signOut
    const handleLogout = () => {
        auth.signOut()
    }

    // list item props
    const itemProps = (clickHandler = null) => ({
        onClick: clickHandler,
        button: true,
        divider: true,
    })

    return (
        <List disablePadding className={classes.list}>
            <ListItem {...itemProps()} component={RouterLink} to="/accounts/change_password">
                <ListItemText>Change Password</ListItemText>
            </ListItem>
            <ListItem  {...itemProps(handleLogout)}>
                <ListItemText>Logout</ListItemText>
            </ListItem>
            <ListItem {...itemProps(closeMenu)}>
                <ListItemText>Cancel</ListItemText>
            </ListItem>
        </List>

    )
}

export default SettingsMenu
