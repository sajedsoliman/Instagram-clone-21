// Router imports
import { Link as RouterLink } from 'react-router-dom'

// Material-Ui imports
import { Avatar, CardHeader, IconButton, makeStyles } from "@material-ui/core";

// icons
import MoreVert from '@material-ui/icons/MoreVert';

// styles
const useStyles = makeStyles(theme => ({
    headerTitle: {
        fontWeight: 540,
    },
    profileLink: {
        textDecoration: "none",
        color: theme.palette.common.black
    }
}))

function PostCardHeader({ creatorInfo, location, handleOpenModal }) {
    const classes = useStyles()
    const { avatar, fullName, username } = creatorInfo

    // card header props
    const headerProps = {
        avatar: <Avatar alt={fullName} src={avatar}>{fullName[0]}</Avatar>,
        title: <RouterLink className={classes.profileLink} to={`/${username}`}>{fullName}</RouterLink>,
        classes: {
            title: classes.headerTitle
        },
        subheader: location,
        action: (
            <IconButton onClick={handleOpenModal} disableTouchRipple>
                <MoreVert fontSize={"small"} />
            </IconButton>
        )

    }

    return (
        <CardHeader  {...headerProps} />
    )
}

export default PostCardHeader
