import { Link as RouterLink } from 'react-router-dom'

// Material-Ui imports
import { Link, makeStyles, Typography } from '@material-ui/core'

// component imports
import { AuthedUser } from '../../../../user-context/AuthedUserContext'

// style
const useStyles = makeStyles(theme => ({
    details: {
        marginTop: 30,
        flexDirection: "column",
        "& > *": {
            marginBottom: 10
        }
    },
    nameText: {
        fontWeight: 550
    },
    website: {
        marginTop: 5
    }
}))

function UserDetails({ user }) {
    // Get auth user to control add bio and other things
    const loggedUser = AuthedUser()
    const classes = useStyles()

    // destructuring through user
    const { fullName, bio, username, website } = user

    // Check that if the user if logged and they own this profile
    const isLoggedOwner = Boolean(loggedUser) && (loggedUser.username == username)


    return (
        <div className={classes.details}>
            {/* User fullName */}
            <Typography className={classes.nameText} component="h6">{fullName}</Typography>
            {/* User bio if any */}
            <Typography variant="body2">
                {bio || "No bio yet. "}
                {
                    isLoggedOwner && bio.length == 0 ? <Link to="/accounts/edit" component={RouterLink}>Add bio</Link> : ""
                }
            </Typography>
            {/* User Website if any */}
            {website.length != 0 &&
                <Typography className={classes.website}>
                    <Link target="_blank" href={`http://${website}/`}>{website}</Link>
                </Typography>
            }
        </div>
    )
}

export default UserDetails
