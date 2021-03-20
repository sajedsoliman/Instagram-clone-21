import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'

// Material-Ui imports
import { Grid, makeStyles } from '@material-ui/core'

// icons
import { CommentOutlined, Favorite, Videocam } from '@material-ui/icons'

// component imports
import { db } from '../firebase/database'
import { isVideo } from './services/functions'

// images
import videoPoster from './images/Social-Media-Video-Specs-Feature-Image.png'

// style stuff
const useStyles = makeStyles(theme => ({
    postWrapper: {
        position: "relative",
        margin: 0,
        overflow: "hidden",
        backgroundSize: "cover",

        "&:hover": {

            "& figcaption": {
                backgroundColor: "rgba(0,0,0,.34)",

                "& > div": {
                    display: "inline-flex"
                }
            }
        }
    },
    postImg: {
        position: "absolute",
        top: 0,
        left: 0,
    },
    postInfo: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
        zIndex: 20,
        transition: ".2s",
        backgroundColor: "transparent",
        color: "white"
    },
    figureBox: {
        display: "none",
        alignItems: "center",
        cursor: "default",
        "&:first-child": {
            marginRight: 20
        },

        "& .MuiSvgIcon-root": {
            marginRight: 5
        }
    },
    videoIcon: {
        color: theme.palette.common.white
    }
}))

function UserPost({ post, id, userId, cardHeight = 260 }) {
    const classes = useStyles()

    // destructuring through the post
    const { likedBy, media } = post

    // State vars
    const [commentsCount, setCommentsCount] = useState(0)

    // If the media is video type (media[0] includes mp4 extension or not)
    // use the checker function from services
    const videoMedia = isVideo(media[0])


    // get comments count from the database
    useEffect(() => {
        db.collection("posts")
            .doc(userId)
            .collection("user_posts")
            .doc(id).collection("post_comments")
            .get()
            .then(comments => {
                setCommentsCount(comments.docs.length)
            })
    }, [])

    // style object for putting the post image as a background - height => for both profile posts and suggested ones
    const figureStyle = {
        backgroundImage: `url(${videoMedia ? videoPoster : media[0]})`,
        ...(videoMedia && { backgroundPosition: "center" }),
        height: cardHeight
    }

    return (
        <Grid item xs={12} sm={6} md={4} xl={3}>
            <figure className={classes.postWrapper} style={figureStyle}>
                {/* Video icon if the media is video type */}
                {videoMedia && (
                    <Videocam className={classes.videoIcon} fontSize="large" />
                )}

                <RouterLink to={`/${userId}/p/${id}`}>
                    <figcaption className={classes.postInfo}>
                        <div className={classes.figureBox}>
                            {/* likes count */}
                            <Favorite /> {likedBy.length}
                        </div>
                        <div className={classes.figureBox}>
                            {/* comments counts */}
                            <CommentOutlined /> {commentsCount}
                        </div>
                    </figcaption>
                </RouterLink>
            </figure>
        </Grid >
    )
}

export default UserPost
