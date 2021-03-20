import React from 'react'

// material components
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Grow, Fade } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';

// icons
import Close from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
    dialog: {
        maxWidth: 750,
        minWidth: 250,
    },
    dialogTitle: {
        padding: "20px 10px",

        "& h2": {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
        }
    },
    closeButton: {
        minWidth: 15,
        padding: "1px 4px !important"
    },
}))

export default function PopUp(props) {
    const classes = useStyles()

    const { infoFunc, closeHandle, maxWidth, transCom = Grow, contentStyles, dividers = false, children } = props;
    const { title, isOpen } = infoFunc

    return (
        <Dialog
            open={isOpen}
            onClose={closeHandle}
            maxWidth={maxWidth}
            TransitionComponent={transCom}
            classes={{ paperWidthSm: classes.dialog }}>
            {title &&
                <DialogTitle classes={{ root: classes.dialogTitle }}>
                    <Typography gutterBottom={false}>{title}</Typography>
                    <Button className={classes.closeButton}
                        variant="outlined"
                        color="secondary"
                        onClick={closeHandle}>
                        <Close />
                    </Button>
                </DialogTitle>
            }
            <DialogContent dividers={dividers} className={contentStyles}>
                {children}
            </DialogContent>
        </Dialog>
    )
}
