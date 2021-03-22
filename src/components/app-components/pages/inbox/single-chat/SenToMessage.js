// UI imports
import { Avatar, makeStyles, Typography } from '@material-ui/core'

// style staff
const useStyles = makeStyles(theme => ({
    wrapper: {
        position: "relative",
        left: 12,
        maxWidth: "50%",
    },
    message: {
        marginRight: "auto",
        color: "rgb(21 21 21)",
        border: "1px solid rgb(232 232 232)",
        padding: 10,
        borderRadius: 20,
        wordBreak: "break-word",
    },
    avatar: {
        width: 25,
        height: 25,
        left: -27,
        top: -18
    }
}))

function SenToMessage({ messageBody, senToUser }) {
    const classes = useStyles()

    return (
        <div className={classes.wrapper}>
            <Typography className={`${classes.message} chat-message`}>
                {messageBody}
            </Typography>
            <Avatar className={classes.avatar} src={senToUser.avatar} />
        </div>

    )
}

export default SenToMessage
