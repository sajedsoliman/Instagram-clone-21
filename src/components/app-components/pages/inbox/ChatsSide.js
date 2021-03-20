import { useEffect, useState } from 'react'
// UI imports
import { AppBar, Card, CardHeader, List, makeStyles, Toolbar, Typography } from '@material-ui/core'
import ChatItem from './ChatItem'

// Component imports
import Store from '../../../common-components/firebase/Store'

// Contexts
import { AuthedUser } from '../../../user-context/AuthedUserContext'


// style staff
const useStyles = makeStyles(theme => ({
    card: {
        height: "100%",
        borderRight: `1px solid ${theme.palette.divider}`
    },
    headerInfo: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        height: 35
    },
    toolbar: {

    },
    username: {
        fontSize: 17
    },
    chatList: {
        height: "calc(100% - 68px)", /* 65px => header height */
        overflowY: "auto"
    }
}))



function ChatsSide() {
    const loggedUser = AuthedUser()
    const classes = useStyles()

    // State vars
    const [chats, setChats] = useState([])

    // Imports Store component
    const { getUserChats } = Store()

    // use Effect to get all user's chats
    useEffect(() => {
        if (loggedUser) {

            // fetch their chats
            getUserChats(loggedUser.uid, setChats)
        }
    }, [])

    // map through chats
    const mappedChats = chats.map(chatDoc => {
        const { id, chat } = chatDoc

        return <ChatItem key={id} chat={chat} chatDocId={id} authUserId={loggedUser.uid} />
    })

    return (
        <div className={classes.card}>
            <CardHeader
                className={classes.headerInfo}
                title={loggedUser?.username}
                titleTypographyProps={{ className: classes.username, align: "center" }}

            />
            <List className={classes.chatList}>
                {mappedChats}
            </List>
        </div>
    )
}

export default ChatsSide
