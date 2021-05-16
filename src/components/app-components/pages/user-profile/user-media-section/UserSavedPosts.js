import { useEffect, useState } from "react";

// Material-Ui imports
import { Grid } from "@material-ui/core";

// component imports
import UserPost from "../../../../common-components/post-components/UserPost";
import Store from "../../../../common-components/firebase/Store";

//aasdasadasd

function UserSavedPosts(props) {
	// destructing through props
	const { userId } = props;

	// State variables
	const [posts, setPosts] = useState([]);

	// import Store (firebase) functions
	const { getUserSavedPosts } = Store();

	// get userPosts count from database
	useEffect(() => {
		getUserSavedPosts(setPosts);
	}, [userId]);

	// map through posts
	const mappedPosts = posts.map((pst) => {
		const { id, post } = pst;
		return <UserPost key={id} userId={post.user.id} post={post} id={id} />;
	});

	return (
		<Grid container spacing={2}>
			{mappedPosts}
		</Grid>
	);
}

export default UserSavedPosts;
