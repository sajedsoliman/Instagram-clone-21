import React, { useContext, useState } from 'react'
import NotificationSnackbar from '../common-components/NotificationSnackbar'

const AlertContextUpdate = React.createContext()

export function useAlert() {

    return useContext(AlertContextUpdate)
}

export function NotificationContext({ children }) {
    const [notificationMsg, setNotification] = useState("")
    const [alertSeverity, setAlertSeverity] = useState("")

    // set process value to true (DRY)
    const alertSettings = (severity, msg) => {
        setAlertSeverity(severity)
        setNotification(msg)
    }

    // handle close alerts
    const closeAlert = () => {
        setNotification("")
    }

    return (
        <>
            <AlertContextUpdate.Provider value={alertSettings}>
                {children}
            </AlertContextUpdate.Provider>

            <NotificationSnackbar
                onClose={closeAlert}
                alertSeverity={alertSeverity}
                notificationMsg={notificationMsg} />
        </>
    )
}