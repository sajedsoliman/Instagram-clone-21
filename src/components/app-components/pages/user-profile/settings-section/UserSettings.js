import { useState } from 'react'
import { useHistory, useParams } from 'react-router'

// Material-UI Imports
import { Card, Container, Grid, makeStyles } from '@material-ui/core'

// styles imports
import styles from '../styles'

// component imports
import AppPage from '../../AppPage'
import VerticalTabs from '../../../../common-components/ui/VerticalTabs'
import CustomTabPanel from '../../../../common-components/TabPanel'
import EditProfile from './forms/EditProfile'
import { AuthedUser } from '../../../../user-context/AuthedUserContext'
import ResetPassword from './forms/ResetPassword'

// utilities
const tabs = [{ label: "Edit Profile", path: "/accounts/edit" }, { label: "Change Password", path: "/accounts/change_password" }]

// Styles
const useStyles = makeStyles(theme => ({
    ...styles,
    tabsWrapper: {
        borderRight: `1px solid ${theme.palette.divider}`,
        [theme.breakpoints.down("sm")]: {
            display: "none"
        }
    },
    formContainer: {
        paddingTop: 50,
        paddingBottom: 50
    },
    wrapper: {
        minHeight: "75%"
    }
}))

function UserSettings() {
    const loggedUser = AuthedUser()
    const classes = useStyles()

    // Router
    // Get the current tab from params - will return a string value
    const { id } = useParams()
    const history = useHistory()

    // A switch to set the current tab depending on which page the user at
    let activeTab
    switch (id) {
        case "edit":
            activeTab = 0
            break;
        case "change_password":
            activeTab = 1
            break;
        default:
            history.replace("/pages/not-found")
            break;
    }

    // State vars
    const [currentTab, setCurrentTab] = useState(activeTab)

    // change tab handling
    const handleChangeTab = (e, newTab) => {
        setCurrentTab(newTab)
    }

    // Render the right form at the current tab
    const getTabPanelContent = (index) => {
        let toBeRendered

        // A switch to assign the right element for each index
        switch (index) {
            case 0:
                toBeRendered = <EditProfile />
                break;
            default:
                toBeRendered = <ResetPassword />
                break;
        }
        return (
            <CustomTabPanel index={index} value={currentTab}>
                {toBeRendered}
            </CustomTabPanel>
        )
    }

    if (loggedUser != null) {

        return (
            <AppPage>
                <Container maxWidth="md">
                    <Card variant="outlined" className={classes.settingsCard}>
                        <Grid container className={classes.wrapper}>
                            {/* Left Side setting options - like edit profile or password etc... */}
                            <Grid item md={3} className={classes.tabsWrapper}>
                                {/* Vertical taps */}
                                <VerticalTabs tabs={tabs}
                                    handleChangeTab={handleChangeTab}
                                    currentTab={currentTab} />
                            </Grid>

                            {/* Right Side - edit form */}
                            <Grid item xs={12} md={9}>
                                <Container maxWidth="xs" className={classes.formContainer}>
                                    {/* Render the current tab's form */}
                                    {getTabPanelContent(0)}
                                    {getTabPanelContent(1)}
                                </Container>
                            </Grid>
                        </Grid>
                    </Card>
                </Container>
            </AppPage>
        )
    } else {
        return null
    }
}
export default UserSettings
