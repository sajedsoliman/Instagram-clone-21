import { useRef, useState } from 'react'

// Material-UI imports
import { makeStyles } from '@material-ui/core'

// component imports
import Controls from '../../../common-components/controls/Controls'

// FilePond allowed types
const imgMimiTypes = ["image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",];
const videoMimiTypes = ["video/mp4", "video/x-ms-wmv"]
const mediaTypeRadios = [
    {
        label: "Video",
        value: "video"
    },
    {
        label: "Image",
        value: "image"
    },

]

// style
const useStyles = makeStyles(theme => ({
    filepondContainer: {
        // [theme.breakpoints.down("sm")]: {
        minHeight: 165,
        width: "90%",
        margin: "auto",

        "& .filepond--item": {
            width: "calc(50% - .5em)",
        },

        "& .filepond--item-panel": {
            background: "rgba(255, 255, 255, .4)",
        },

        "& .filepond--item .filepond--panel": {
            background: "rgba(255, 255, 255, .4)",
            boxShadow: "0px 0 3px 0 #00000059",
        },

        "& .filepond--file": {
            color: "black"
        },

        [theme.breakpoints.down("xs")]: {
            width: "100%",

            "& .filepond--item": {
                width: "100%"
            }
        },

        "& .filepond--drop-label": {
            minHeight: "8.75em"
        },

        "& .filepond--panel-root": {
            background: "white",
            border: "1px solid #444"
        },
        // }
    },
    mediaTypeSelector: {
        marginBottom: 20
    }
}))

function UploadPostMedia(props) {
    const classes = useStyles()

    // Refs
    const filePondRef = useRef()

    // destructuring props
    // I imported media just to add then onInit
    const { handleFileUpload, media } = props

    // State vars
    const [mediaType, setMediaType] = useState("image")

    // FilePond Instance Props
    const FilePondProps = {
        needEncode: false,
        needMulti: true,
        onFilesUpdated: (files) => {
            const imageFiles = files.map(file => file.file)

            handleFileUpload(imageFiles)
        },
        onInit: () => { filePondRef.current.addFiles(media) },
        filepondRef: filePondRef,
        wrapperClassName: classes.filepondContainer,
        imagePreview: false,
        allowedTypes: mediaType == "image" ? imgMimiTypes : videoMimiTypes
    }

    // handle media type radio input change
    const mediaTypeChangeHandler = (e) => {
        setMediaType(e.target.value)
    }

    // Radio group - for media type - props
    const radioGroupProps = {
        label: "Media Type",
        value: mediaType,
        onChangeHandle: mediaTypeChangeHandler,
        items: mediaTypeRadios,
    }

    return (
        <div className={classes.container}>
            {/* Video or images radio inputs */}
            <div className={classes.mediaTypeSelector}>
                <Controls.RadioGroup {...radioGroupProps} />
            </div>


            {/* Upload itself */}
            <Controls.FilePondUploader {...FilePondProps} />
        </div>
    )
}

export default UploadPostMedia
