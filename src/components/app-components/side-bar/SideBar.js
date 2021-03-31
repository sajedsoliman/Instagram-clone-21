// Material-Ui imports
import { Button, makeStyles, Typography } from '@material-ui/core'
import { useRef, useState } from 'react'

// Component imports
import UserInfo from './UserInfo'

// styles
const useStyles = makeStyles(theme => ({
    sidebar: {
        display: "flex",
        flexDirection: "column",
        minHeight: 400,
        justifyContent: "space-between",
        marginBottom: 50,

        // because I removed padding from container in small screen just like instagram :)
        [theme.breakpoints.down("xs")]: {
            padding: 15
        }
    },
}))

function SideBar() {
    const classes = useStyles()


    return (
        <div className={classes.sidebar}>
            {/* user info (avatar, name) */}
            <UserInfo />

            {/* users suggestions */}


            {/* Footer */}
            <Typography
                className={classes.footer}
                variant="subtitle2"
                color="textSecondary">&copy; 2021 INSTAGRAM Clone By Sajid Sulaiman</Typography>
        </div>
    )
}

export default SideBar
