import React from 'react'

// Material-ui imports
import Dialog from "@material-ui/core/Dialog"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import Typography from "@material-ui/core/Typography"
import DialogContentText from "@material-ui/core/DialogContentText"
import Button from "@material-ui/core/Button"
import DialogActions from "@material-ui/core/DialogActions"
import { makeStyles } from "@material-ui/core/styles"
import { NotListedLocation } from "@material-ui/icons"
import { Backdrop } from '@material-ui/core'

// jss stylings
const useStyles = makeStyles(theme => ({
    deleteDialog: {
        textAlign: "center"
    },
    icon: {
        fontSize: "3.1875rem"
    },
    dialogTitle: {
        padding: "6px 16px"
    }

}))

export default function ConfirmPopUp({ onClose, dialogFunc }) {
    // jss stylings hook
    const classes = useStyles()

    // destructuring dialog Function
    const { title, subTitle, isOpen, onConfirm } = dialogFunc

    return (
        <Dialog
            className={classes.deleteDialog}
            open={isOpen} onClose={onClose}>
            <DialogTitle className={classes.dialogTitle} disableTypography>
                <NotListedLocation className={classes.icon} fontSize="large" color="error" />
                <Typography gutterBottom={false}>{title}</Typography>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {subTitle}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="default" onClick={onClose}>No</Button>
                <Button variant="contained" color="secondary" onClick={onConfirm}>Yes</Button>
            </DialogActions>
        </Dialog>
    )
}
