import { Link as RouterLink } from 'react-router-dom'

// UI imports
import { Avatar, ListItem, ListItemAvatar, ListItemText, makeStyles } from "@material-ui/core"
import clsx from 'clsx'

// component
import Store from '../firebase/Store'

// Functions
import { presenceDate } from '../../app-components/utilities/functions'


// Styles
const useStyles = makeStyles(theme => ({
    item: {
        color: "black",
    },
    title: {

        "&.not-seen": {
            fontWeight: "bold"
        }
    }
}))


// isButton => if the menu item has the button attr or not (default => not)
// item styles => to add custom style on items if need
// closePopper => to close the popper if users in desktop
function Activity({ activity, closePopper, id, isButton = false, itemStyles }) {
    const classes = useStyles()

    // Destructuring through the activity
    const { text, link, seen, notificationorAvatar, date } = activity

    // Import Store to handle seen status
    const { handleSeenNotification } = Store()

    // handle Click notification
    const handleCLick = () => {
        // close the popper if the user is not inside of the noti route
        if (closePopper != undefined) {
            closePopper()
        }

        // update seen true
        handleSeenNotification(id)
    }

    return (
        <ListItem className={clsx(itemStyles, classes.item)}
            to={`/${link}`}
            button={isButton}
            component={RouterLink}
            onClick={handleCLick}>
            <ListItemAvatar>
                <Avatar src={notificationorAvatar} />
            </ListItemAvatar>
            <ListItemText
                secondary={presenceDate(date)}
                primary={text}
                primaryTypographyProps={{
                    className: clsx(classes.title, { "not-seen": !seen }),
                    variant: "body2"
                }} />
        </ListItem>
    )
}

export default Activity


// Activity date
