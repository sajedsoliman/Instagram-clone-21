import { Link as RouterLink } from 'react-router-dom'

// UI imports
import { Avatar, Button, ListItem, ListItemAvatar, ListItemIcon, ListItemText, makeStyles } from "@material-ui/core"

// component imports
import CommonButton from "../CommonButton"
import UnFollowModal from './UnFollowModal'

// Contexts
import { AuthedUser } from '../../user-context/AuthedUserContext'
import { useEffect, useState } from 'react'
import Store from '../firebase/Store'

// styles
const useStyles = makeStyles(theme => ({
    username: {
        textDecoration: "none",
        color: "black"
    }
}))


// brach is to determine weather those users are followers or following
function UserCard({ user, branch }) {
    const classes = useStyles()
    const loggedUser = AuthedUser()

    // destructuring the user
    const { avatar, fullName, username, id } = user

    // State vars
    const [followers, setFollowers] = useState([])
    const [modalOpen, setModalOpen] = useState({ title: "", isOpen: false })

    const { getUserFollowers, handleFollow } = Store()

    // Fetch each user followers
    useEffect(() => {
        getUserFollowers(id, setFollowers)
    }, [])

    // handle follow this user if didn't
    const followUserHandler = () => {
        handleFollow(loggedUser, user)
    }

    // handle modal open
    const handleOpenModal = () => {
        setModalOpen(prev => ({ ...prev, isOpen: !prev.isOpen }))
    }

    // if you have followed or haven't this user
    const followerObj = followers.find(follower => follower.id == loggedUser?.id)
    const isFollowed = Boolean(followerObj)

    return (
        <ListItem>
            <ListItemAvatar>
                <Avatar src={avatar} alt={fullName}>{fullName[0]}</Avatar>
            </ListItemAvatar>
            <ListItemText
                primaryTypographyProps={{ component: RouterLink, to: `/${username}`, className: classes.username }} primary={username} secondary={fullName} />

            {/* follow functionality */}
            <ListItemIcon>
                {
                    isFollowed ? (
                        // handle unFollow - open unFollow modal
                        <Button
                            onClick={handleOpenModal}
                            variant="outlined"
                            size="small">
                            {branch == "followers" ? "Requested" : "Following"}
                        </Button>
                    ) : (
                        // handle Follow
                        <CommonButton onClick={followUserHandler} text="Follow" />
                    )
                }
            </ListItemIcon>

            {/* Un Follow Popup */}
            <UnFollowModal infoFunc={modalOpen} closeHandle={handleOpenModal} user={user} />
        </ListItem>
    )
}

export default UserCard
