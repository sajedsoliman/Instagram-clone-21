import React, { useState } from 'react'

// material-ui imports
import { TextField } from "@material-ui/core"

// icons
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

export default function PasswordInput({ validationError, inputChange, value, label, name, ...otherProps }) {
    const [showPassword, setShowPassword] = useState(false)

    const handlePasswordVisibility = () => {
        setShowPassword(prev => !prev)
    }

    return (
        <TextField
            {...(validationError && { error: true, helperText: validationError })}
            variant="outlined"
            size="small"
            margin="dense"
            value={value}
            onChange={inputChange}
            name={name}
            label={label}
            type={showPassword ? "text" : "password"}
            InputProps={{
                endAdornment: showPassword ? (
                    <Visibility style={{ cursor: "pointer" }} onClick={handlePasswordVisibility} />
                ) : <VisibilityOff style={{ cursor: "pointer" }} onClick={handlePasswordVisibility} />
            }}
            fullWidth
            {...otherProps}
        />
    )
}
