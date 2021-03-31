import { ClickAwayListener, makeStyles, MenuList } from "@material-ui/core"
import { useEffect, useState } from "react"

// Component imports
import Activity from "../header/Activity"

// Styles
const useStyles = makeStyles(theme => ({
    menu: {
        minWidth: 200,
        // max height to limit noti menu height and make it scroll 
        maxHeight: 400,
        overflowY: "auto"
    },
}))

function ActivityList({ notification, handleCloseNotifications }) {
    const classes = useStyles()

    // State vars
    const [noti, setNoti] = useState(notification)

    // put a listener on noti (as soon as noti change, change the list)
    useEffect(() => {
        setNoti(notification)
    }, [notification])

    // Map through notification
    const mappedNotifications = noti.map(alert => {
        const { id, body } = alert
        return <Activity key={id} id={id} activity={body} closePopper={handleCloseNotifications} />
    })


    return (
        <ClickAwayListener onClickAway={handleCloseNotifications}>
            <MenuList
                autoFocusItem
                className={classes.menu}
                disablePadding>
                {mappedNotifications}
            </MenuList>
        </ClickAwayListener>
    )
}

export default ActivityList
