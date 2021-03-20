import PropTypes from 'prop-types'

// Material-UI imports
import { Avatar, Card, CardActions, CardContent, CardHeader, CardMedia, withStyles } from '@material-ui/core'

// Images
import noAvatar from './images/fc047347b17f7df7ff288d78c8c281cf.png'
import noImage from './images/noimage.png'

// Styles
import classes from './Styles'
// For animations
import './skeleton-style.css'

const styles = theme => ({
    ...classes
})

function PostCardSkeleton(props) {
    const { classes, children, className, ...other } = props;

    return (
        <Card className={`${classes.cardRoot} skeleton-card`} variant="outlined">
            <CardHeader
                avatar={<Avatar src={noAvatar} />}
                title=""
                subheader=""
                action={<div className={classes.action}></div>}
                subheaderTypographyProps={{ className: classes.subHeader }}
                titleTypographyProps={{ className: classes.title }} />
            <CardMedia className={classes.image} image={noImage} />
            <CardContent className={classes.content}>
                <div className={classes.actions}></div>
                <div className={classes.caption}></div>
                <div className={classes.commentsMsg}></div>
            </CardContent>
            <CardActions className={classes.commentsBox}></CardActions>
        </Card>
    )
}


PostCardSkeleton.propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
};

export default withStyles(styles)(PostCardSkeleton);