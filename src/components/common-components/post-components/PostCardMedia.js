
// Material-Ui imports
import { makeStyles } from "@material-ui/core";

// gallery imports
import ImageGallery from "react-image-gallery"
import "react-image-gallery/styles/css/image-gallery.css";
import './styles/image-gallery-styles.css'

// styles
const useStyles = makeStyles(theme => ({

}))

function PostCardMedia({ postMedia, additionalClass }) {

    // map through post's media
    const galleryItems = postMedia.map(fileLink => {

        if (fileLink.includes("mp4")) {
            const videoPlayer = (
                <video
                    preload="metadata"
                    muted
                    style={{ width: "100%" }}
                    controls src={`${fileLink}#t=1`}></video>
            )
            return ({ renderItem: () => videoPlayer, originalClass: "landscape Video Slide" })
        } else {
            const imageStyle = {
                backgroundImage: `url(${fileLink})`,
                backgroundSize: "cover",
                height: "100%"
            }
            return ({
                originalClass: additionalClass,
                renderItem: () => (
                    <div style={imageStyle}></div>
                )
            })
        }

    })

    // React gallery properties
    const galleryProps = {
        items: galleryItems,
        infinite: false,
        showNav: false,
        showThumbnails: false,
        showFullscreenButton: true,
        useBrowserFullscreen: true,
        showIndex: postMedia.length == 1 ? false : true,
        showBullets: postMedia.length == 1 ? false : true,
        showPlayButton: false,
        additionalClass: `image-gallery-container`,
        indexSeparator: " | "
    }

    return (
        <ImageGallery {...galleryProps} />
    )
}

export default PostCardMedia
