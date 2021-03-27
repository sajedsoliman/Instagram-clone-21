import { useEffect, useRef, useState } from 'react'

// UI imports
import { Avatar, CardContent, Container, Grow, List, makeStyles, Typography } from '@material-ui/core'

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
    },
    msgSeen: {
        cursor: "default",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end"
    },
    seenAvatar: {
        width: 12,
        height: 12,
        marginLeft: 4,
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
        let unsubscribe
        if (userId) {
            // put a listener on messages
            unsubscribe = getChatMessages(userId, chatId, setMessages)
        }

        // To stop the listener
        return () => {
            unsubscribe()
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
        chatTyping: chat.isTyping,
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
                {/* handle message seen */}
                {chat.lastMsg.id == userId && (
                    <Typography variant="caption" component='div' align="right" className={classes.msgSeen}>
                        {chat.lastMsgSeen ? `seen by` : "sent"}
                        {chat.lastMsgSeen && <Avatar className={classes.seenAvatar} src={senToMember.avatar} />}
                    </Typography>
                )}
            </CardContent>

            {/* add message form */}
            <AddMessageForm {...messageFormProps} />
        </Container>
    )
}

export default ChatMessages
