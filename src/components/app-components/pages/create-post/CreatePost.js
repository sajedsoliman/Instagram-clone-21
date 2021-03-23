import { useState, useEffect } from 'react'

// component imports
import Controls from '../../../common-components/controls/Controls'
import UploadPostMedia from './UploadPostMedia'
import StepActions from '../../../common-components/StepActions'
import { useForm } from '../../../common-components/useForm'
import { AuthedUser } from '../../../user-context/AuthedUserContext'
import { useAlert } from '../../../notification-context/NotificationContext'
import AppPage from '../AppPage'

import { useHistory } from 'react-router'

// Material-UI imports
import { makeStyles, LinearProgress, Container, Paper, Typography } from '@material-ui/core'

// firebase database
import { storage, db, firebase } from '../../../common-components/firebase/database'
import StepperActions from './StepperActions'

// style
const useStyles = makeStyles(theme => ({
    formWrapper: {
        display: "flex",
        flexDirection: 'column',
        maxWidth: 600,
        margin: "auto",
        minHeight: 300,
        padding: 20,
        marginBottom: 160,

        "& > input[type=file]": {
            marginTop: 10
        },

        "& .MuiLinearProgress-root": {
            marginBottom: 10
        }
    },
    title: {
        marginBottom: 20
    },
}))

// Initial post info
const initialInfo = {
    location: "",
    caption: "",
    media: []
}

function CreatePost() {
    const classes = useStyles()

    // contexts
    const processSettings = useAlert()
    const user = AuthedUser()

    // State vars
    const [currentStep, setCurrentStep] = useState(0)
    const [progress, setProgress] = useState(0)
    const [mediaUrls, setMediaUrls] = useState([])

    // import useForm in order to handle inputs
    const { values: postInfo, handleInputsChange } = useForm(initialInfo, false)

    // handle upload a post
    useEffect(() => {
        if (mediaUrls.length == postInfo.media.length && currentStep != 0) {
            db.collection('posts').doc(user.uid).collection("user_posts").add(
                {
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    media: mediaUrls,
                    caption: postInfo.caption,
                    user: {
                        fullName: user.fullName,
                        id: user.uid,
                        username: user.username,
                        avatar: user.avatar || "",
                    },
                    location: postInfo.location ? postInfo.location : "" /* To use an api to spot the location */,
                    likedBy: []
                }
            ).then(_ => {
                window.location = "/"
                processSettings("info", "The Post has been created")
            }).catch(err => {
                processSettings("error", err.message)
            })
        }
    }, [mediaUrls])

    // handle image upload
    const handleFileUpload = (files) => {
        const target = {
            value: files,
            name: "media"
        }
        handleInputsChange({ target })
    }

    // handle Submit
    const handleSubmit = () => {
        if (postInfo.media.length == 0) {
            processSettings("error", "upload a media file")
        } else {
            postInfo.media.forEach(file => {
                storage.ref(`post_media/${file.name}`).put(file)
                    .on("state_changed",
                        (snapshot) => snapshotHandler(snapshot),
                        (err) => errorHandle(err),
                        () => completeHandler()
                    )
                function snapshotHandler(snapshot) {
                    const progressSofar = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                    setProgress(progressSofar)
                }
                function errorHandle(error) {
                    processSettings("error", error.message)
                }
                function completeHandler() {
                    storage.ref(`post_media/${file.name}`)
                        .getDownloadURL()
                        .then(url => {
                            setProgress(0)
                            setMediaUrls(prev => [...prev, url])
                        })
                }
            })
        }
    }

    // handle next step
    const nextStep = () => {
        setCurrentStep(prev => prev + 1)
    }

    // handle previous step
    const previousStep = () => {
        setCurrentStep(prev => prev - 1)
    }

    // input props
    const inputProps = (value, label, name) => ({
        value,
        label,
        name,
        inputChange: handleInputsChange
    })

    // post steps
    const steps = ["Upload your images/videos", "Set your caption and location"]

    // the content for each step
    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <UploadPostMedia
                        media={postInfo.media}
                        handleFileUpload={handleFileUpload} />
                )
                break;
            default:
                return (
                    <>
                        <LinearProgress variant="determinate" value={progress} />

                        <Controls.TextArea
                            {...inputProps(postInfo.caption, "Type Your Caption...", "caption")}
                            rows={5}
                        />

                        <Controls.TextInput
                            {...inputProps(postInfo.location, "Type location if any", "location")} />
                    </>
                )
        }
    }

    if (user == "no user") return null
    return (
        <AppPage>
            <Container>
                {/* Add post inputs inside of a paper component ... */}

                {/* Title */}
                <Typography variant="h5" align="center" className={classes.title}>Create A Post</Typography>
                <Paper className={classes.formWrapper} variant="outlined">
                    {/* Step imports */}
                    <StepActions steps={steps} activeStep={currentStep} />

                    {/* Each step's content */}
                    {getStepContent(currentStep)}

                    {/* Stepper Controls (back, next, submit) */}
                    {/* Add progress as a prop to disable the button click while uploading */}
                    <StepperActions
                        progress={progress}
                        handleSubmit={handleSubmit}
                        nextStep={nextStep}
                        previousStep={previousStep}
                        stepsLength={steps.length}
                        currentStep={currentStep} />
                </Paper>
            </Container>
        </AppPage>
    )
}

export default CreatePost
