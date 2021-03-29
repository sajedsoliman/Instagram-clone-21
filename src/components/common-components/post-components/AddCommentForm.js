import { useState } from "react"

// Material-Ui imports
import { Button, InputBase, makeStyles } from "@material-ui/core"

// component imports
import Store from "../firebase/Store"
import { AuthedUser } from "../../user-context/AuthedUserContext"
import { db } from "../firebase/database"

// style
const useStyles = makeStyles(theme => ({
    commentForm: {
        display: "flex",
        alignItems: "center",
        width: "100%",
        padding: "7px 0",
        borderTop: `1px solid ${theme.palette.divider}`,
    },
    commentInput: {
        flexGrow: 1,
        paddingLeft: 10
    },
    submitBtn: {

    }
}))

function AddCommentForm(props) {
    const classes = useStyles()
    const loggedUser = AuthedUser()

    // destructuring through props
    const { user, docId, addInputRef } = props

    const [text, setText] = useState("")

    // handle comment text change
    const handleTextChange = (e) => {
        setText(e.target.value)
    }

    // Import Store component to add a comment
    const { AddComment } = Store()

    // handle add comment submission
    const handleSubmit = (e) => {
        e.preventDefault()

        const comment = {
            text,
            commenter: loggedUser.fullName || "Guest"
        }

        // handle add the comment
        AddComment(user.id, comment, docId, setText, user.avatar)
    }

    return (
        <form className={classes.commentForm} onSubmit={handleSubmit}>
            <InputBase
                inputProps={{ ref: addInputRef }}
                value={text}
                onChange={handleTextChange}
                className={classes.commentInput}
                placeholder="Type a comment..." />
            <Button
                type="submit"
                disabled={text == "" ? true : false}
                className={classes.submitBtn}
                onClick={handleSubmit}
                variant="text"
                color="secondary">Add</Button>
        </form>
    )
}

export default AddCommentForm
