// Component imports
import { Link } from "react-router-dom";

// Material-UI imports
import { makeStyles, AppBar, IconButton, Toolbar, Fab } from "@material-ui/core"
import PostAdd from '@material-ui/icons/PostAdd';

// styles
const useStyles = makeStyles(theme => ({
    appBar: {
        bottom: 0,
        top: "auto",
        [theme.breakpoints.up("sm")]: {
            display: "none"
        }
    },
    addPostBtn: {
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        top: -25,
        width: 53,
        height: 53,
        boxShadow: "0px 0px 0 4px #e0d8d8",

        "& svg": {
            width: "1.15em",
            height: "1.15em"
        }
    }
}))


function MobileBottomBar() {
    const classes = useStyles()

    return (
        <AppBar position="fixed" color="default" className={classes.appBar}>
            <Toolbar variant="dense">
                <Fab className={classes.addPostBtn} to="/add-post" color="secondary" component={Link}>
                    <PostAdd />
                </Fab>
            </Toolbar>
        </AppBar>
    )
}

export default MobileBottomBar
