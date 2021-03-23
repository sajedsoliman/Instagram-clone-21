// UI imports
import { Avatar, makeStyles, Typography } from '@material-ui/core'

// Icons
import MoreHoriz from '@material-ui/icons/MoreHoriz';
import { useState } from 'react';

// style staff
const useStyles = makeStyles(theme => ({
    wrapper: {
        position: "relative",
        left: 12,
        maxWidth: "50%",
    },
    message: {
        marginRight: "auto",
        position: "relative",
        color: "rgb(21 21 21)",
        border: "1px solid rgb(232 232 232)",
        padding: 10,
        borderRadius: 20,
        wordBreak: "break-word",
        cursor: "default"
    },
    avatar: {
        width: 25,
        height: 25,
        left: -27,
        top: -18
    },
    optionsIcon: {
        position: "absolute",
        right: -30,
        cursor: "pointer",
        top: "50%",
        transform: "translateY(-50%)",

        "&:hover": {
            opacity: .7
        }
    }
}))

function SenToMessage({ message, senToUser, msgOptions, lastMsg, messages, msgIndex }) {
    const classes = useStyles()

    // Implement avatar show
    const showAvatar =
        ((lastMsg.id == senToUser.id) && message.body == lastMsg.text)
        || (messages[msgIndex + 1]?.message.senderId != senToUser.id)

    return (
        <div className={classes.wrapper}>
            <Typography className={`${classes.message} chat-message`}>
                {message.body}
                {/* Option icon */}
                {
                    msgOptions &&
                    <MoreHoriz className={classes.optionsIcon} />
                }
            </Typography>
            {
                showAvatar ? <Avatar className={classes.avatar} src={senToUser.avatar} /> : null
            }
        </div>

    )
}

export default SenToMessage
