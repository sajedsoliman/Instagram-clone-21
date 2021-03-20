// Material-UI imports
import { Grid, makeStyles } from '@material-ui/core'
import { useEffect, useState } from 'react'

// component imports
import PostCardMedia from '../PostCardMedia'
import FullScreenPostBody from './FullScreenPostBody'

// Services
import { getImageShape } from '../services/functions'

// style stuff
const useStyles = makeStyles(theme => ({

}))

function FullScreenPost(props) {
    const classes = useStyles()

    // destructuring through props
    const { post, postId, padding = true } = props

    // destructuring through the post
    const { media } = post

    // State vars
    const [imageShape, setImageShape] = useState("portrait")

    // determine if the image is a landscape or portrait to set the post card body height
    //  I put it here to use it in the post's body
    useEffect(() => {
        setImageShape(getImageShape(media[0]))
    }, [media])

    return (
        <Grid container spacing={0} style={{ paddingBottom: padding ? 70 : 0 }}>
            {/* Post media slider */}
            <Grid item xs={12} sm={7}>
                <PostCardMedia postMedia={media} additionalClass={imageShape} />
            </Grid>

            {/* Post body */}
            <Grid item xs={12} sm={5}>
                <FullScreenPostBody post={post} postId={postId} imageType={imageShape} />
            </Grid>
        </Grid>
    )
}

export default FullScreenPost
