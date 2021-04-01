import { useState } from 'react'

// Material-UI imports
import { makeStyles, Popper, Paper, Grow } from '@material-ui/core'
import clsx from "clsx"

// Popper imports
import { usePopper } from 'react-popper'

// styles
const useStyles = makeStyles((theme) => ({
    popper: {
        "&[x-placement*='top'] > .arrow": {
            bottom: -2,
            top: "auto"
        },
    },
    arrowEl: {
        width: 15,
        height: 15,
        top: -2,
        transform: "rotateZ(45deg)",
        background: "white",
    }
}))


export default function MenuListCom(props) {
    // destructuring props
    const { anchorEl, open, placement = "top-end", popperClassName, children, withArrow = true, portal } = props
    const classes = useStyles()

    // get arrow styles from usePopper hook
    const { styles, attributes } = usePopper()

    // State vars
    const [arrowEl, setArrowEl] = useState(null)

    const popperProps = {
        open: open != undefined ? open : Boolean(anchorEl),
        anchorEl: anchorEl,
        transition: true,
        className: clsx(popperClassName, classes.popper),
        modifiers: {
            flip: {
                enabled: true,
            },
        },
        // placement
    }

    return (
        <Popper popperOptions={{ placement: "bottom-start" }} {...popperProps} disablePortal={!portal}>
            <Grow in={open || Boolean(anchorEl)}>
                <>
                    {children}
                </>
            </Grow>
        </Popper>
    )
}