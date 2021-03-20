// UI imports
import { Avatar, List, ListItem, ListItemText, makeStyles, Typography } from "@material-ui/core"

// component imports
import PopUp from "../PopUp"

// contexts
import { AuthedUser } from "../../user-context/AuthedUserContext"

// firebase
import Store from "../firebase/Store"

// styles
const useStyles = makeStyles(theme => ({
    modalContent: {
        minWidth: 300,
        textAlign: "center",
        padding: "15px 0 0"
    },
    avatar: {
        width: 80,
        height: 80,
        margin: "auto",
        marginBottom: 20
    },
    username: {

    },
    list: {
        paddingBottom: 0,

        "& .MuiListItem-root": {
            textAlign: "center",
        }
    },
    unFollowBtn: {
        color: theme.palette.error.main
    }
}))

function UnFollowModal(props) {
    const classes = useStyles()
    const loggedUser = AuthedUser()

    // destructuring props
    const { infoFunc, closeHandle, user } = props

    // destructuring the user
    const { avatar, username, id } = user

    // destructuring firebase Store's component
    const { handleUnFollow } = Store()

    // handle unFollow button click
    const unFollowHandler = () => {
        handleUnFollow(loggedUser.id, id)
        closeHandle()
    }

    // Popup props
    const popupProps = {
        infoFunc,
        closeHandle,
        contentStyles: classes.modalContent
    }

    return (
        <PopUp {...popupProps}>
            {/* Follower avatar */}
            <Avatar className={classes.avatar} src={avatar} />

            {/* username */}
            <Typography variant="body2" color="textPrimary">Unfollow @{username}?</Typography>

            {/* list */}
            <List className={classes.list}>
                <ListItem onClick={unFollowHandler} button>
                    <ListItemText className={classes.unFollowBtn}>Unfollow</ListItemText>
                </ListItem>
                <ListItem onClick={closeHandle} button>
                    <ListItemText>Cancel</ListItemText>
                </ListItem>
            </List>
        </PopUp>
    )
}

export default UnFollowModal
