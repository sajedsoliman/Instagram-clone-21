import { useState } from 'react'
// Router
import { Link as RouterLink } from 'react-router-dom'

// Material imports
import { makeStyles, Typography, Link } from '@material-ui/core'

// Components
import UserProfileOverview from '../user-related/UserProfileOverview'
import CustomPopper from '../ui/CustomPopper'

// style
const useStyles = makeStyles(theme => ({
    postCaption: {
        marginLeft: 10,
    },
    postBody: {
        marginBottom: 5,
    },
}))


// Imported user so that users can follow then by the profile overview
function PostCaption({ user, username, caption }) {
    const classes = useStyles()

    // anchor element for the profile overview
    const [overviewProfileEl, setOverviewProfileEl] = useState(null)

    // State vars
    // handle reset the profile overview element
    const closeProfileOverview = () => {
        setOverviewProfileEl(null)
    }

    // handle add the profile overview element
    const showProfileOverview = (e) => {
        setOverviewProfileEl(e.target)
    }

    // props for profile overview popper
    const profileOverviewPopperProps = {
        anchorEl: overviewProfileEl,
        placement: "bottom-start",
        portal: true,
        withArrow: true
    }


    return (
        <Typography variant="body2" className={classes.postBody}>
            <Link
                onMouseLeave={closeProfileOverview}
                component={RouterLink}
                to={`/${username}`}
                color="textPrimary">
                <strong onMouseOver={showProfileOverview}>{username}</strong>

                {/* User profile Popper */}
                <CustomPopper {...profileOverviewPopperProps}>
                    <UserProfileOverview user={user} />
                </CustomPopper>
            </Link>
            <Typography
                className={classes.postCaption}
                variant="body1"
                component="span">{caption}</Typography>
        </Typography>
    )
}

export default PostCaption
