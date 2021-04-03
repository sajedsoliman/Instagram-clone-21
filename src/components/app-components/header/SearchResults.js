// To Show search members in a popup

import React, { useState, useEffect } from 'react'

// UI imports
import { makeStyles } from '@material-ui/core'

// Component imports
import CustomMenuList from '../../common-components/CustomMenuList'
import Store from '../../common-components/firebase/Store'
import SearchMemberCard from '../../common-components/user-related/SearchMemberCard'

// style stuff
const useStyles = makeStyles(theme => ({
    menu: {
        minWidth: 350
    },
}))

function SearchResults(props) {
    const classes = useStyles()

    // Destructuring props
    const { anchorEl, searchText, resetSearch } = props

    // State vars
    const [open, setOpen] = useState(false)
    const [members, setMembers] = useState([])

    // import Store component
    const { getSearchMembers } = Store()

    // useEffect to listen to search input text changing
    useEffect(() => {
        // check if the text is empty => set open to false
        if (searchText == "") {
            setOpen(false)
            setMembers([])
        } else if (searchText != "" && anchorEl.current) {
            setOpen(true)

            // fetch members from db
            getSearchMembers(searchText, setMembers)
        }

    }, [searchText])

    // close search menu handler
    const handleClose = () => {
        resetSearch()
        setOpen(false)
    }

    // map through search members
    const mappedMembers = members.map(member => {
        return <SearchMemberCard key={member.objectID} member={member} closePopper={handleClose} />
    })

    return (
        <CustomMenuList
            menuClassName={classes.menu}
            placement="top"
            anchorEl={anchorEl?.current}
            open={open}
            handleClose={handleClose}>
            {mappedMembers}
        </CustomMenuList>
    )
}

export default SearchResults
