import { useRef, useState } from "react"

// material-ui imports
import { makeStyles } from "@material-ui/core"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Container from "@material-ui/core/Container"
import Grid from "@material-ui/core/Grid"

// component imports
import Controls from "../common-components/controls/Controls"
import Nav from '../common-components/header/Nav'
import PopUp from "../common-components/PopUp"
import LoginForm from './forms/LoginForm'
import RegisterForm from "./forms/RegisterForm"
import SearchResults from "./SearchResults"

// styles
const useStyles = makeStyles((theme) => ({
    header: {
        background: "#fff"
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
    }
}))

export default function Header(props) {
    const classes = useStyles()

    // Refs
    const searchInput = useRef()

    // State vars
    const [loginModal, setLoginModal] = useState({ title: null, isOpen: false })
    const [registerModal, setRegisterModal] = useState({ title: null, isOpen: false })
    const [searchValue, setSearchValue] = useState("")

    const handleLoginModalOpen = () => {
        setLoginModal(prev => ({
            ...prev, isOpen: true
        }))
    }

    const handleLoginModalClose = () => {
        setLoginModal(prev => ({
            ...prev, isOpen: false
        }))
    }

    const handleRegisterModalOpen = () => {
        setRegisterModal(prev => ({
            ...prev, isOpen: true
        }))
    }

    const handleRegisterModalClose = () => {
        setRegisterModal(prev => ({
            ...prev, isOpen: false
        }))
    }

    // search input change handler 
    const handleChangeSearch = (e) => {
        setSearchValue(e.target.value)
    }

    // Search input props
    const searchInputProps = {
        value: searchValue,
        inputRef: searchInput,
        handleChange: handleChangeSearch
    }

    return (
        <AppBar className={classes.header} position="fixed" variant="outlined">
            <Container maxWidth="md">
                <Toolbar disableGutters>
                    <Grid container>
                        <Grid item xs={4} sm={2}>
                            <img className={classes.logoImg} src="https://i.ibb.co/Bqm1g6x/735145cfe0a4.png" alt="instagram" />
                        </Grid>
                        <Grid className={classes.searchContainer} item sm={5}>
                            <Controls.SearchBox {...searchInputProps} />
                            <SearchResults anchorEl={searchInput} searchText={searchValue} />
                        </Grid>
                        <Grid item xs={8} sm={5}>
                            <Nav
                                handleLoginModalOpen={handleLoginModalOpen}
                                handleRegisterModalOpen={handleRegisterModalOpen} />

                            {/* Login Modal */}
                            <PopUp infoFunc={loginModal} closeHandle={handleLoginModalClose}>
                                <LoginForm handleLoginModalClose={handleLoginModalClose} />
                            </PopUp>

                            {/* Register Modal */}
                            <PopUp infoFunc={registerModal} closeHandle={handleRegisterModalClose}>
                                <RegisterForm handleCloseModal={handleRegisterModalClose} />
                            </PopUp>
                        </Grid>
                    </Grid>
                </Toolbar>
            </Container>
        </AppBar>
    )
}
