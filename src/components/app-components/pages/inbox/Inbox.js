// Router
import { Route, Switch, useLocation, useRouteMatch } from 'react-router-dom'


// UI imports
import { Card, Container, Grid, makeStyles } from '@material-ui/core'

// Contexts
import { AuthedUser } from '../../../user-context/AuthedUserContext'
import { Layout } from '../../../contexts/layout-context/LayoutContext'

// Component imports
import AppPage from '../AppPage'
import ChatsSide from './ChatsSide'
import ActiveChat from './single-chat/ActiveChat'
import SendMessageSide from './SendMessageSide'


// style staff
const useStyles = makeStyles(theme => ({
    page: {
        paddingTop: 90
    },
}))


function Inbox() {
    const layout = Layout()
    const classes = useStyles()


    // Router imports
    const { path } = useRouteMatch()
    const location = useLocation()

    return (
        <AppPage additionalClass={classes.page}>
            <Container maxWidth="md">
                <Card variant="outlined" className={classes.pageCard}>
                    <Grid container className={classes.inboxGrid}>

                        {/* All chats side */}
                        <ChatsSide user />

                        {/* active (opened chat) - using another switch here (nesting system) */}
                        <Switch>
                            {/* <Route path={path} exact>
                                <SendMessageSide />
                            </Route> */}
                            <Route path={`${path}/t/:chatId`}>
                                <ActiveChat />
                            </Route>
                        </Switch>
                    </Grid>
                </Card>
            </Container>
        </AppPage>
    )
}

export default Inbox
