import { useEffect, useState } from "react";

// Material-Ui imports
import { Card, makeStyles } from "@material-ui/core";
import PostSettingsList from "../../common-components/post-components/PostSettingsList";

// component imports
import PostCardHeader from '../../common-components/post-components/PostCardHeader'
import PostCardMedia from '../../common-components/post-components/PostCardMedia'
import PostCardBody from "./PostCardBody"
import PostCardAction from "./PostCardAction";
import PopUp from '../../common-components/PopUp'

// Contexts
import { AuthedUser } from "../../user-context/AuthedUserContext";
import { useAlert } from "../../notification-context/NotificationContext";

// Services
import { getImageShape } from "../../common-components/post-components/services/functions";


// styles
const useStyles = makeStyles(theme => ({
    postCard: {
        position: "relative",
        marginBottom: 20,
        "&::-webkit-scrollbar": {
            background: "#fff",
            width: 2,
        },
        "&::-webkit-scrollbar-thumb": {
            background: "red"
        }
    },
    actionListContainer: {
        padding: "0 !important"
    }
}))

export default function PostCard({ post, docId }) {
    const classes = useStyles()
    const LoggedUser = AuthedUser()
    const processSettings = useAlert()

    // destructuring props
    const { user, location, media, caption, likedBy } = post

    // State vars
    const [postActionsModal, setPostActionsModal] = useState({ title: "", isOpen: false })
    const [imageShape, setImageShape] = useState("portrait")

    // determine if the image is a landscape or portrait to set the post card body height
    useEffect(() => {
        setImageShape(getImageShape(media[0]))
    }, [media])


    // handle modal Opening
    const handleModalOpen = () => {
        if (LoggedUser) {
            setPostActionsModal(prev => ({
                ...prev, isOpen: !prev.isOpen
            }))
        } else {
            processSettings("error", "Login to interact with the post")
        }
    }

    // more action on posts popup props
    const popUpProps = {
        infoFunc: postActionsModal,
        closeHandle: handleModalOpen,
        contentStyles: classes.actionListContainer
    }

    // card body props
    const cardBodyProps = {
        user,
        caption: caption,
        docId,
        likedBy,
        post
    }

    return (
        <>
            <Card className={classes.postCard} variant="outlined">
                <PostCardHeader
                    location={location}
                    handleOpenModal={handleModalOpen}
                    creatorInfo={user} />
                <PostCardMedia additionalClass={imageShape} postMedia={media} />
                <PostCardBody {...cardBodyProps} />

                {/* Add comment handling */}
                <PostCardAction user={user} docId={docId} />
            </Card>

            {/* post settings popup */}
            <PopUp {...popUpProps}>
                <PostSettingsList postCreator={user} postId={docId} closeHandle={handleModalOpen} />
            </PopUp>
        </>
    )
}

