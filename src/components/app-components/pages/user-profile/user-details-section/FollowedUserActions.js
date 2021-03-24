import { Link as RouterLink, useHistory } from 'react-router-dom'
import { useState } from 'react';

// UI imports
import { makeStyles, Button } from "@material-ui/core"

// icons
import PersonAddDisabled from '@material-ui/icons/PersonAddDisabled';


// component imports
import UnFollowModal from '../../../../common-components/user-related/UnFollowModal';
import Store from '../../../../common-components/firebase/Store';

// Hooks
import useWindowWidth from '../../../../common-components/hooks/useWindowWidth';


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

    // Router
    const history = useHistory()

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


    // Import Store component to create a new chat and some checks
    const { createChat } = Store()

    // Import window Width custom hook
    const { windowWidth } = useWindowWidth()


    // handle click message btn
    const HandleCreateChat = async () => {
        // Check if the user has a chat with the user in this profile
        // go to the chat id (either it's now or already exists)
        history.push(`direct/inbox/t/${await createChat(user)}`, (windowWidth < 960 ? { mobile: true } : {}))

    }

    return (
        <div className={classes.wrapper}>
            {/* Send a message when set the chat functionality - add (to) attr later */}
            <Button
                onClick={HandleCreateChat}
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
