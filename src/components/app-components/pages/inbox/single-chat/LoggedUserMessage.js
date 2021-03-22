// UI imports
import { Grow, makeStyles, Typography } from '@material-ui/core'

// style staff
const useStyles = makeStyles(theme => ({
    message: {
        marginLeft: "auto",
        background: "rgb(232 232 232)",
        color: "rgb(21 21 21)",
        padding: 10,
        borderRadius: 20,
        maxWidth: "50%",
        wordBreak: "break-word"
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
