import { useEffect, useState } from 'react'
import { useHistory, useLocation, useParams } from 'react-router'

// UI imports
import { makeStyles } from '@material-ui/core'

// Component imports
import PopUp from '../../common-components/PopUp'
import FullScreenPost from '../../common-components/post-components/fullscreen-post/FullScreenPost'
import Store from '../../common-components/firebase/Store'

// styles
const useStyles = makeStyles(theme => ({
    modalContent: {
        padding: "0 !important",
        width: 960
    }
}))

function FullScreenPostModal() {
    const classes = useStyles()

    // router
    const history = useHistory()
    const { userId, postId } = useParams()

    // State vars
    const [modalOpen, setModalOpen] = useState({ title: "", isOpen: true })
    const [post, setPost] = useState(null)

    // Handle fullscreen modal open
    const handleModalOpen = () => {
        // go back in history - to reset modal open state
        history.goBack()
        setModalOpen(prev => ({ ...prev, isOpen: !prev.isOpen }))
    }

    // Import single post function from store
    const { getPost } = Store()

    // Fetch the post from database
    useEffect(async () => {
        setPost(await getPost(userId, postId))
    }, [postId])

    // popup props
    const popupProps = {
        infoFunc: modalOpen,
        closeHandle: handleModalOpen,
        contentStyles: classes.modalContent,
        maxWidth: "md"
    }

    if (post != null) {
        return (
            <PopUp {...popupProps}>
                <FullScreenPost post={post} postId={postId} padding={false} />
            </PopUp>
        )
    } else {
        return null
    }
}

export default FullScreenPostModal
