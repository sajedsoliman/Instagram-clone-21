// Material-Ui imports
import { AppBar, makeStyles, Tab, Tabs } from '@material-ui/core'
import { useState } from 'react'

// component imports
import { AuthedUser } from '../../../../user-context/AuthedUserContext'
import UserPosts from './UserPosts'

// icons
import { ListAlt, BookmarkBorder } from '@material-ui/icons'
import CustomTabPanel from '../../../../common-components/TabPanel'

// style stuff
const useStyles = makeStyles(theme => ({
    tabsWrapper: {
        borderWidth: 0,
    },
    tabs: {
        borderTop: "1.5px solid rgba(0,0,0,.1)",
        overflow: "visible",

        "& .MuiTabs-scroller": {
            overflow: "visible !important",
            overflowX: "visible !important"
        }
    },
    tab: {
        minHeight: 20,

        "& .MuiTab-wrapper": {
            flexDirection: "row",

            "& .MuiSvgIcon-root": {
                margin: 0,
                marginRight: 3,
            }
        }
    },
    tabIndicator: {
        top: -2
    }
}))

function UserMedia({ user }) {
    const loggedUser = AuthedUser()
    const classes = useStyles()

    // State variables
    const [currentTab, setCurrentTab] = useState(0)

    // change current tab handler
    const handleChangeTab = (e, newTap) => {
        setCurrentTab(newTap)
    }

    // tabs wrapper props
    const tabsComponentProps = {
        TabIndicatorProps: { className: classes.tabIndicator },
        centered: true,
        value: currentTab,
        className: classes.tabs,
        onChange: handleChangeTab
    }

    // check if the logged user owns this accounts
    const isLoggedOwner = user.id == loggedUser?.uid

    return (
        <div className={classes.mediaWrapper}>
            <AppBar className={classes.tabsWrapper} variant="outlined" position="relative" color="transparent">
                <Tabs {...tabsComponentProps}>
                    <Tab className={classes.tab} icon={<ListAlt />} label="Posts" />
                    {
                        isLoggedOwner &&
                        (<Tab className={classes.tab} icon={<BookmarkBorder />} label="saved" />)
                    }
                </Tabs>
                {/* Render content according to the current tab and user */}
                <CustomTabPanel value={currentTab} index={0}>
                    <UserPosts userId={user.id} />
                </CustomTabPanel>
                <CustomTabPanel value={currentTab} index={1}>
                </CustomTabPanel>

            </AppBar>
        </div>
    )
}

export default UserMedia
