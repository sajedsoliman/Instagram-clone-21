import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'

// UI imports
import { Avatar, CardHeader, IconButton, makeStyles } from '@material-ui/core'

// Icons
import { Info, InfoOutlined } from '@material-ui/icons'

// Contexts

// Component imports

// style staff
const useStyles = makeStyles(theme => ({
    header: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        height: 35,
        [theme.breakpoints.down(960)]: {
            marginTop: 60,
            borderTop: `1px solid ${theme.palette.divider}`,
        }
    },
    avatar: {
        width: 35,
        height: 35,
    },
    username: {
        textDecoration: "none",
        color: "black",
        fontSize: 17
    }
}))

function ChatHeader({ member, toggleDetails, detailsOpen }) {
    const classes = useStyles()

    // Destructuring the member
    const { avatar, username } = member

    // State vars


    // senTo avatar
    const headerAvatar = (
        <Avatar className={classes.avatar} src={avatar} />
    )


    // Chat title props
    const titleProps = {
        component: RouterLink,
        to: `/${username}`,
        className: classes.username,
        variant: "h6"
    }

    // Chat action
    const chatAction = (
        <IconButton onClick={toggleDetails} color="inherit">
            {detailsOpen ? <Info /> : <InfoOutlined />}
        </IconButton>
    )

    if (!detailsOpen) {
        return (
            <CardHeader
                className={classes.header}
                avatar={headerAvatar}
                title={username}
                titleTypographyProps={titleProps}
                action={chatAction}
            />
        )
    } else {
        return (
            <CardHeader
                className={classes.header}
                title={"Details"}
                titleTypographyProps={{ variant: "h6", align: "center" }}
                action={chatAction}
            />
        )
    }
}

export default ChatHeader
