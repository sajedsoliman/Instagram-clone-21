import { useState } from 'react'

// Router
import { Link as RouterLink, useHistory } from 'react-router-dom'

// UI imports
import { Avatar, CardActions, CardContent, Link, List, ListItem, ListItemAvatar, ListItemText, makeStyles, Typography } from '@material-ui/core'

// Component imports
import Controls from '../../../../common-components/controls/Controls'
import Store from '../../../../common-components/firebase/Store'
import ConfirmPopUp from '../../../../common-components/ConfirmPopUp'


// Contexts
import { AuthedUser } from '../../../../user-context/AuthedUserContext'
import clsx from 'clsx'

// style staff
const useStyles = makeStyles(theme => ({
    action: {
        borderBottom: `1px solid ${theme.palette.divider}`
    },
    title: {
        fontSize: 17,
        padding: "10px 15px 0"
    },
    actionsWrapper: {
        display: "flex",
        flexDirection: "column",


        "& .MuiTypography-root": {
            marginLeft: 0,
            marginBottom: 5,
            cursor: "pointer",
        }
    }
}))


function ChatDetails({ chat, senToMember, chatId, }) {
    const classes = useStyles()
    const loggedUser = AuthedUser()

    // Router imports
    const history = useHistory()

    // Destructuring the chat
    const { isMuted } = chat

    // State vars
    const [dialog, setDialog] = useState(false)

    // Imports Store to change the change muted value
    const { toggleChatMute } = Store()

    // handle toggle chat mute
    const toggleMute = (e) => {
        toggleChatMute(chatId, e.target.checked)
    }

    // handle close delete dialog
    const handleDialogOpen = () => {
        setDialog(!dialog)
    }

    // delete dialog function
    const dialogFunc = {
        title: "Delete Chat?",
        subTitle: "Deleting removes the chat from your inbox, but no one else's inbox.",
        isOpen: dialog,
        onConfirm: handleDeleteChat
    }

    // Import Store component to delete the chat
    const { deleteChat } = Store()

    // handle delete the chat
    function handleDeleteChat() {
        deleteChat(chatId, onDelete)

        function onDelete() {
            // Close the dialog
            handleDialogOpen()

            console.log("here")
            // back to inbox
            history.replace("/direct/inbox")
        }
    }


    return (
        <div>
            {/* IsMuted action */}
            <CardActions className={classes.action}>
                <Controls.ReusableCheckBox checkValue={isMuted}
                    label="Mute Messages"
                    onChangeHandle={toggleMute}
                />
            </CardActions>

            {/* members list - which contains 1 member (senTo member) */}
            <div className={classes.action}>
                <Typography className={classes.title} variant="h6">Members</Typography>
                <List>
                    <ListItem to={`/${senToMember.username}`} button component={RouterLink}>
                        <ListItemAvatar>
                            <Avatar src={senToMember.avatar}></Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={senToMember.username} />
                    </ListItem>
                </List>
            </div>

            {/* some other action => delete / report / block */}
            <CardActions className={clsx(classes.action)}>
                <div className={classes.actionsWrapper}>
                    <Typography color="error" variant="body2" onClick={handleDialogOpen}>
                        Delete
                    </Typography>
                    <Typography color="error" variant="body2">
                        Block
                    </Typography>
                    <Typography color="error" variant="body2">
                        Report
                    </Typography>
                </div>
            </CardActions>

            {/* Confirm delete chat dialog */}
            <ConfirmPopUp onClose={handleDialogOpen} dialogFunc={dialogFunc} />

        </div>
    )
}

export default ChatDetails
