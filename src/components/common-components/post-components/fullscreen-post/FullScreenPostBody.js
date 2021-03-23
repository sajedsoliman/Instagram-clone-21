import { useEffect, useState } from 'react'
// Material-UI imports

import { Card, CardContent, makeStyles } from '@material-ui/core'

// component import
import PopUp from '../../PopUp'
import PostCardHeader from '../PostCardHeader'
import PostSettingsList from '../PostSettingsList'
import PostCaption from '../PostCaption'
import PostComments from '../PostComments'
import FullscreenPostActions from './FullscreenPostActions'
import { db } from '../../firebase/database'
import Store from '../../firebase/Store'

// styles
const useStyles = makeStyles(theme => ({
    card: {
        borderRadius: 0,
    },
    captionWrapper: {
        borderTop: `1px solid ${theme.palette.divider}`
    },
    settingsCardContent: {
        padding: "0 !important",
    }
}))


function FullScreenPostBody(props) {
    const classes = useStyles()

    // destructuring through props
    const { post, postId, imageType } = props

    // destructuring through the post
    const { user, location, caption } = post

    // State vars
    const [comments, setComments] = useState([])
    const [settingsModal, setSettingsModal] = useState({ title: "", isOpen: false })

    // Import Store component to get comments
    const { getPostComments } = Store()

    // Fetch post comment from database
    useEffect(() => {
        getPostComments(postId, user.id, setComments)
    }, [postId])

    // handle open settings list modal
    const handleModalOpen = () => {
        setSettingsModal(prev => ({
            ...prev, isOpen: !prev.isOpen
        }))
    }

    // Popup props
    const popupProps = {
        infoFunc: settingsModal,
        closeHandle: handleModalOpen,
        contentStyles: classes.settingsCardContent
    }

    return (
        <Card variant="outlined" className={classes.card}
            style={{ height: imageType == "portrait" ? 598 : 448 }}>
            <PostCardHeader handleOpenModal={handleModalOpen} creatorInfo={user} location={location} />
            {/* I wrapped it here to add padding cuz i didn't in the caption components */}
            <CardContent className={classes.captionWrapper}>
                <PostCaption caption={caption} username={user.username} />
            </CardContent>
            <PostComments comments={comments} />
            <FullscreenPostActions commentsCount={comments.length} post={post} postId={postId} />

            {/* Settings list popup */}
            <PopUp {...popupProps}>
                <PostSettingsList postCreator={user} postId={postId} closeHandle={handleModalOpen} />
            </PopUp>
        </Card>
    )

}

export default FullScreenPostBody
