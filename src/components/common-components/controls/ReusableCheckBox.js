import React from 'react'

// material components
import FormGroup from "@material-ui/core/FormGroup"
import Checkbox from "@material-ui/core/Checkbox"
import FormControlLabel from "@material-ui/core/FormControlLabel"

// icons
import DoneAll from "@material-ui/icons/DoneAll"


export default function ReusableCheckBox(props) {
    const { onChangeHandle, checkValue, label, name, checkedIcon, normalIcon } = props

    return (
        <FormGroup>
            <FormControlLabel
                onChange={onChangeHandle}
                checked={checkValue} label={label}
                control={<Checkbox color="primary" name={name} icon={normalIcon} checkedIcon={checkedIcon} />} />
        </FormGroup>
    )
}
