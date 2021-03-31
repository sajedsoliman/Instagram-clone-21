import { makeStyles, Popper, Paper, Grow } from '@material-ui/core'
import clsx from "clsx"

// styles
const useStyles = makeStyles((theme) => ({
    popper: {
    },
}))


export default function MenuListCom(props) {
    // destructuring props
    const { anchorEl, open, placement = "top-end", popperClassName, children, portal } = props
    const classes = useStyles()

    const popperProps = {
        open: open != undefined ? open : Boolean(anchorEl),
        anchorEl: anchorEl,
        transition: true,
        className: clsx(popperClassName, classes.popper),
        placement
    }

    return (
        <Popper {...popperProps} disablePortal={!portal}>
            <Grow in={open || Boolean(anchorEl)}>
                <Paper elevation={3}>
                    {children}
                </Paper>
            </Grow>
        </Popper>

    )
}