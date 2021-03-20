// Material-UI imports
import { makeStyles, Button } from '@material-ui/core'

// style
const useStyles = makeStyles(theme => ({
    stepperControls: {
        marginTop: 20
    },
    backStepBtn: {
        marginRight: 10
    },
}))

function StepperActions(props) {
    const classes = useStyles()

    // destructuring through props
    const { currentStep, handleSubmit, nextStep, previousStep, stepsLength, progress } = props

    // button common props
    const btnCommonProps = {
        variant: "contained",
    }


    return (
        <div className={classes.stepperControls}>
            <Button
                className={classes.backStepBtn}
                onClick={previousStep}
                {...btnCommonProps}
                disabled={currentStep == 0 || progress > 0}
                color="default">Back</Button>
            <Button
                className={classes.controlBtn}
                {...btnCommonProps}
                disabled={progress > 0}
                onClick={currentStep === (stepsLength - 1) ? handleSubmit : nextStep}
                color="secondary">{currentStep == (stepsLength - 1) ? "Create" : "Next"}</Button>

        </div>
    )
}

export default StepperActions
