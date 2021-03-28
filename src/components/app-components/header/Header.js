import { useRef, useState } from "react"
import { Link as RouterLink } from 'react-router-dom'

// material-ui imports
import { makeStyles } from "@material-ui/core"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Container from "@material-ui/core/Container"
import Grid from "@material-ui/core/Grid"

// component imports
import Controls from "../../common-components/controls/Controls"
import Nav from '../../common-components/header/Nav'
import PopUp from "../../common-components/PopUp"
import LoginForm from '../forms/LoginForm'
import RegisterForm from "../forms/RegisterForm"
import SearchResults from "./SearchResults"
import LoggedUserAction from "./LoggedUserAction"

// Contexts
import { AuthedUser } from "../../user-context/AuthedUserContext"

// styles
const useStyles = makeStyles((theme) => ({
    header: {
        background: "#fff",

        [theme.breakpoints.down("xs")]: {
            display: "none"
        }
    },
    logoImg: {
        verticalAlign: "middle",
        paddingTop: 5,
        objectFit: "contain"
    },
    searchContainer: {
        textAlign: "center",

        [theme.breakpoints.down("xs")]: {
            display: "none"
        }
    },
    nav: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
    },
}))

export default function Header(props) {
    const classes = useStyles()
    const loggedUser = AuthedUser()

    // Refs
    const searchInput = useRef()

    // State vars
    const [searchValue, setSearchValue] = useState("")

    // search input change handler 
    const handleChangeSearch = (e) => {
        setSearchValue(e.target.value)
    }

    // Search input props
    const searchInputProps = {
        value: searchValue,
        inputRef: searchInput,
        handleChange: handleChangeSearch,
    }

    return (
        <AppBar className={classes.header} position="fixed" variant="outlined">
            <Container maxWidth="md">
                <Toolbar disableGutters>
                    <Grid container>
                        <Grid item xs={4} sm={2}>
                            <RouterLink to="/">
                                <img className={classes.logoImg} src="https://i.ibb.co/Bqm1g6x/735145cfe0a4.png" alt="instagram" />
                            </RouterLink>
                        </Grid>
                        <Grid className={classes.searchContainer} item sm={5}>
                            <Controls.SearchBox {...searchInputProps} />
                            <SearchResults
                                resetSearch={() => setSearchValue("")}
                                anchorEl={searchInput} searchText={searchValue} />
                        </Grid>
                        <Grid item xs={8} sm={5}>
                            <nav className={classes.nav}>
                                <Nav />

                                {/* Logged user action => login / register */}
                                {/* {loggedUser == "no user" &&
                                    <LoggedUserAction handleLoginModalOpen={handleLoginModalOpen}
                                        handleRegisterModalOpen={handleRegisterModalOpen} />
                                } */}
                            </nav>
                        </Grid>
                    </Grid>
                </Toolbar>
            </Container>
        </AppBar>
    )
}
