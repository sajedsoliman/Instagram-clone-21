import { Link as RouterLink } from 'react-router-dom'


// UI imports
import { Avatar, ListItem, ListItemAvatar, ListItemText, makeStyles } from '@material-ui/core'

// Component imports

// style staff
const useStyles = makeStyles({

})

function ChatItem({ chat, authUserId, chatDocId }) {
    // destructuring the chat
    const { lastMsg, members } = chat

    // Get some info
    const senToMember = members.find(member => member.id != authUserId)

    return (
        <ListItem button to={{ pathname: `/direct/inbox/t/${chatDocId}` }} component={RouterLink}>
            <ListItemAvatar>
                <Avatar src={senToMember.avatar} />
            </ListItemAvatar>

            {/* To edited with an advanced algorithm */}
            <ListItemText primary={senToMember.username} secondary={lastMsg.text} />
        </ListItem>
    )
}

export default ChatItem
