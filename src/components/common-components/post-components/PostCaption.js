// Router
import { Link as RouterLink } from 'react-router-dom'

// Material imports
import { makeStyles, Typography, Link } from '@material-ui/core'

// style
const useStyles = makeStyles(theme => ({
    postCaption: {
        marginLeft: 10,
    },
    postBody: {
        marginBottom: 5,
    },
}))

function PostCaption({ username, caption }) {
    const classes = useStyles()

    return (
        <Typography variant="body2" className={classes.postBody}>
            <Link
                component={RouterLink}
                to={`/${username}`}
                color="textPrimary"><strong>{username}</strong></Link>
            <Typography
                className={classes.postCaption}
                variant="body1"
                component="span">{caption}</Typography>
        </Typography>
    )
}

export default PostCaption
