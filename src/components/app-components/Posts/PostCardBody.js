import { useEffect, useState } from "react";

// Material-Ui imports
import { CardContent, Typography, makeStyles, Collapse } from "@material-ui/core";

// Contexts
import { AuthedUser } from "../../user-context/AuthedUserContext";


// component imports
import { db } from "../../common-components/firebase/database";
import PostLikes from "../../common-components/post-components/PostLikes";
import PostComments from "../../common-components/post-components/PostComments";
import PostCaption from "../../common-components/post-components/PostCaption";

// styles
const useStyles = makeStyles(theme => ({
    cardContent: {
        paddingBottom: 15,
    },
    showAllCommentsToggler: {
        cursor: "pointer"
    },
}))

function PostCardBody(props) {
    const classes = useStyles()
    const loggedUser = AuthedUser()

    // destructuring through props
    const { caption, user, docId, likedBy, post } = props

    // State variables
    const [comments, setComments] = useState([])
    const [showComments, setShowComments] = useState(false)

    // put use Effect here to just re-render the comments section
    useEffect(() => {
        // Get comments from database
        db.collection("posts")
            .doc(post.user.id)
            .collection("user_posts")
            .doc(docId)
            .collection("post_comments")
            .onSnapshot(snapshot => {
                setComments(snapshot.docs.map(doc => doc.data()))
            })
    }, [])

    // handle toggle comments
    const handleShowComments = () => {
        setShowComments(prev => !prev)
    }

    // Get comments count
    const commentsCount = comments.length

    return (
        <CardContent className={classes.cardContent}>
            {/* Likes count and the ability to like */}
            <PostLikes likedBy={likedBy} user={user} docId={docId} />

            {/* Post Content */}
            <PostCaption
                user={user} username={user.username} caption={caption} />

            {/* show all comments toggler */}
            {commentsCount == 0 ?
                (<Typography variant="body2" color="textSecondary">This post has no comments</Typography>) :
                (<Typography
                    onClick={handleShowComments}
                    className={classes.showAllCommentsToggler}
                    variant="body2"
                    color="textSecondary">
                    {showComments ? "Hide" : "Show"} all {commentsCount} comments</Typography>)
            }

            {/* All comments */}
            <Collapse in={showComments}>
                <PostComments
                    fullScreen={false}
                    borders={false}
                    comments={comments} />
            </Collapse>
        </CardContent>
    )
}

export default PostCardBody
