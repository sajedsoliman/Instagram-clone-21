import { useEffect, useState } from 'react'

// Material-UI Imports
import { makeStyles, Typography } from '@material-ui/core'

// Component imports
import CommonButton from '../../../../../common-components/CommonButton'
import RowFormGroup from '../controls/RowFormGroup'
import UserProfileImage from '../../user-details-section/UserProfileImage'
import Store from '../../../../../common-components/firebase/Store'

// Utilities
import { validation } from '../../../../forms/functions'
import TwoColumnGrid from '../utilites/TwoColumnGrid'

// Hooks
import { useForm, Form } from '../../../../../common-components/hooks/useForm'

// Contexts
import { AuthedUser } from '../../../../../user-context/AuthedUserContext'


// style
const useStyles = makeStyles(theme => ({
    avatar: {
        width: 50,
        height: 50
    },
    circularProgress: {
        top: -4,
        left: -4
    },
    changeImage: {
        cursor: "pointer"
    },
    userFullName: {
        [theme.breakpoints.down("xs")]: {
            marginTop: 10
        }
    }
}))

function EditProfile() {
    const classes = useStyles()
    const loggedUser = AuthedUser()

    // import update user method and the user info from Store component
    const { updateUser } = Store()

    // State vars
    // put the change image profile modal here -> to handle it from other places (not just by avatar image)
    const [modalInfo, setModalInfo] = useState({ isOpen: false, title: "Change Profile Image" })

    // destructuring useForm
    const {
        values: user,
        inputCommonProps,
        validationErrors,
        setErrors
    } = useForm(loggedUser, false, validation)

    // handle toggle change avatar modal
    const handleModalOpen = () => {
        setModalInfo(prev => ({
            ...prev, isOpen: !prev.isOpen
        }))
    }

    // avatar side in that two grid component
    const avatarSide = <UserProfileImage
        avatarClassName={classes.avatar}
        modalOpen={modalInfo}
        handleModalOpen={handleModalOpen}
        progressSize={58}
        progressClassName={classes.circularProgress}
        fullName={loggedUser.fullName}
        avatar={loggedUser.avatar} />

    // user name side in that two grid component
    const userNameSide = (
        <div>
            <Typography className={classes.userFullName}>{loggedUser.fullName}</Typography>
            <Typography
                onClick={handleModalOpen}
                className={classes.changeImage}
                color="primary">Change Profile Image</Typography>
        </div>
    )

    // handle update user (submit form)
    const handleSubmitForm = () => {
        if (validation(user, setErrors)) {
            updateUser(user)
        }
    }

    if (loggedUser == "no user") return null

    return (
        <Form>
            {/* Avatar Update */}
            <TwoColumnGrid colOne={avatarSide} colTwo={userNameSide} />

            {/* full name group */}
            <RowFormGroup label="Full Name"
                controlProps={inputCommonProps("", "fullName", user.fullName, validationErrors.fullName)} />
            {/* username group */}
            <RowFormGroup label="Username"
                controlProps={inputCommonProps("", "username", user.username, validationErrors.username)} />
            {/* Bio group */}
            <RowFormGroup label="Bio"
                multi={true}
                controlProps={inputCommonProps("", "bio", user.bio)} />
            {/* Website group */}
            <RowFormGroup label="Website"
                controlProps={inputCommonProps("", "website", user.website, validationErrors.website)} />

            {/* Submit form button */}
            <CommonButton
                onClick={handleSubmitForm}
                text="Submit" />
        </Form>
    )
}

export default EditProfile
