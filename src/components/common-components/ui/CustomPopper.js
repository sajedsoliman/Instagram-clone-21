import React, { useState } from "react";

// Material-UI imports
import { Fade, makeStyles, Popper } from "@material-ui/core";
// Icons
import {} from "@material-ui/icons";

// Contexts

// Hooks

// Components
import { usePopper } from "react-popper";

// Styles
import clsx from "clsx";
const useStyles = makeStyles((theme) => ({
	popper: {
		"&[x-placement*=top] .arrow": {
			bottom: -5,
			top: "auto",
		},
		"&[x-placement*=right] .arrow": {
			bottom: -5,
			top: "auto",
		},
	},
	wrapper: {
		padding: 20,
	},
	btn: {
		marginTop: 350,
		marginLeft: 200,
	},
	arrow: {
		background: "white" /* rgb(224 224 224) */,
		width: 10,
		height: 10,
		transform: "rotateZ(45deg)",
		top: -4,
		left: -4,
	},
}));

export default function CustomPopper({ anchorEl, placement, children, withArrow = false }) {
	const classes = useStyles();

	const [arrowEl, setArrowEl] = useState(null);

	const { styles } = usePopper();

	return (
		<>
			<Popper
				className={classes.popper}
				modifiers={{
					arrow: {
						enabled: withArrow,
						element: arrowEl,
					},
				}}
				placement={placement}
				open={Boolean(anchorEl)}
				anchorEl={anchorEl}
				transition={true}
			>
				<Fade in={Boolean(anchorEl)}>
					<>
						{children}
						<span
							ref={setArrowEl}
							className={clsx(classes.arrow, "arrow")}
							style={{ ...styles.arrow }}
						></span>
					</>
				</Fade>
			</Popper>
		</>
	);
}
