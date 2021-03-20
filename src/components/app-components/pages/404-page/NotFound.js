// Material-UI imports
import { makeStyles, Typography } from '@material-ui/core'
import { Link } from 'react-router-dom'

// Component imports
import AppPage from '../AppPage'

// styles
const useStyles = makeStyles({
    homeLink: {
        textDecoration: "none"
    },
})

function NotFound() {
    const classes = useStyles()

    return (
        <AppPage>
            {/* title */}
            <Typography className={classes.title}
                align="center"
                paragraph
                variant="h6">Sorry, this page isn't available.</Typography>

            {/* note */}
            <Typography variant="body1" align="center">
                The link you followed may be broken, or the page may have been removed.
                <Link className={classes.homeLink} to="/"> Go back to home page.</Link>
            </Typography>
        </AppPage>
    )
}

export default NotFound
