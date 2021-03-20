// UI imports
import { Grow, makeStyles, Typography } from '@material-ui/core'

// style staff
const useStyles = makeStyles(theme => ({
    message: {
        marginRight: "auto",
        border: "1px solid rgb(232 232 232)",
        padding: 10,
        borderRadius: 20,
        color: "rgb(21 21 21)"
    }
}))

function SenToMessage({ messageBody }) {
    const classes = useStyles()

    return (
        <Grow in={true}>
            <Typography className={classes.message}>
                {messageBody}
            </Typography>
        </Grow>
    )
}

export default SenToMessage
