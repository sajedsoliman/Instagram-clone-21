// Router
import { Route, Switch, useLocation, useRouteMatch } from 'react-router-dom'


// UI imports
import { Card, Container, Grid, makeStyles } from '@material-ui/core'

// Contexts
import { AuthedUser } from '../../../user-context/AuthedUserContext'


// Component imports
import AppPage from '../AppPage'
import ChatsSide from './ChatsSide'
import ActiveChat from './single-chat/ActiveChat'
import SendMessageSide from './SendMessageSide'


// style staff
const useStyles = makeStyles({
    page: {
        paddingTop: 90
    },
    gridItem: {
        height: "87vh",
    }
})


function Inbox() {
    const classes = useStyles()

    // Router imports
    const { path } = useRouteMatch()
    const location = useLocation()


    return (
        <AppPage additionalClass={classes.page}>
            <Container maxWidth="md">
                <Card variant="outlined" className={classes.pageCard}>
                    <Grid container>

                        {/* All chats side */}
                        <Grid className={classes.gridItem} item xs={12} md={4}>
                            <ChatsSide user />
                        </Grid>

                        {/* active (opened chat) - using another switch here (nesting system) */}
                        <Grid item xs={12} md={8}>
                            <Switch location={location}>
                                <Route path={path} exact>
                                    <SendMessageSide />
                                </Route>
                                <Route path={`${path}/t/:chatId`}>
                                    <ActiveChat />
                                </Route>
                            </Switch>
                        </Grid>
                    </Grid>
                </Card>
            </Container>
        </AppPage>
    )
}

export default Inbox
