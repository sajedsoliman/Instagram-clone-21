// Material-UI Imports
import { Grid } from '@material-ui/core'


function TwoColumnGrid({ colOne, colTwo }) {
    return (
        <Grid container style={{ marginBottom: 25 }}>
            <Grid item xs={12} sm={4}>
                {colOne}
            </Grid>
            <Grid item xs={12} sm={8}>
                {colTwo}
            </Grid>
        </Grid>
    )
}

export default TwoColumnGrid
