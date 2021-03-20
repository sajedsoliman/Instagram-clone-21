// Material-Ui imports
import { Button, IconButton, makeStyles } from '@material-ui/core'


// styles
const useStyles = makeStyles(theme => ({
    containedVariant: {
        backgroundColor: "rgb(0 149 246 / 70%)",

        "&:hover": {
            backgroundColor: "rgb(0 149 246 / 60%)",
        }
    },
    outlinedVariant: {
        borderColor: "rgb(0 149 246 / 80%)",

        "&:hover": {
            borderColor: "rgb(0 149 246 / 60%)",
        }
    },
}))


function CommonButton({ text, variant = "contained", ...otherProps }) {
    const classes = useStyles()

    const classesObject = {
        containedPrimary: classes.containedVariant,
        outlinedPrimary: classes.outlinedVariant
    }

    return (
        <Button
            {...otherProps}
            disableElevation
            size="small"
            variant={variant}
            color="primary"
            classes={classesObject}>{text}</Button>
    )
}

export default CommonButton
