import { useEffect, useState } from 'react'

// Material imports
import { Fade, makeStyles, Slide, Typography } from '@material-ui/core'

// component imports
import Store from '../../../../../common-components/firebase/Store'
import RowFormGroup from '../controls/RowFormGroup'
import CommonButton from '../../../../../common-components/CommonButton'

// Hooks
import { Form } from '../../../../../common-components/hooks/useForm'

// Contexts

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

    // import Store component to update passwords
    const { updatePassword } = Store()

    // Put a listener on the error message that will reset the error after 3 seconds
    useEffect(() => {
        if (error !== "") {
            setTimeout(() => {
                setError("")
            }, 3000)
        }
    }, [error])

    // handle update user (submit form)
    const handleSubmitForm = () => {
        // Set new property to newPass, because new is unique symbol
        const { new: newPass, confirm } = password
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?=.*[a-zA-Z]).{8,}$/

        // Check if password follow the rules
        if (passwordRegex.test(newPass)) {

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

    // handle new password input change
    const handlePasswordInputChange = (e) => {
        const { value, name } = e.target
        setPassword(prev => ({ ...prev, [name]: value }))
    }

    // control props
    const inputProps = (value, name, helperText) => ({
        value,
        inputChange: handlePasswordInputChange,
        name,
        helperText
    })

    return (
        <Form onSubmit={handleSubmitForm}>
            <Fade in={error !== ""}>
                <Typography className={classes.errMsg} color="error">{error}</Typography>
            </Fade>

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
