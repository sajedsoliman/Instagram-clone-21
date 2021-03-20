import { Container, Divider, makeStyles } from '@material-ui/core'
import { useEffect, useState } from 'react'

// Router imports - to get the post id from params
import { useParams } from 'react-router-dom'

// component imports
import Store from '../../../common-components/firebase/Store'
import FullScreenPost from '../../../common-components/post-components/fullscreen-post/FullScreenPost'
import AppPage from '../AppPage'
import UserSuggestedPosts from './UserSuggestedPosts'

// styles
const useStyles = makeStyles(theme => ({
}))

function SinglePost() {
    const classes = useStyles()

    // get post id from params
    const { postId, userId } = useParams()

    // Import single post function from store
    const { getPost } = Store()

    // State vars
    const [post, setPost] = useState(null)


    // fetch the post from server when the component renders
    useEffect(() => {
        getPost(userId, postId, setPost)
    }, [postId])

    if (post == null) return null
    else {
        return (
            <AppPage>
                <Container maxWidth="md">
                    {/* full screen post */}
                    <FullScreenPost post={post} postId={postId} />

                    <Divider />
                    {/* user other posts */}
                    <UserSuggestedPosts userId={userId} activePostId={postId} postCreator={post.user.username} />
                </Container>
            </AppPage>
        )
    }
}

export default SinglePost