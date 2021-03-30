import { useEffect, useState } from 'react'

// UI imports
import { Container, makeStyles, Typography } from '@material-ui/core'

// Component imports
import AppPage from '../AppPage'
import Activity from '../../../common-components/header/Activity'
import Store from '../../../common-components/firebase/Store'

// hooks
import useWindowWidth from '../../../common-components/hooks/useWindowWidth'

// Styles
const useStyles = makeStyles(theme => ({
    title: {
        marginLeft: 15,
        marginBottom: 5
    },
    item: {
        background: "rgb(249 249 249)",
        marginBottom: 6
    }
}))

function Activities() {
    const classes = useStyles()

    // State vars
    const [notifications, setNotifications] = useState([])

    // Import Store component to get all notifications
    const { getNotifications } = Store()

    // Import window width hook
    const { windowWidth } = useWindowWidth()

    // Put a listener on notification and get them once the change
    useEffect(() => {
        getNotifications(setNotifications)
    }, [])

    // Map through notification
    const mappedNotifications = notifications.map(alert => {
        const { id, body } = alert
        return <Activity key={id} id={id} activity={body} isButton={true} itemStyles={classes.item} />
    })


    return (
        <AppPage>
            <Container disableGutters={windowWidth < 600} maxWidth="md">
                <Typography className={classes.title} variant="h6">Your Recent Activity</Typography>
                {mappedNotifications}
            </Container>
        </AppPage>
    )
}

export default Activities
