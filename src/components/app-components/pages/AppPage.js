// Material-UI imports
import { makeStyles } from '@material-ui/core'
import clsx from 'clsx'

// style
const useStyles = makeStyles(theme => ({
    page: {
        paddingTop: 90,
        height: "100vh",
        overflowY: "auto",
        boxSizing: "border-box",

        // to disable the padding in mobiles
        [theme.breakpoints.down("xs")]: {
            paddingTop: 20,
            paddingBottom: 40
        }
    },
}))

function AppPage({ children, additionalClass }) {
    const classes = useStyles()

    return (
        <div className={clsx(classes.page, additionalClass)}>
            {children}
        </div>
    )
}

export default AppPage
