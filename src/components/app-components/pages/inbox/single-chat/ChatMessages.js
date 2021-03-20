import { useEffect, useState } from 'react'

// UI imports
import { CardActions, CardContent, Container, List, makeStyles } from '@material-ui/core'

// Contexts

// Component imports
import Store from '../../../../common-components/firebase/Store'
import ChatMessage from './ChatMessage'


// style staff
const useStyles = makeStyles(theme => ({
    wrapper: {
        height: "100%"
    },
    messagesList: {

    }
}))

function ChatMessages({ chatId, userId }) {
    const classes = useStyles()

    // State vars
    const [messages, setMessages] = useState([])

    // Import Store component
    const { getChatMessages } = Store()

    // put a listener on messages' collection
    useEffect(() => {
        if (userId) {
            // put a listener on messages
            getChatMessages(userId, chatId, setMessages)
        }
    }, [chatId])

    // map through messages
    const mappedMessages = messages.map(msg => {
        const { id, message } = msg
        return <ChatMessage key={id} message={message} />
    })

    return (
        <Container className={classes.wrapper}>
            {/* Messages wrapper */}
            <CardContent>
                {/* Messages themselves */}
                <List className={classes.messagesList}>
                    {mappedMessages}
                </List>
            </CardContent>

            {/* add message form */}
            <CardActions>
            </CardActions>
        </Container>
    )
}

export default ChatMessages
