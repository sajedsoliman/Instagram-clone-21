import { useCallback, useEffect, useState } from "react"


function useWindowWidth() {

    // State vars 
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    // Window onResize callback (to stop the event listener on unMount)
    const onResize = useCallback(() => {
        setWindowWidth(window.innerWidth)
    })

    // set a listener to catch window size changing
    useEffect(() => {
        window.addEventListener("resize", onResize);

        // clean up and remove the event listener
        return () => { window.removeEventListener("resize", onResize) }
    }, [])


    return { windowWidth }
}

export default useWindowWidth
