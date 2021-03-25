import { Link as RouterLink } from 'react-router-dom'

import { useEffect, useRef, useState } from 'react'

// UI imports


// Component imports
import AppPage from '../AppPage'
import Store from '../../../common-components/firebase/Store'
import Controls from '../../../common-components/controls/Controls'
import { Avatar, List, ListItem, ListItemAvatar, ListItemText, makeStyles } from '@material-ui/core'

// styles
const useStyles = makeStyles((theme) => ({
    resultsList: {
        maxHeight: "calc(100% - 60px)" /* 50px => search box height */,
        overflowY: "auto",
    },
    searchBoxWrapper: {
        display: "flex",
        justifyContent: "center",
        padding: "0 30px 10px",
    },
}))

function SearchUser() {
    const classes = useStyles()

    // Refs
    const searchInput = useRef()

    // State vars
    const [searchText, setSearchText] = useState("")
    const [members, setMembers] = useState([])

    // Imports Store component to get search results
    const { getSearchMembers } = Store()

    // Put a listener to get search members on type
    useEffect(() => {
        if (searchText == "") return setMembers([])

        getSearchMembers(searchText, setMembers)
    }, [searchText])

    // handle search text change
    const handleSearchTextChange = (e) => {
        setSearchText(e.target.value)
    }

    // Search input props
    const searchInputProps = {
        value: searchText,
        inputRef: searchInput,
        handleChange: handleSearchTextChange,
        className: classes.searchBox,
        fullWidth: true
    }

    // map through members and show them !
    const mappedMembers = members.map(member => {

        const { avatar, username, fullName } = member
        return (
            <ListItem key={username} to={`/${username}`} component={RouterLink} button>
                <ListItemAvatar>
                    <Avatar src={avatar}>{fullName[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={username}
                    secondary={fullName} />
            </ListItem >
        )
    })

    return (
        <AppPage>
            {/* Search Box */}
            <div className={classes.searchBoxWrapper}>
                <Controls.SearchBox
                    {...searchInputProps} />
            </div>

            {/* Results */}
            <List className={classes.resultsList}>
                {mappedMembers}
            </List>
        </AppPage >
    )
}

export default SearchUser
