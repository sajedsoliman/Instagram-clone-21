import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom'

// UI imports
import { makeStyles, Button } from "@material-ui/core"

// component imports
import UnFollowModal from '../../../../common-components/user-related/UnFollowModal';

// icons
import PersonAddDisabled from '@material-ui/icons/PersonAddDisabled';

// styles
const useStyles = makeStyles(theme => ({
    wrapper: {
        display: "flex",

        "& .MuiButton-root:first-child": {
            marginRight: 5
        }
    },
    removeFollowerBtn: {
        minWidth: 80,

    }
}))

function FollowedUserActions({ user }) {
    const classes = useStyles()

    // State vars
    const [modalOpen, setModalOpen] = useState({ title: "", isOpen: false })

    // handle open unFollow modal
    const handleOpenModal = () => {
        setModalOpen(prev => ({ ...prev, isOpen: !prev.isOpen }))
    }

    // Button common props
    const btnProps = (className) => ({
        variant: "outlined",
        color: "default",
        size: "small",
        className
    })

    return (
        <div className={classes.wrapper}>
            {/* Send a message when set the chat functionality - add (to) attr later */}
            <Button
                component={RouterLink}
                {...btnProps()}>
                Message
            </Button>

            {/* A modal toggler to un follow the user */}
            <Button
                onClick={handleOpenModal}
                {...btnProps(classes.removeFollowerBtn)}>
                <PersonAddDisabled fontSize="small" />
            </Button>

            {/* UnFollow popup handling */}
            <UnFollowModal
                user={user}
                infoFunc={modalOpen}
                closeHandle={handleOpenModal} />
        </div>
    )
}

export default FollowedUserActions
