import { useEffect, useState } from 'react'

// Material-Ui imports
import { Link, makeStyles, Tooltip, Typography } from '@material-ui/core'
import clsx from "clsx"

// component imports
import { AuthedUser } from '../../user-context/AuthedUserContext'
import { useAlert } from '../../notification-context/NotificationContext'
import { db, firebase } from '../../common-components/firebase/database'
import Store from '../firebase/Store'

const useStyles = makeStyles(theme => ({
    postActionContainer: {
        display: "flex",
        alignItems: "center",
        marginBottom: 10,

        "& i": {
            marginRight: 8
        }
    },
    likeIcon: {
        fontSize: 22,
        cursor: "pointer",
        transition: theme.transitions.create(["color", "transform"], { duration: 100 }),

        "&.active": {
            color: "red",
            transform: "scale(1.1)",
        }
    },
    likedByLink: {
        cursor: "default"
    }
}))

function PostLikes(props) {
    const classes = useStyles()
    const loggedUser = AuthedUser()
    const processSettings = useAlert()

    // destructuring through props
    const { likedBy, user, docId } = props

    // State vars
    const [likers, setLikers] = useState([...likedBy])

    // set an event listener for likes only!
    // docId as a dep => to change the listener(onSnapshot) every time the post changes
    useEffect(() => {
        db
            .collection("posts")
            .doc(user.id)
            .collection("user_posts")
            .doc(docId)
            .onSnapshot(snapshot => {
                // The question mark is because I put a listener on likes not on the post as whole
                // (|| []) => as you see here it's a listener so when a user delete a post it's gonna fire here with undefined 
                setLikers(snapshot.data()?.likedBy || [])
            })
    }, [docId])

    // This check because of the listener above in the useEffect
    // check if the user has liked this post
    const likerObj = likers.find(liker => liker.id == loggedUser.uid)
    const isLiked = Boolean(likerObj)

    // Import Store component to send a notification
    const { handleSendNotification } = Store()

    // handling like ability
    const handleToggleLike = () => {
        // Handle send a notification
        if (isLiked == false && (loggedUser.uid != user.id)) {
            const alertText = `${loggedUser.fullName} has liked your post`
            const postLink = `${user.id}/p/${docId}`
            handleSendNotification(user.id, alertText, postLink, loggedUser.avatar)
        }

        if (loggedUser != "no user") {
            const newLiker = { liker: loggedUser.fullName, id: loggedUser.uid }
            db.collection("posts")
                .doc(user.id)
                .collection("user_posts")
                .doc(docId)
                .update({
                    likedBy: isLiked ? firebase.firestore.FieldValue.arrayRemove(likerObj) : firebase.firestore.FieldValue.arrayUnion(newLiker)
                }).catch(err => alert(err.message))
        } else {
            processSettings("warning", "Login to add a like")
        }
    }

    // To get likes count on the post and get some liker names to show when hover over
    const likesCount = likers.length
    const someLikers = likers.slice(0, 5).map(liker => <div key={liker.liker}>{liker.liker}</div>)

    return (
        <Typography className={classes.postActionContainer}>
            <i /* put (fas) here just to fill the heart */
                className={clsx(classes.likeIcon, "far fa-heart", { "active fas": isLiked })}
                onClick={handleToggleLike}></i>
            {likesCount}&nbsp;
            <Tooltip placement="top" title={someLikers}>
                <Link className={classes.likedByLink} underline="none">Like{likesCount > 1 && "s"}</Link>
            </Tooltip>
        </Typography>

    )

}

export default PostLikes
