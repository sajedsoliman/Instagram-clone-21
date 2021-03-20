// material-ui imports
import { TextField, InputAdornment, makeStyles } from '@material-ui/core'
import Search from '@material-ui/icons/Search';


// styles
const useStyles = makeStyles((theme) => ({
    searchInput: {
        "& .MuiInputBase-root.Mui-focused": {

            "& input": {
                width: 230
            }
        },

        "& .MuiOutlinedInput-inputMarginDense": {
            width: 200,
            paddingTop: "7.5px",
            paddingBottom: "7.5px",
            transition: theme.transitions.create("width", { duration: 250 })
        }
    },
}))

export default function SearchBox(props) {
    const { value, handleChange, inputRef } = props
    const classes = useStyles()

    // component prop objects
    const inputProps = {
        onChange: handleChange, value, ref: inputRef,
        className: classes.searchInput, variant: "outlined", size: "small", InputProps: { startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }, label: "Search"
    }

    return (
        <TextField  {...inputProps} />
    )
}
