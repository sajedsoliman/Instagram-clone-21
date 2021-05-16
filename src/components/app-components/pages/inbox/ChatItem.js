import { useEffect, useState } from "react";

// Router
import { Link as RouterLink } from "react-router-dom";

// UI imports
import {
	Avatar,
	Badge,
	ListItem,
	ListItemAvatar,
	ListItemText,
	makeStyles,
} from "@material-ui/core";

// Icons
import { FiberManualRecord, Favorite } from "@material-ui/icons";

// Utilities
import clsx from "clsx";

// Component imports
import Store from "../../../common-components/firebase/Store";

// style staff
const useStyles = makeStyles((theme) => ({
	dotBadge: {
		backgroundColor: "#44b700",
		color: "#44b700",
		boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
	},
	chatAdditionalInfoTypo: {
		"&.not-seen": {
			fontWeight: "bold",
		},

		"& > span": {
			display: "flex",
			alignItems: "center",
			flexWrap: "nowrap",

			"& .text": {
				display: "flex",
				alignItems: "center",
				textOverflow: "ellipsis",
				overflow: "hidden",
				whiteSpace: "nowrap",
			},

			"& .MuiSvgIcon-root": {
				fontSize: ".35rem",
				margin: "0 5px",
			},
		},
	},
	likeIcon: {
		fontSize: "15px !important",
		margin: "0 !important",
	},
}));

// toggleDetailsHandler => to pass it to active chat when render it alone (in mobiles)
function ChatItem({ chat, authUserId, chatDocId }) {
	const classes = useStyles();

	// destructuring the chat
	const { lastMsg, members, seen } = chat;

	// Router

	// Get some info
	const senToMember = members.find((member) => member.id != authUserId);

	// State vars
	const [isUserActive, setIsUserActive] = useState(false);

	// Import Store component to get the setTo user status
	const { getUserStatus } = Store();

	// get senTo user status
	useEffect(() => {
		getUserStatus(senToMember.id, setIsUserActive);
	}, []);

	// avatar badge props
	const badgeProps = {
		className: classes.badge,
		variant: "dot",
		overlap: "circle",
		anchorOrigin: {
			vertical: "bottom",
			horizontal: "right",
		},
		classes: { badge: classes.dotBadge },
		invisible: !isUserActive,
	};

	// handle getting the chat additional info (user the chat's username) (usually being the lastMsg but not always)
	const handleChatAdditionalInfo = () => {
		const { id, text, sendDate } = lastMsg;

		// Check if the message is like
		const renderedMessage =
			text === "/like-reserved" ? (
				<Favorite className={classes.likeIcon} color="secondary" />
			) : (
				text
			);

		// check if you own the last message
		const res = (
			<span>
				<span className={clsx("text")}>{renderedMessage}</span>{" "}
				{lastMsg.id == authUserId && (
					<>
						<FiberManualRecord fontSize="small" /> You
					</>
				)}
			</span>
		);

		return res;
	};

	return (
		<ListItem
			// Close details up when click on item
			button
			to={{
				pathname: `/direct/inbox/t/${chatDocId}`,
				...(window.innerWidth < 960
					? {
							state: {
								mobile: true,
							},
					  }
					: {}),
			}}
			component={RouterLink}
		>
			<ListItemAvatar>
				<Badge {...badgeProps}>
					<Avatar src={senToMember.avatar} />
				</Badge>
			</ListItemAvatar>

			{/* To edited with an advanced algorithm */}
			<ListItemText
				primary={senToMember.username}
				secondaryTypographyProps={{
					className: clsx(classes.chatAdditionalInfoTypo, { "not-seen": !seen }),
				}}
				secondary={handleChatAdditionalInfo()}
			/>
		</ListItem>
	);
}

export default ChatItem;
