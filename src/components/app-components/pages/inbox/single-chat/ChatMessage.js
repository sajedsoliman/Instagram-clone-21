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


function ChatMessage({ message, senToUser }) {
    const loggedUser = AuthedUser()
    const classes = useStyles()

    // State var
    const [msgOptions, setMsgOptions] = useState(true)

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
                        <LoggedUserMessage msgOptions={msgOptions} messageBody={message.body} />
                    ) : (
                        <SenToMessage msgOptions={msgOptions} senToUser={senToUser} messageBody={message.body} />
                    )
                }
            </div>
        </Grow>
    )
}

export default ChatMessage
