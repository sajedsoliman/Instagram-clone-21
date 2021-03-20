

function getImageShape(imageSrc) {
    const img = new Image()
    img.src = imageSrc
    if (img.height <= img.width)
        return "landscape"
    else return "portrait"
}

function isVideo(src) {
    if (src.search("mp4") != -1) return true
    return false
}


export { getImageShape, isVideo }