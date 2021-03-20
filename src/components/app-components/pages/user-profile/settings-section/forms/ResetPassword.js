import { useState } from 'react'

// Material imports
import { makeStyles, Typography } from '@material-ui/core'

// component imports
import { Form } from '../../../../../common-components/useForm'
import Store from '../../../../../common-components/firebase/Store'
import RowFormGroup from '../controls/RowFormGroup'
import CommonButton from '../../../../../common-components/CommonButton'
import { AuthedUser } from '../../../../../user-context/AuthedUserContext'

// styles
const useStyles = makeStyles({
    errMsg: {
        marginBottom: 20
    }
})

function ResetPassword() {
    const classes = useStyles()

    // State vars
    const [password, setPassword] = useState({ new: "", confirm: "" })
    const [error, setError] = useState("")

    // import firebase functions
    const { updatePassword } = Store()

    // handle update user (submit form)
    const handleSubmitForm = () => {
        const { new: newPass, confirm } = password
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?=.*[a-zA-Z]).{8,}$/

        // Check if password follow the rules
        if (passwordRegex.test(newPass)) {
            // reset error
            setError("")

            if (newPass != confirm) {
                setError("Passwords are not identical")
            } else {
                // Remove the old error
                setError("")
                // handle update user's password
                updatePassword(newPass)

                // Reset password field
                setPassword({ new: "", confirm: "" })
            }
        } else {
            // if the password doesn't follow the rules(Regex rules)
            setError("Password isn't strong enough")
        }
    }

    // handle new password change
    const handlePasswordChange = (e) => {
        const { value, name } = e.target
        setPassword(prev => ({ ...prev, [name]: value }))
    }

    // control props
    const inputProps = (value, name, helperText) => ({
        value,
        inputChange: handlePasswordChange,
        name,
        helperText
    })

    return (
        <Form onSubmit={handleSubmitForm}>
            <Typography className={classes.errMsg} color="error">{error}</Typography>

            {/* New Password */}
            <RowFormGroup label="New Password"
                controlProps={inputProps(password.new, "new", "Must contain capital and small letters, number, and special characters")} password={true} />

            {/* Confirm New Password */}
            <RowFormGroup label="New Password Confirm"
                controlProps={inputProps(password.confirm, "confirm", "")} password={true} />

            {/* Submit form button */}
            <CommonButton
                disabled={!Boolean(password.new)}
                onClick={handleSubmitForm}
                text="Change" />
        </Form>
    )
}

export default ResetPassword
