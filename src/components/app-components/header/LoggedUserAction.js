
// Material-UI imports
import { Button } from "@material-ui/core"
import makeStyles from "@material-ui/core/styles/makeStyles"

// icons

// component imports / info

// Styles
const useStyles = makeStyles((theme) => ({
    signinBtn: {
        marginLeft: 20,
        marginRight: 5
    },
    linkNav: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "flex-end",
    },
}))


function LoggedUserAction({ handleLoginModalOpen, handleRegisterModalOpen }) {
    const classes = useStyles()

    return (
        <nav className={classes.linkNav}>
            <Button className={classes.signinBtn} variant="outlined" color="primary" size="small" onClick={handleLoginModalOpen}>Login</Button>

            <Button className={classes.registerBtn} variant="outlined" color="primary" size="small" onClick={handleRegisterModalOpen}>Register</Button>
        </nav>
    )
}

export default LoggedUserAction
