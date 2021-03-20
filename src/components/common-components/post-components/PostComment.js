// component imports
import { Fade, ListItem, ListItemText, Slide } from "@material-ui/core"
import { useState } from "react"

function PostComment({ text, commenter }) {

    return (
        <Slide in={true} direction="right" timeout={{ enter: 250 }}>
            <ListItem dense alignItems="flex-start">
                <ListItemText primary={commenter} secondary={text} />
            </ListItem>
        </Slide>
    )
}

export default PostComment
