import { useEffect, useState } from 'react'
// Router
import { useLocation, useParams } from 'react-router-dom'

// UI imports
import { } from '@material-ui/core'

// Contexts
import { AuthedUser } from '../../../../user-context/AuthedUserContext'

// Component imports
import Store from '../../../../common-components/firebase/Store'
import ChatHeader from './ChatHeader'
import ChatMessages from './ChatMessages'
import ChatDetails from './ChatDetails'


function ActiveChat() {
    const loggedUser = AuthedUser()

    // State vars
    const [chat, setChat] = useState(null)

    // Router
    const { chatId } = useParams()

    // State vars
    const [details, setDetails] = useState(false)

    // handel toggle chat details
    const toggleDetailsHandler = () => {
        setDetails(!details)
    }

    // Import Store component to handle fetching the chat
    const { getChat } = Store()

    // put a listener on this chat
    useEffect(() => {
        // Fetch chat and put a listener
        if (loggedUser && loggedUser.uid) {
            getChat(loggedUser.uid, chatId, setChat)
        }
    }, [chatId])

    if (chat == null) return null

    // Get some info
    const senToMember = chat.members.find(member => member.id != loggedUser.uid)

    // Chat header props
    const headerProps = {
        detailsOpen: details,
        toggleDetails: toggleDetailsHandler,
        member: senToMember
    }

    return (
        <>
            <ChatHeader {...headerProps} />
            {
                details ? (
                    <ChatDetails senToMember={senToMember} chatId={chatId} chat={chat} />
                ) : (
                    <ChatMessages senToMember={senToMember} chatId={chatId} userId={loggedUser.uid} />
                )
            }
        </>
    )
}

export default ActiveChat
