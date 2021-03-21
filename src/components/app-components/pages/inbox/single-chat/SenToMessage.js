// UI imports
import { makeStyles, Typography } from '@material-ui/core'

// style staff
const useStyles = makeStyles(theme => ({
    message: {
        marginRight: "auto",
        borderColor: "rgb(232 232 232) !important",
        color: "rgb(21 21 21)"
    }
}))

function SenToMessage({ messageBody }) {
    const classes = useStyles()

    return (
        <Typography className={`${classes.message} chat-message`}>
            {messageBody}
        </Typography>
    )
}

export default SenToMessage
