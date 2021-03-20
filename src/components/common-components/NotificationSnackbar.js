import React from 'react'

// material-ui imports
import { Snackbar, Slide } from "@material-ui/core"
import { Alert } from "@material-ui/lab"


export default function NotificationSnackbar(props) {
    const { onClose, classValue, alertSeverity, notificationMsg } = props

    return (
        <Snackbar
            disableWindowBlurListener
            className={classValue}
            ClickAwayListenerProps={{ mouseEvent: false }}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            TransitionComponent={Slide}
            open={notificationMsg == "" ? false : true}
            autoHideDuration={3000}
            onClose={onClose} >

            <Alert severity={alertSeverity}>{notificationMsg}</Alert>

        </Snackbar>
    )
}
