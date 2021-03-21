import { Link as RouterLink } from 'react-router-dom'


// UI imports
import { Avatar, Badge, ListItem, ListItemAvatar, ListItemText, makeStyles } from '@material-ui/core'
import { useEffect, useState } from 'react'
import Store from '../../../common-components/firebase/Store'

// Component imports

// style staff
const useStyles = makeStyles(theme => ({
    dotBadge: {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    }
}))

function ChatItem({ chat, authUserId, chatDocId }) {
    const classes = useStyles()

    // destructuring the chat
    const { lastMsg, members } = chat

    // Get some info
    const senToMember = members.find(member => member.id != authUserId)

    // State vars
    const [isUserActive, setIsUserActive] = useState(false)

    // Import Store component to get the setTo user status
    const { getUserStatus } = Store()

    // get senTo user status
    useEffect(() => {
        getUserStatus(senToMember.id, setIsUserActive)
    }, [])

    // avatar badge props
    const badgeProps = {
        className: classes.badge,
        variant: "dot",
        overlap: "circle",
        anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right'
        },
        classes: { badge: classes.dotBadge },
        invisible: !isUserActive
    }

    return (
        <ListItem button to={{ pathname: `/direct/inbox/t/${chatDocId}` }} component={RouterLink}>
            <ListItemAvatar>
                <Badge {...badgeProps}>
                    <Avatar src={senToMember.avatar} />
                </Badge>
            </ListItemAvatar>

            {/* To edited with an advanced algorithm */}
            <ListItemText primary={senToMember.username} secondary={lastMsg.text} />
        </ListItem>
    )
}

export default ChatItem
