// Component imports
import { Link } from "react-router-dom";

// Material-UI imports
import { makeStyles, AppBar, IconButton, Toolbar, Fab } from "@material-ui/core"

// Icons
import PostAdd from '@material-ui/icons/PostAdd';

// Component
import Nav from "../../common-components/header/Nav";


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
        top: -18,
        width: 40,
        height: 40,
        boxShadow: "0px 0px 0 4px rgb(245 245 245)",
        zIndex: 10,


        "& svg": {
            width: "1.15em",
            height: "1.15em"
        }
    },
}))


function MobileBottomBar() {
    const classes = useStyles()

    return (
        <AppBar position="fixed" color="default" className={classes.appBar}>
            {/* <Fab className={classes.addPostBtn} to="/add-post" color="secondary" component={Link}>
                <PostAdd />
            </Fab> */}
            <Toolbar variant="dense">
                <Nav navClassName={classes.mobileNav} />
            </Toolbar>
        </AppBar>
    )
}

export default MobileBottomBar
