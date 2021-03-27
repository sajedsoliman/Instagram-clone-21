import { useState } from 'react'

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

    // State vars
    // Put the details trigger to close it when click on a chat item
    const [details, setDetails] = useState(false)


    // handel toggle chat details
    const toggleDetailsHandler = () => {
        setDetails(!details)
    }

    // Handle close details
    const handleCLoseDetails = () => {
        setDetails(false)
    }


    return (
        <AppPage additionalClass={classes.page}>
            <Container maxWidth="md">
                <Card variant="outlined" className={classes.pageCard}>
                    <Grid container className={classes.inboxGrid}>

                        {/* All chats side */}
                        <ChatsSide handleCLoseDetails={handleCLoseDetails} />

                        {/* active (opened chat) - using another switch here (nesting system) */}
                        <Switch>
                            {/* <Route path={path} exact>
                                <SendMessageSide />
                            </Route> */}
                            <Route path={`${path}/t/:chatId`}>
                                <ActiveChat details={details}
                                    toggleDetailsHandler={toggleDetailsHandler} />
                            </Route>
                        </Switch>
                    </Grid>
                </Card>
            </Container>
        </AppPage>
    )
}

export default Inbox
