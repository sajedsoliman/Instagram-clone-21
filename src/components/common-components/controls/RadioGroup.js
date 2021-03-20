import React from 'react'

// material imports
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

// icons
import DoneAll from '@material-ui/icons/DoneAll';


export default function ReusableRadioGroup(props) {
    const { label, value, onChangeHandle, name, items, isRow = true } = props

    return (
        <FormControl fullWidth>
            <FormLabel>{label}</FormLabel>
            <RadioGroup
                onChange={onChangeHandle}
                row={isRow}
                value={value}
                name={name}
            >
                {
                    items.map(({ value, label }) => (
                        <FormControlLabel
                            value={value} label={label}
                            control={<Radio color="primary" checkedIcon={<DoneAll />} />} />
                    ))
                }
            </RadioGroup>
        </FormControl>
    )
}
