import { Link as RouterLink, useLocation } from 'react-router-dom'
import { useState } from "react"

// Material-UI imports
import { List, ListItem, ListItemText } from "@material-ui/core"

// Component imports
import { AuthedUser } from "../../user-context/AuthedUserContext"
import ConfirmPopUp from "../ConfirmPopUp"
import Store from '../firebase/Store'


function PostSettingsList(props) {
    const loggedUser = AuthedUser()

    // Router imports
    const location = useLocation()
    const background = location.state && location.state.background

    // destructuring props
    const { postId, postCreator, closeHandle } = props

    // State vars
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

    // import Store component
    const { deletePost } = Store()

    // handle delete post
    const handleDeletePost = () => {
        deletePost(postId, postCreator.id, onSuccessDelete)

        // A callback to get fired when the post is deleted
        function onSuccessDelete() {
            // Get where the user
            const currentPage = window.location.pathname;

            // do different action according to the current page
            switch (currentPage) {
                case "/":
                    window.location.reload()
                    break;
                default:
                    window.location.href = `/${postCreator.username}`
                    break;
            }

            // Handle close confirm dialog after delete the post
            handleConfirmDeleteModalOpen()
        }
    }

    // Handle close confirm dialog
    const handleConfirmDeleteModalOpen = () => {
        setConfirmDeleteOpen(!confirmDeleteOpen)
    }

    // Go to post (To) router link attr
    const toObj = {
        pathname: `/${postCreator.id}/p/${postId}`,
        ...(window.innerWidth > 960 ? { state: { background: location } } : {})
    }

    return (
        <List disablePadding>
            <ListItem key={"report"} divider button dense>
                <ListItemText primary="report..." />
            </ListItem>
            {
                // If the window inner width > 600 add a background
                window.location.pathname == "/" && (
                    <ListItem
                        onClick={closeHandle}
                        to={toObj}
                        component={RouterLink}
                        key={"fullscreen-post"} divider button dense>
                        <ListItemText primary="Go To The Post" />
                    </ListItem>
                )
            }
            {
                // go to post (page) when the post popup is fired
                (window.location.pathname != "/" && background) && (
                    <ListItem
                        onClick={closeHandle}
                        to={{ pathname: `/${postCreator.id}/p/${postId}`, state: { background: null } }}
                        component={RouterLink}
                        key={"fullscreen-post"} divider button dense>
                        <ListItemText primary="Go To The Post" />
                    </ListItem>
                )
            }
            {(loggedUser.uid == postCreator.id) && (
                <ListItem key={"delete"} divider button dense onClick={handleConfirmDeleteModalOpen}>
                    <ListItemText primary="Delete The Post" />
                </ListItem>
            )}
            <ListItem key={"close"} divider button dense>
                <ListItemText onClick={closeHandle} primary="Cancel" />
            </ListItem>

            {/* conform popup for deleting the post */}
            <ConfirmPopUp
                onClose={handleConfirmDeleteModalOpen}
                dialogFunc={{ title: "Sure?", subTitle: "You can't undo is action.", isOpen: confirmDeleteOpen, onConfirm: handleDeletePost }} />
        </List>
    )
}

export default PostSettingsList
