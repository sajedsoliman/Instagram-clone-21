import { useState } from "react"
import { useHistory, useLocation } from "react-router"

// UI imports
import { List, makeStyles } from "@material-ui/core"

// contexts
import { AuthedUser } from "../../../user-context/AuthedUserContext"

// Component imports
import PopUp from "../../../common-components/PopUp"
import UserCard from "../../../common-components/user-related/UserCard"

// styles
const useStyles = makeStyles(theme => ({
    list: {
        minWidth: 380,
        maxHeight: 350,
        overflowY: "auto",
        "&::-webkit-scrollbar": {
            background: "red",
            width: 2
        }
    },
    modalContent: {
        padding: 0
    }
}))

function UserFollowersModal() {
    const classes = useStyles()
    const loggedUser = AuthedUser()

    // router
    const history = useHistory()
    const location = useLocation()
    // Get followers from location's state
    const users = location.state && location.state.users
    // To determine weather those users are followers or following
    const branch = location.state && location.state.branch

    // State vars
    const [modalOpen, setModalOpen] = useState({ title: branch, isOpen: true })

    // Handle followers modal open
    const handleModalOpen = () => {
        // go back in history - to reset modal open state
        history.goBack()
        setModalOpen(prev => ({ ...prev, isOpen: !prev.isOpen }))
    }

    // map through follower - put them in list - import user card
    const mappedUsers = users.map(user => {
        if (!(user.id == loggedUser?.id)) {
            return <UserCard key={user.id} user={user} branch={branch} />
        }
    })

    // desktop Popup props
    const popupProps = {
        infoFunc: modalOpen,
        closeHandle: handleModalOpen,
        dividers: true,
        contentStyles: classes.modalContent
    }

    return (
        <PopUp {...popupProps}>
            <List disablePadding className={classes.list}>
                {mappedUsers}
            </List>
        </PopUp>
    )
}

export default UserFollowersModal
