// Material-UI imports
import { makeStyles } from '@material-ui/core'
import clsx from 'clsx'

// style
const useStyles = makeStyles(theme => ({
    page: {
        paddingTop: 150,
        maxHeight: "100vh",
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
