import { useEffect, useRef, useState } from "react"

// component imports
import PostComment from "./PostComment"

// Material imports
import { List, makeStyles, Typography } from "@material-ui/core"

// icons
import { AddCircleOutline } from '@material-ui/icons'
import clsx from "clsx"
import { AuthedUser } from "../../user-context/AuthedUserContext"

// style
const useStyles = makeStyles(theme => ({
    list: {
        textAlign: "center",
        minHeight: "calc(100% - (72px + 80px + 82px + 62px))",
        maxHeight: "calc(100% - (72px + 80px + 82px + 62px))",
        height: "calc(100% - (72px + 80px + 82px + 62px))",
        overflowY: "auto",
        overflowX: "hidden",
        "&::-webkit-scrollbar": {
            background: "none",
            width: 2
        },
        "&::-webkit-scrollbar-thumb": {
            background: "rgb(9 140 232 / 85%)",
        }

    },
    increaseLimitIcon: {
        cursor: "pointer"
    },
}))


function PostComments(props) {
    const classes = useStyles()
    const loggedUser = AuthedUser()
    const commentsList = useRef()

    // destructuring though props
    const { comments, borders = true, fullScreen = true } = props

    // State vars => limit comments count
    const [limit, setLimit] = useState(2)

    // handle change limit (increase it)
    const handleLimit = () => {
        setLimit(prev => prev + 2)
    }

    // when the limit change auto scroll down
    useEffect(() => {
        commentsList.current.scrollTo({ top: commentsList.current.scrollHeight })
    }, [limit, comments])

    // Other people comments
    const filteredComments = comments.filter(comment => comment.commenter !== loggedUser.fullName)
    const mappedComments = (fullScreen ? filteredComments.slice(0, limit) : filteredComments)
        .map(({ text, commenter }, index) => (
            <PostComment
                key={`${index}-${commenter}`}
                text={text}
                commenter={commenter} />
        )
        )

    // Logged user comment if any (user)
    const loggedUserComments = comments
        .filter(comment => comment.commenter == loggedUser.fullName)
        .map(({ text, commenter }, index) => (
            <PostComment
                key={`${index}-${commenter}`}
                text={text}
                commenter={commenter} />
        ))

    const borderStyles = {
        borderTop: "1px solid rgba(0,0,0,.1)",
        borderBottom: "1px solid rgba(0,0,0,.1)",
    }

    return (
        <List
            ref={commentsList}
            className={`${fullScreen ? classes.list : ""}`}
            {...(borders && { style: borderStyles })}>
            {/* Logged user comments */}
            {
                loggedUser != "no user" && (
                    <div>
                        {/* If there is no user => will not show anything */}
                        {loggedUserComments}
                    </div>
                )
            }

            {/* other comments */}
            <div>
                {mappedComments}
            </div>

            {/* increase limit icons */}
            {
                fullScreen && (
                    comments.length > 0 ?
                        (
                            limit < (comments.length - loggedUserComments.length) && <AddCircleOutline className={classes.increaseLimitIcon} onClick={handleLimit} />
                        )
                        : (
                            <Typography variant="body2">No comments to show</Typography>
                        ))}
        </List>
    )
}

export default PostComments
