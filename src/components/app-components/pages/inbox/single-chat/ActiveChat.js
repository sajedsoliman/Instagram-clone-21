import { useEffect, useState } from 'react'
// Router
import { useLocation, useParams } from 'react-router-dom'

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

function ActiveChat() {
    const layout = Layout()

    // Styles
    const useStyles = makeStyles(theme => ({
        gridItem: {
            height: `calc(100vh - ${layout.header.desktop.height}px - 34px)`,

            // the extra 10px to fully see the send message form
            // layout.header.mobile.height for the bottom bar
            [theme.breakpoints.down("sm")]: {
                height: `calc(100vh - ${layout.header.mobile.height}px - 10px)`,
            }
        },
    }))

    const loggedUser = AuthedUser()
    const classes = useStyles()

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
    const senToMember = chat?.members.find(member => member.id != loggedUser.uid)


    // Chat header props
    const headerProps = {
        detailsOpen: details,
        toggleDetails: toggleDetailsHandler,
        member: senToMember,
    }

    return (
        <Grid className={classes.gridItem} item xs={12} md={8}>
            <ChatHeader {...headerProps} />
            {
                details ? (
                    <ChatDetails senToMember={senToMember} chatId={chatId} chat={chat} />
                ) : (
                    <ChatMessages chat={chat} senToMember={senToMember} chatId={chatId} userId={loggedUser.uid} />
                )
            }
        </Grid>
    )
}

export default ActiveChat
