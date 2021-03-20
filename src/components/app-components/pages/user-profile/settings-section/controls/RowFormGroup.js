// Material-UI Imports
import { FormLabel, makeStyles, TextField } from '@material-ui/core'

// component imports
import TwoColumnGrid from '../utilites/TwoColumnGrid'
import Controls from '../../../../../common-components/controls/Controls'


// Styles
const useStyles = makeStyles(theme => ({
    labelWrapper: {

        "& .MuiFormLabel-root": {
            color: "black",
        }
    },
}))

function RowFormGroup({ label, controlProps, password, multi = false }) {
    const classes = useStyles()

    const labelSide = (
        <div className={classes.labelWrapper}>
            <FormLabel>{label}</FormLabel>
        </div>
    )

    const controlSide =
        password ? (
            <Controls.PasswordInput margin={"none"} {...controlProps} />
        ) : (
            <TextField
                {...(multi ? { multiline: true, rows: 10, rowsMax: 2 } : null)}
                variant="outlined"
                fullWidth
                size="small"
                {...controlProps}
            />
        )


    return (
        <TwoColumnGrid
            colOne={labelSide}
            colTwo={controlSide}
        />
    )
}

{/* <Grid item xs={3} className={classes.label}>
<FormLabel>{label}</FormLabel>
</Grid>
<Grid item xs={9}>
    {control}
</Grid> */}
export default RowFormGroup
