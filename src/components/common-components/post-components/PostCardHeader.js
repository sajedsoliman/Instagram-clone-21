import { useState } from "react";
// Router imports
import { Link as RouterLink } from "react-router-dom";

// Material-Ui imports
import { Avatar, CardHeader, IconButton, makeStyles } from "@material-ui/core";

// icons
import MoreVert from "@material-ui/icons/MoreVert";

// components
import CustomPopper from "../ui/CustomPopper";
import UserProfileOverview from "../user-related/UserProfileOverview";

// styles
const useStyles = makeStyles((theme) => ({
	headerTitle: {
		fontWeight: 540,
	},
	profileLink: {
		textDecoration: "none",
		color: theme.palette.common.black,
	},
	avatar: {
		textDecoration: "none",
	},
}));

function PostCardHeader({ creatorInfo, location, handleOpenModal }) {
	const classes = useStyles();
	const { avatar, fullName, username } = creatorInfo;

	// State vars
	// anchor element for the profile overview
	const [overviewProfileAvatarEl, setOverviewProfileAvatarEl] = useState(null);
	const [overviewProfileTitleEl, setOverviewProfileTitleEl] = useState(null);

	// handle reset the profile overview avatar
	const closeProfileOverviewAvatar = () => {
		setOverviewProfileAvatarEl(null);
	};

	// handle add the profile overview avatar
	const showProfileOverviewAvatar = (e) => {
		setOverviewProfileAvatarEl(e.target);
	};

	// handle reset the profile overview username
	const closeProfileOverviewTitle = () => {
		setOverviewProfileTitleEl(null);
	};

	// handle add the profile overview username
	const showProfileOverviewTitle = (e) => {
		setOverviewProfileTitleEl(e.target);
	};

	// props for profile overview popper
	const profileOverviewPopperProps = {
		placement: "bottom-start",
		portal: true,
	};

	// card header props
	const headerProps = {
		avatar: (
			<div onMouseLeave={closeProfileOverviewAvatar}>
				<Avatar
					onMouseOver={showProfileOverviewAvatar}
					className={classes.avatar}
					to={`${username}`}
					component={RouterLink}
					alt={fullName}
					src={avatar}
				>
					{fullName[0]}
				</Avatar>

				{/* User profile Popper */}
				<CustomPopper anchorEl={overviewProfileAvatarEl} {...profileOverviewPopperProps}>
					<UserProfileOverview user={creatorInfo} />
				</CustomPopper>
			</div>
		),
		title: (
			<div onMouseLeave={closeProfileOverviewTitle}>
				<RouterLink
					onMouseOver={showProfileOverviewTitle}
					className={classes.profileLink}
					to={`/${username}`}
				>
					{fullName}
				</RouterLink>

				{/* User profile Popper */}
				<CustomPopper anchorEl={overviewProfileTitleEl} {...profileOverviewPopperProps}>
					<UserProfileOverview user={creatorInfo} />
				</CustomPopper>
			</div>
		),
		classes: {
			title: classes.headerTitle,
		},
		subheader: location,
		action: (
			<IconButton onClick={handleOpenModal} disableTouchRipple>
				<MoreVert fontSize={"small"} />
			</IconButton>
		),
	};

	return <CardHeader {...headerProps} />;
}

export default PostCardHeader;
