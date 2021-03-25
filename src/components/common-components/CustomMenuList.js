import { useEffect } from "react"
import { MenuList, makeStyles, Popper, ClickAwayListener, Paper, Grow } from '@material-ui/core'
import clsx from "clsx"

// styles
const useStyles = makeStyles((theme) => ({
    popper: {
        top: "19px !important"
    },
}))

export default function MenuListCom(props) {
    // destructuring props
    const { items, anchorEl, handleClose, open, placement = "top-end", menuClassName, popperClassName, children } = props
    const classes = useStyles()


    const popperProps = {
        open: open != undefined ? open : Boolean(anchorEl),
        anchorEl: anchorEl,
        transition: true,
        className: clsx(popperClassName, classes.popper),
        placement
    }

    return (
        <Popper {...popperProps}>
            <Grow in={open || Boolean(anchorEl)}>
                <Paper elevation={3}>
                    <ClickAwayListener onClickAway={handleClose}>
                        <MenuList
                            className={menuClassName}
                            disablePadding
                            autoFocusItem={Boolean(anchorEl)}>
                            {children}
                        </MenuList>
                    </ClickAwayListener>
                </Paper>
            </Grow>
        </Popper>

    )
}