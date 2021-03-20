// component imports
import { Stepper, Step, StepLabel } from "@material-ui/core"

function StepActions(props) {
    // destructuring props
    const { activeStep, steps } = props

    const stepperProps = {
        activeStep: activeStep,
        variant: "elevation",
        orientation: window.innerWidth < 600 ? "vertical" : "horizontal"
    }

    // map through steps
    const mappedSteps = steps.map(step => (
        <Step key={step}>
            <StepLabel>{step}</StepLabel>
        </Step>
    ))

    return (
        <Stepper {...stepperProps}>
            {mappedSteps}
        </Stepper>
    )
}

export default StepActions
