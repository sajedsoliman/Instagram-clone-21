// Material-Ui imports
import { CardActions, makeStyles } from "@material-ui/core"

// component imports
import AddCommentForm from "../../common-components/post-components/AddCommentForm"


// style
const useStyles = makeStyles(theme => ({
    cardAction: {
        padding: 0,
        borderTop: "1px solid rgb(128 128 128 / 22%)"
    },
}))

function PostCardAction({ user, docId }) {
    const classes = useStyles()

    return (
        <CardActions disableSpacing className={classes.cardAction}>
            <AddCommentForm user={user} docId={docId} />
        </CardActions>
    )
}
export default PostCardAction
