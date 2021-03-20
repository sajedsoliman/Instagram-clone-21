import { Link as RouterLink } from 'react-router-dom'
// Material-UI imports
import { makeStyles, Tabs, Tab } from '@material-ui/core'

// styles
const useStyles = makeStyles(theme => ({
    indicator: {
    }
}))

function VerticalTabs({ currentTab, tabs, handleChangeTab, indClr = "black" }) {
    const classes = useStyles()

    // map through tabs
    const mappedTabs = tabs.map((tab, index) => (
        <Tab key={index} label={tab.label} to={tab.path} component={RouterLink} />
    ))

    // Indicator styles object
    const indicatorStyles = {
        background: indClr
    }

    return (
        <Tabs
            onChange={handleChangeTab}
            TabIndicatorProps={{ style: indicatorStyles }}
            orientation="vertical"
            value={currentTab}
        >
            {mappedTabs}
        </Tabs>
    )
}

export default VerticalTabs
