import { useRef } from "react";
// Material-Ui imports
import { CardContent, makeStyles } from "@material-ui/core";

// component imports
import PostLikes from "../PostLikes";
import AddCommentForm from "../AddCommentForm";
import PostCreatedTime from "../PostCreatedTime";
import PostCommentsCount from "../PostCommentsCount";
import PostSave from "../PostSave";

// style
const useStyles = makeStyles((theme) => ({
	postActionContainer: {
		padding: 0,
	},
	actionsWrapper: {
		padding: "10px 15px 15px 15px",
	},
	postInteractions: {
		display: "flex",
		marginBottom: 10,
		"& > *:not(:first-child)": {
			marginLeft: 15,
		},
	},
}));

function FullscreenPostActions(props) {
	// destructuring classes
	const { postActionContainer, actionsWrapper, postInteractions } = useStyles();

	// Refs
	const addCommentFormInputRef = useRef();

	// destruction props
	const { post, postId, commentsCount } = props;

	// destructuring the post
	const { likedBy, user, timestamp } = post;

	return (
		<CardContent className={postActionContainer}>
			<div className={actionsWrapper}>
				<div className={postInteractions}>
					{/* Post Likes */}
					<PostLikes likedBy={likedBy} user={user} docId={postId} />

					{/* Post Comments */}
					<PostCommentsCount formRef={addCommentFormInputRef} count={commentsCount} />

					{/* Post Save */}
					<PostSave post={post} user={user} docId={postId} />
				</div>

				<PostCreatedTime postTimestamp={timestamp} />
			</div>

			{/* Add a Comments */}
			<AddCommentForm addInputRef={addCommentFormInputRef} user={user} docId={postId} />
		</CardContent>
	);
}

export default FullscreenPostActions;
