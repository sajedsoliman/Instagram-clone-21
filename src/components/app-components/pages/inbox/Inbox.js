
// Router
import { Route, Switch, useLocation, useRouteMatch } from 'react-router-dom'


// UI imports
import { Card, Container, Grid, makeStyles } from '@material-ui/core'

// Contexts

// Component imports
import AppPage from '../AppPage'
import ChatsSide from './ChatsSide'
import ActiveChat from './single-chat/ActiveChat'


// style staff
const useStyles = makeStyles(theme => ({
}))

function Inbox() {
    const classes = useStyles()

    // Router imports
    const { path } = useRouteMatch()

    return (
        <AppPage additionalClass={classes.page}>
            <Container maxWidth="md">
                <Card variant="outlined" className={classes.pageCard}>
                    <Grid container className={classes.inboxGrid}>

                        {/* All chats side */}
                        <ChatsSide />

                        {/* active (opened chat) - using another switch here (nesting system) */}
                        <Switch>
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
