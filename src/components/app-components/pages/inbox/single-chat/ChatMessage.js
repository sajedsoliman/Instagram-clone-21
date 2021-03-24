// UI imports
import { Grow, makeStyles } from '@material-ui/core'
import { useState } from 'react'

// Contexts
import { AuthedUser } from '../../../../user-context/AuthedUserContext'

// Component imports
import LoggedUserMessage from './LoggedUserMessage'
import SenToMessage from './SenToMessage'

// style staff
const useStyles = makeStyles(theme => ({
    msgWrapper: {
        display: "flex",
        marginBottom: 10,
    }
}))


function ChatMessage({ message, senToUser, chat, messages, msgIndex }) {
    const loggedUser = AuthedUser()
    const classes = useStyles()

    // State var
    const [msgOptions, setMsgOptions] = useState(false)

    // handle show msg options icon
    const handleMsgOptionsShow = () => {
        setMsgOptions(true)
    }

    // handle vanish msg options icon
    const handleMsgOptionsClose = () => {
        setMsgOptions(false)
    }

    // Check if the message is yours
    const isYours = message.senderId == loggedUser.uid

    return (
        <Grow in={true}>
            <div className={classes.msgWrapper} onMouseLeave={handleMsgOptionsClose}
                onMouseOver={handleMsgOptionsShow}>
                {
                    isYours ? (
                        <LoggedUserMessage msgSeen={chat.lastMsgSeen} msgOptions={msgOptions} messageBody={message.body} />
                    ) : (
                        <SenToMessage messages={messages} msgIndex={msgIndex} lastMsg={chat.lastMsg} msgOptions={msgOptions} senToUser={senToUser} message={message} />
                    )
                }
            </div>
        </Grow>
    )
}

export default ChatMessage
