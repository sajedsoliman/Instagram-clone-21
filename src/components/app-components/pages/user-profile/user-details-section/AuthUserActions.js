import { useState } from 'react'
import { Link } from 'react-router-dom'

// Material-Ui imports
import { Button, IconButton, makeStyles } from '@material-ui/core'

// component imports
import PopUp from '../../../../common-components/PopUp'
import SettingsMenu from './SettingsMenu'

// styles
const useStyles = makeStyles(theme => ({
    actionsWrapper: {
    },
    settingToggleBtn: {
        marginLeft: 5,
        "& .material-icons": {
            fontSize: 30
        }
    },
    dialogContent: {
        padding: "0 !important",
        width: 400,
    }
}))

function AuthUserActions() {
    const classes = useStyles()

    // State variables
    const [openModal, setOpenModal] = useState({ isOpen: false, title: "" })

    // toggle the settings menu modal handler
    const handleToggleSettingsMenu = () => {
        setOpenModal(prev => ({
            isOpen: !prev.isOpen
        }))
    }

    // popup props
    const settingsPopupProps = {
        infoFunc: openModal,
        closeHandle: handleToggleSettingsMenu,
        contentStyles: classes.dialogContent,
        maxWidth: "sm"
    }

    return (
        <div className={classes.actionsWrapper}>
            {/* Edit profile button */}
            <Button variant="outlined" size="small" component={Link} to="/accounts/edit">Edit Profile</Button>

            {/* toggle settings menu dialog */}
            <IconButton
                onClick={handleToggleSettingsMenu}
                disableRipple
                size="small"
                className={classes.settingToggleBtn}>
                <span class="material-icons md-24">manage_accounts </span>
            </IconButton>

            {/* Settings Modal - dialog */}
            <PopUp {...settingsPopupProps}>
                <SettingsMenu closeMenu={handleToggleSettingsMenu} />
            </PopUp>
        </div>
    )
}

export default AuthUserActions
