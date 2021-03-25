import { useRef, useState } from 'react'

// Material-Ui imports
import { Avatar, List, ListItem, ListItemText, makeStyles, CircularProgress } from '@material-ui/core'

// component imports
import PopUp from '../../../../common-components/PopUp'
import Controls from '../../../../common-components/controls/Controls'
import { db, storage } from '../../../../common-components/firebase/database'

// contexts
import { useAlert } from '../../../../notification-context/NotificationContext'
import { AuthedUser } from '../../../../user-context/AuthedUserContext'


// style
const useStyles = makeStyles(theme => ({
    dialogContent: {
        padding: "0 !important",
        [theme.breakpoints.up("sm")]: {
            minWidth: 400,
        }
    },
    list: {
        "& .MuiListItem-root": {
            textTransform: "capitalize",
            textAlign: "center"
        }
    },
    hiddenInput: {
        display: "none",
    },
    uploadAvatarBtn: {
        color: theme.palette.primary.main
    },
    avatarWrapper: {
        position: "relative",

        "& .MuiAvatar-root": {
            zIndex: 10,
            cursor: "pointer"
        }
    },
    circularProgress: {
        position: 'absolute',
        bottom: -10,
        left: -10,
        [theme.breakpoints.down("xs")]: {
            left: -9,
            bottom: -7.4,
        }
    }
}))

function UserProfileImage(props) {
    const classes = useStyles()
    const loggedUser = AuthedUser()
    const processSettings = useAlert()

    // destructuring through props
    const { fullName, avatar, handleModalOpen,
        progressSize, progressClassName, modalOpen,
        avatarClassName, profileUser } = props

    // refs
    const avatarInputRef = useRef()

    // State variables
    const [progress, setProgress] = useState(0)

    // handle open the file picker
    const handleOpenFilePicker = () => {
        avatarInputRef.current.browse()
    }

    // handle uploading an avatar
    const handleUploadAvatar = (error, file) => {
        // Close the current dialog
        handleModalOpen()

        // Get the file from filePond
        const uploadedFile = file.file
        // Store the image on database
        storage.ref(`user_avatars/${uploadedFile.name}`)
            .put(uploadedFile)
            .on("state_changed", handleProgress, handleError, handleComplete)
        function handleProgress(snapshot) {
            const progressSofar = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
            setProgress(progressSofar)
        }
        function handleError(error) {
            processSettings("error", error.message)
        }
        function handleComplete() {
            storage.ref("user_avatars")
                .child(uploadedFile.name)
                .getDownloadURL()
                .then(url => {
                    // update the user's avatar
                    db.collection("members").doc(loggedUser.id).update({
                        avatar: url
                    })
                    setProgress(0)
                })
        }
    }

    // popup props
    const modalProps = {
        infoFunc: modalOpen,
        closeHandle: handleModalOpen,
        contentStyles: classes.dialogContent
    }

    // FilePond props
    const filePondProps = {
        wrapperClassName: classes.hiddenInput,
        needEncode: false,
        onAddFileHandler: handleUploadAvatar,
        filepondRef: avatarInputRef,
    }

    // Some info
    const isUserOwner = (loggedUser != "no user" && loggedUser.id == profileUser?.id) ||
        loggedUser != "no user" && profileUser == undefined

    return (
        <>
            {/* The avatar itself */}
            <div className={classes.avatarWrapper}>
                <Avatar
                    className={avatarClassName}
                    style={{ cursor: !isUserOwner && "default" }}
                    onClick={isUserOwner && handleModalOpen}
                    alt={fullName}
                    src={avatar}>{fullName[0]}
                </Avatar>
                <CircularProgress
                    className={`${classes.circularProgress} ${progressClassName}`}
                    variant="determinate"
                    value={progress}
                    size={progressSize}
                    thickness={2} />
            </div>

            {/* Upload an avatar hidden input */}
            <Controls.FilePondUploader
                {...filePondProps}
            />

            {/* Popup - to change this avatar if the user is authed */}
            <PopUp {...modalProps}>
                <List className={classes.list} disablePadding>
                    <ListItem divider onClick={handleOpenFilePicker} button>
                        <ListItemText className={classes.uploadAvatarBtn}>Upload an image</ListItemText>
                    </ListItem>
                    <ListItem divider onClick={handleModalOpen} button>
                        <ListItemText>Cancel</ListItemText>
                    </ListItem>
                </List>
            </PopUp>
        </>
    )
}

export default UserProfileImage
