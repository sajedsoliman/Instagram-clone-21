// Router
import { Link as RouterLink } from 'react-router-dom'

// UI imports
import { Avatar, ListItem, ListItemAvatar, ListItemText, MenuItem } from "@material-ui/core"


function SearchMemberCard({ member, closePopper }) {
    // Destructuring the member
    const { fullName, username, avatar } = member

    return (
        <MenuItem to={`/${username}`} component={RouterLink} onClick={closePopper} button>
            <ListItemAvatar>
                <Avatar src={avatar.join("")}>{fullName[0]}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={username}
                secondary={fullName} />
        </MenuItem>
    )
}

export default SearchMemberCard
