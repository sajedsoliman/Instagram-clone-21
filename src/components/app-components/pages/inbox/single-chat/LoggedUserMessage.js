// UI imports
import { Grow, makeStyles, Typography } from '@material-ui/core'

// style staff
const useStyles = makeStyles(theme => ({
    message: {
        marginLeft: "auto",
        border: "none !important",
        background: "rgb(232 232 232)",
        color: "rgb(21 21 21)"
    }
}))

function LoggedUserMessage({ messageBody }) {
    const classes = useStyles()

    return (
        <Typography className={classes.message}>
            {messageBody}
        </Typography>
    )
}

export default LoggedUserMessage
