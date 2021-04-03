import { useEffect, useState } from 'react'
// Router
import { useParams } from 'react-router-dom'

// UI imports
import { Grid, makeStyles } from '@material-ui/core'

// Contexts
import { AuthedUser } from '../../../../user-context/AuthedUserContext'
import { Layout } from '../../../../contexts/layout-context/LayoutContext'

// Component imports
import Store from '../../../../common-components/firebase/Store'
import ChatHeader from './ChatHeader'
import ChatMessages from './ChatMessages'
import ChatDetails from './ChatDetails'


import { db } from '../../../../common-components/firebase/database'

function ActiveChat() {
    const layout = Layout()

    // Styles
    const useStyles = makeStyles(theme => ({
        gridItem: {
            height: `calc(100vh - ${layout.header.desktop.height}px - 34px)`,

            // the extra 10px to fully see the send message form
            // layout.header.mobile.height for the bottom bar
            [theme.breakpoints.down("sm")]: {
                height: `calc(100vh - ${layout.header.mobile.height}px - 40px)`, /* 40px for the mobile browser header */
            }
        },
    }))

    const loggedUser = AuthedUser()
    const classes = useStyles()

    // State vars
    // Put details here so I can toggle details on mobile (because react router requires to put the active chat mobile router in app component)
    // so we can't toggle details on mobile
    const [details, setDetails] = useState(false)
    const [chat, setChat] = useState(null)

    // Router
    const { chatId } = useParams()

    // Import Store component to handle fetching the chat
    const { getChat } = Store()

    // put a listener on this chat
    useEffect(() => {
        let unsubscribe;
        // Fetch chat and put a listener
        if (loggedUser && loggedUser.uid) {
            unsubscribe = getChat(loggedUser.uid, chatId, setChat)
        }

        return () => {
            unsubscribe()

            db.collection("members")
                .doc(loggedUser.uid)
                .collection("chats")
                .doc(chatId)
                .get()
                .then(chatDoc => {
                    const setToMember = chatDoc.data().members.find(member => member.id != loggedUser.uid)

                    // Set in chat state to false for the other user
                    db.collection("members")
                        .doc(setToMember.id)
                        .collection("chats")
                        .doc(chatId)
                        .update({ inChat: false })
                })
        }
    }, [chatId])

    // handel toggle chat details
    const toggleDetailsHandler = () => {
        setDetails(!details)
    }

    if (chat == null) return null

    // Get some info
    const senToMember = chat.members.find(member => member.id != loggedUser.uid)

    // Chat header props
    const headerProps = {
        detailsOpen: details,
        toggleDetailsHandler,
        member: senToMember,
    }

    return (
        <Grid className={classes.gridItem} item xs={12} md={8}>
            <ChatHeader {...headerProps} />
            {
                details ? (
                    <ChatDetails senToMember={senToMember} chatId={chatId} chat={chat} />
                ) : (
                    <ChatMessages chat={chat}
                        senToMember={senToMember}
                        chatId={chatId}
                        userId={loggedUser.uid} />
                )
            }
        </Grid>
    )
}

export default ActiveChat
