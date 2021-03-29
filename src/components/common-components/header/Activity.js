import { Link as RouterLink } from 'react-router-dom'

// UI imports
import { Avatar, ListItem, ListItemAvatar, ListItemText, makeStyles } from "@material-ui/core"
import clsx from 'clsx'

// component
import Store from '../firebase/Store'

// Styles
const useStyles = makeStyles(theme => ({
    item: {
        color: "black"
    }
}))


function Activity({ activity, closePopper, id }) {
    const classes = useStyles()

    // Destructuring through the activity
    const { text, link, seen, notificationorAvatar } = activity

    // Import Store to handle seen status
    const { handleSeenNotification } = Store()

    // handle Click notification
    const handleCLick = () => {
        // close the poper
        closePopper()

        // update seen true
        handleSeenNotification(id)
    }

    return (
        <ListItem className={classes.item}
            to={`/${link}`}
            component={RouterLink}
            onClick={handleCLick}>
            <ListItemAvatar>
                <Avatar src={notificationorAvatar} />
            </ListItemAvatar>
            <ListItemText primary={text}
                primaryTypographyProps={{
                    style: { fontWeight: !seen && "bold" },
                    variant: "body2"
                }} />
        </ListItem>
    )
}

export default Activity


// Activity date
