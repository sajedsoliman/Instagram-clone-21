// Material-Ui imports
import { makeStyles, Typography } from "@material-ui/core"

// component imports


// style
const useStyles = makeStyles(theme => ({
    wrapper: {
        cursor: "pointer",
        display: "flex",
        marginLeft: 15
    },
    commentsIcon: {
        marginRight: 5
    }
}))

function PostCommentsCount({ count, formRef }) {
    const classes = useStyles()

    // Handle focus the add comment form when click on the comment icon
    const handleFocusForm = () => {
        formRef.current.focus()
    }

    return (
        <div className={classes.wrapper} onClick={handleFocusForm}>
            <span
                className={`material-icons ${classes.commentsIcon}`}>
                chat_bubble_outline
            </span>
            <Typography variant="body1" color="secondary">
                {count} Comment{count > 1 ? "s" : ""}</Typography>
        </div>
    )
}

export default PostCommentsCount
