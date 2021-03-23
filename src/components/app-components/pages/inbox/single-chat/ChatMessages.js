import { useEffect, useRef, useState } from 'react'

// UI imports
import { CardContent, Container, List, makeStyles } from '@material-ui/core'

// Contexts

// Component imports
import Store from '../../../../common-components/firebase/Store'
import ChatMessage from './ChatMessage'
import AddMessageForm from './AddMessageForm'


// style staff
const useStyles = makeStyles(theme => ({
    wrapper: {
        height: "calc(100% - 68px)" /* 68px => header's height,  */
    },
    messageListWrapper: {
        boxSizing: "border-box",
        height: "calc(100% - 65px)", /* 65px => add message form height */
        maxHeight: "calc(100% - 65px)", /* 65px => add message form height */
        overflowY: "scroll",
        overflowX: "hidden",

        // scroll shape
        "&::-webkit-scrollbar": {
            backgroundColor: "transparent",
            width: 2
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgb(9 140 232 / 85%)"
        }
    },
    messagesList: {
    }
}))

function ChatMessages({ chatId, userId, senToMember, chat }) {
    const classes = useStyles()

    // Ref
    const messageListRef = useRef()

    // State vars
    const [messages, setMessages] = useState([])

    // Import Store component
    const { getChatMessages } = Store()

    // another listener on messages to auto-scroll down the messages list
    useEffect(() => {
        if (messageListRef && messageListRef.current) {
            messageListRef.current.scrollTo({ top: messageListRef.current.scrollHeight })
        }
    }, [messages])

    // put a listener on messages' collection
    useEffect(() => {
        if (userId) {
            // put a listener on messages
            getChatMessages(userId, chatId, setMessages)
        }
    }, [chatId])

    // map through messages
    const mappedMessages = messages.map((msg, index) => {
        // provide message as a prop to handle senToUser avatar visibility
        // also provide the index of the current message to check each message's following message
        // go to senToMessage for more clarifying
        const { id, message } = msg
        return <ChatMessage chat={chat} msgIndex={index} messages={messages} key={id} message={message} senToUser={senToMember} />
    })

    // add message form props
    const messageFormProps = {
        chatId,
        senToId: senToMember.id,
        loggedUserId: userId,
    }

    return (
        <Container className={classes.wrapper}>
            {/* Messages wrapper */}
            <CardContent ref={messageListRef} className={classes.messageListWrapper}>
                {/* Messages themselves */}
                <List className={classes.messagesList}>
                    {mappedMessages}
                </List>
            </CardContent>

            {/* add message form */}
            <AddMessageForm {...messageFormProps} />
        </Container>
    )
}

export default ChatMessages
