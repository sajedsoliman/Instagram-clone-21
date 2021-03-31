import { useEffect, useState } from 'react'

// Router
import { Link as RouterLink } from 'react-router-dom'

// UI imports
import { Avatar, Badge, ListItem, ListItemAvatar, ListItemText, makeStyles } from '@material-ui/core'

// Icons
import FiberManualRecord from '@material-ui/icons/FiberManualRecord';

// Component imports
import clsx from 'clsx'
import Store from '../../../common-components/firebase/Store'

// style staff
const useStyles = makeStyles(theme => ({
    dotBadge: {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    },
    chatAdditionalInfoTypo: {
        "&.not-seen": {
            fontWeight: "bold"
        },

        "& > span": {
            display: "flex",
            alignItems: "center",
            "& .text": {
                display: "block",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
            },

            "& .MuiSvgIcon-root": {
                fontSize: ".35rem",
                margin: "0 5px"
            }
        }
    }
}))


// toggleDetailsHandler => to pass it to active chat when render it alone (in mobiles)
function ChatItem({ chat, authUserId, chatDocId, handleCloseDetails }) {
    const classes = useStyles()

    // destructuring the chat
    const { lastMsg, members, seen } = chat

    // Router

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

    // handle getting the chat additional info (user the chat's username) (usually being the lastMsg but not always)
    const handleChatAdditionalInfo = () => {
        const { id, text, sendDate } = lastMsg


        let res
        // check if you own the last message
        if (lastMsg.id == authUserId) {
            res = <span><span className={clsx("text")}>{text}</span> <FiberManualRecord fontSize='small' /> You</span>
        } else {
            res = <span><span className="text">{text}</span></span>
        }

        return res
    }

    return (
        <ListItem
            // Close details up when click on item
            onClick={() => handleCloseDetails()}
            button to={{
                pathname: `/direct/inbox/t/${chatDocId}`, ...(window.innerWidth < 960 ? {
                    state: {
                        mobile: true,
                    }
                } : {}),
            }} component={RouterLink}>
            <ListItemAvatar>
                <Badge {...badgeProps}>
                    <Avatar src={senToMember.avatar} />
                </Badge>
            </ListItemAvatar>

            {/* To edited with an advanced algorithm */}
            <ListItemText
                primary={senToMember.username}
                secondaryTypographyProps={{
                    className: clsx(classes.chatAdditionalInfoTypo,
                        { "not-seen": !seen })
                }}
                secondary={handleChatAdditionalInfo()} />
        </ListItem>
    )
}

export default ChatItem
