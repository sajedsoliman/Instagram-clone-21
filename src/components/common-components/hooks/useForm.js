import React, { useState } from 'react'


export function useForm(initialValues, validationOnInput = true, validation) {
    const [values, setValues] = useState(initialValues)
    const [validationErrors, setErrors] = useState({})

    // handle inputs change
    const handleInputsChange = (e) => {
        const { value, name, checked } = e.target;

        setValues((prev) => {
            return {
                ...prev, [name]: name == "isPermanent" || name == "isSeasoned" ? checked : value
            }
        })

        if (validationOnInput) {
            validation({ [name]: value }, setErrors)
        }
    }

    // reset form
    const resetForm = (values = initialValues) => {
        setValues(values)
        setErrors({})
    }

    // input common props
    const inputCommonProps = (label, name, value, error) => ({
        label,
        onChange: handleInputsChange,
        value: value,
        name,
        ...(error != undefined && error != "" ? { helperText: error, error: true } : {})
    })

    return {
        values,
        setValues,
        handleInputsChange,
        validationErrors,
        setErrors,
        resetForm,
        inputCommonProps
    }
}

export function Form(props) {
    const { children, ...otherAttributes } = props

    return (
        <form {...otherAttributes}>
            {children}
        </form>
    )
}