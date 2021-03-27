import React, { useState, useEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom'

// UI imports
import { Divider, Grid, makeStyles, Typography } from '@material-ui/core'

// component
import Store from "../../../common-components/firebase/Store"
import UserPost from '../../../common-components/post-components/UserPost'

// style stuff
const useStyles = makeStyles(theme => ({
    wrapper: {
        marginTop: 25,
        paddingBottom: 100,

        [theme.breakpoints.down("xs")]: {
            padding: "0 15px 100px"
        }
    },
    title: {
        marginBottom: 10
    },
    creator: {
        textDecoration: "none",
    }
}))

function UserSuggestedPosts(props) {
    const classes = useStyles()

    // destructuring props
    const { userId, activePostId, postCreator } = props

    // Fetch posts on mounted
    useEffect(() => {
        getSuggestedPosts(userId, activePostId)
    }, [activePostId])

    // Fetch some posts for this user - import Store component to do that
    const { posts, getSuggestedPosts } = Store()

    // mapping through posts
    const mappedPosts = posts.map(pst => {
        const { id, post } = pst
        return <UserPost key={id} post={post} id={id} userId={userId} cardHeight={240} />
    })

    return (
        <div className={classes.wrapper}>
            {/* Title with creator navigate link */}
            <Typography className={classes.title}
                variant="body1"
                color="textSecondary">More posts from
                {/* Router link */}
                <RouterLink className={classes.creator} to={`/${postCreator}`}> {postCreator}</RouterLink>
            </Typography>

            {/* Suggested posts themselves */}
            <Grid container spacing={2}>
                {mappedPosts}
            </Grid>
        </div>
    )
}

export default UserSuggestedPosts
