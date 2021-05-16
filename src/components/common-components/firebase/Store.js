// In this component you will find all functions that deal with firebase (backend), like: get, update, delete records

import { useState } from "react";
import { useHistory, Link as RouterLink } from "react-router-dom";

// Firebase imports
import { db, auth, firebase } from "./database";

// Material-UI
import { Button } from "@material-ui/core";

// Contexts
import { useAlert } from "../../notification-context/NotificationContext";
import { AuthedUser } from "../../user-context/AuthedUserContext";

// notistack imports (for snackbars)
import { useSnackbar } from "notistack";

// Algolia (Search platform. firebase doesn't have search functionality to use regex in searching) - Start
import algoliasearch from "algoliasearch";

const ALGOLIA_INDEX_NAME = "members";
const client = algoliasearch("CR5WXH0CH1", "a1209f3db13e2a909434e3edb487e3b9");
const index = client.initIndex(ALGOLIA_INDEX_NAME);

index.setSettings({
	searchableAttributes: ["username", "fullName"],
	exactOnSingleWordQuery: false,
});
// Algolia - End

function Store() {
	// processSettings is the function that controls the type and the message of an alert
	// and I called it like this because we show alert when perform a certain process (like update, delete, and add)
	const processSettings = useAlert();

	// Get the current logged user
	const loggedUser = AuthedUser();

	// Router
	const history = useHistory();

	// State vars
	const [loading, setLoading] = useState(false);

	// Import notiStack snackBars
	const { enqueueSnackbar } = useSnackbar();

	// send a notification - put it here so I con access it anywhere
	const handleSendNotification = (
		userId,
		text,
		link,
		avatar = loggedUser.avatar,
		variant = "warning"
	) => {
		const alert = {
			text,
			date: firebase.firestore.FieldValue.serverTimestamp(),
			show: false,
			seen: false,
			link,
			notificationorAvatar: avatar,
			variant,
		};

		db.collection("members").doc(userId).collection("notifications").add(alert);
	};

	// get all posts - if there ain't no a logged user
	const getAllPosts = (setPosts) => {
		setLoading(true);
		db.collectionGroup("user_posts")
			.get()
			.then((snapshot) => {
				setLoading(false);
				setPosts(snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() })));
			});
	};

	// handle update user posts details when the user gets changed
	const updateUserPosts = (userId, newValues) => {
		db.collection("posts")
			.doc(userId)
			.collection("user_posts")
			.get()
			.then((snapshot) => {
				snapshot.docs.forEach((doc) => {
					doc.ref.update({
						...newValues,
					});
				});
			});
	};

	// get followed users posts- if there is a logged user
	const getFollowedPosts = (loggedUserId, setPosts) => {
		setLoading(true);
		// get followed ides
		db.collection("members")
			.doc(loggedUserId)
			.collection("following")
			.get()
			.then((snapshot) => {
				// followed id's and with logged user(to show user's on posts)
				const followedIds = [...snapshot.docs.map((doc) => doc.id), loggedUserId];

				// fetch followed posts if their id is in the list above
				db.collectionGroup("user_posts")
					.where("user.id", "in", followedIds)
					.get()
					.then((snapshot) => {
						setPosts(snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() })));
						setLoading(false);
					});
			});
	};

	// Handle signIn the user
	const handleSignIn = async (isEmail, password, loginInput, signInCallback, from) => {
		let finalEmail = loginInput;

		// check if the user wanna login with username
		if (!isEmail) {
			// Check in database if the user exists or not
			finalEmail = db
				.collection("members")
				.where("username", "==", loginInput)
				.get()
				.then((snapshot) => {
					if (snapshot.empty) {
						// the user doesn't exist
						// so pop an alert to tell them
						processSettings("error", "User doesn't exist");
					} else {
						return snapshot.docs[0].data().email;
					}
				});
		}

		auth
			.signInWithEmailAndPassword(await finalEmail, password)
			.then((authedUser) => {
				signInCallback();

				history.replace(from.pathname, { user: true });
			})
			.catch((err) => processSettings("error", err.message));
	};

	// handle sign up user
	const signUpUserWithEmail = async (user, avatarUrl, callback) => {
		// Start loading
		setLoading(true);

		// Destructuring the user
		const { email, username, password, fullName } = user;

		// Check if the username isExisted or not - await => cuz that's a promise
		const available = Boolean(await isUsernameExisted(username));

		// if the username is vacant (available)
		if (available) {
			// add the user to algolia then take the id and put it in the database
			const createdUser = auth.createUserWithEmailAndPassword(email, password);

			// add to database
			const userToDB = {
				email,
				username,
				fullName,
				bio: "",
				website: "",
				id: (await createdUser).user.uid,
				avatar: avatarUrl,
			};
			AddUserToDB(userToDB);

			// add to algolia
			addToAlgolia(user, avatarUrl);

			// timeout to wait for the user adding to db
			createdUser
				.then((authUser) => {
					// callback
					callback();

					// stop loading
					setLoading(false);

					// Save info to user profile
					return authUser.user.updateProfile({
						photoURL: avatarUrl,
						displayName: fullName,
					});
				})
				.catch((err) => processSettings("error", err.message));
		}
	};

	// handle add the user to database
	const AddUserToDB = (user) => {
		db.collection("members")
			.doc(user.id)
			.set({
				...user,
			});
	};

	// handle add the user to algolia (for search)
	const addToAlgolia = (user, avatar) => {
		const { username, fullName, email } = user;

		const algoliaUser = {
			username,
			fullName,
			email,
			avatar: [avatar],
		};
		// index (save) the user into algolia
		index.saveObject(algoliaUser, { autoGenerateObjectIDIfNotExist: true });
	};

	// Check if the username is existed or not
	const isUsernameExisted = (username) => {
		const isAvailable = db
			.collection("members")
			.where("username", "==", username)
			.get()
			.then((user) =>
				user.empty ? true : processSettings("error", "username is already existed")
			);

		return isAvailable;
	};

	// Update the user info at their followers when they get changed
	const updateUserInfoAtFollowers = (newValues) => {
		db.collection("members")
			.doc(loggedUser.uid)
			.collection("followers")
			.get()
			.then((loggedUserFollowers) => {
				loggedUserFollowers.forEach((followerDoc) => {
					const followerId = followerDoc.data().id;
					db.collection("members")
						.doc(followerId)
						.collection("following")
						.where("id", "==", loggedUser.uid)
						.get()
						.then((loggedUserInstanceAtFollower) => {
							loggedUserInstanceAtFollower.docs[0].ref.update(newValues);
						});
				});
			});
	};

	// Update the user info at their followers when they get changed
	const updateUserInfoAtFollowing = (newValues) => {
		db.collection("members")
			.doc(loggedUser.uid)
			.collection("following")
			.get()
			.then((loggedUserFollowings) => {
				loggedUserFollowings.forEach((FollowingDoc) => {
					const FollowingId = FollowingDoc.data().id;
					db.collection("members")
						.doc(FollowingId)
						.collection("followers")
						.where("id", "==", loggedUser.uid)
						.get()
						.then((loggedUserInstanceAtFollowing) => {
							loggedUserInstanceAtFollowing.docs[0].ref.update(newValues);
						});
				});
			});
	};

	// update user algolia info
	const handleUpdateAlgoliaUser = async (avatar, userNew) => {
		// get the objectID from algolia by searching the loggedUser old username
		// then update it. because algolia needs that objectID attr
		const userAlgoliaId = (await index.search(loggedUser.username)).hits[0].objectID;
		index
			.partialUpdateObject(
				{
					...(avatar !== undefined && avatar !== null
						? { avatar: [avatar] }
						: {
								username: userNew.username,
								fullName: userNew.fullName,
						  }),
					objectID: userAlgoliaId,
				},
				{ createIfNotExists: true }
			)
			.catch((error) => processSettings("error", error.message));
	};

	// Update user
	const updateUser = async (userNew) => {
		// Check if the user hasn't changed their info to avoid going to the database
		const isChanged = !(loggedUser == userNew);
		if (!isChanged) return processSettings("warning", "Change something to submit");

		// update the user if anything has changed but we specially need to check for the username
		// availability
		// Check if the username has changed or not
		let isUsernameAvailable;
		if (loggedUser.username != userNew.username) {
			isUsernameAvailable = Boolean(await isUsernameExisted(userNew.username));
		}

		// If the username is available update it or if it didn't change
		if (loggedUser.username == userNew.username || isUsernameAvailable) {
			// update all user posts with new info
			// Check if either username or fullName has changed
			if (userNew.username !== loggedUser.username || userNew.fullName !== loggedUser.fullName) {
				// Update them
				const newUserPostValues = {
					"user.fullName": userNew.fullName,
					"user.username": userNew.username,
				};
				updateUserPosts(loggedUser.id, newUserPostValues);

				// update this user info at their following and followers
				const newUserValues = {
					fullName: userNew.fullName,
					username: userNew.username,
				};
				updateUserInfoAtFollowers(newUserValues);
				updateUserInfoAtFollowing(newUserValues);
			}

			db.collection("members")
				.doc(userNew.id)
				.update({
					...userNew,
				})
				.then((success) => {
					processSettings("success", "User updated.");
				})
				.catch((err) => processSettings("error", err.message));

			// update in algolia
			handleUpdateAlgoliaUser(null, userNew);
		}
	};

	// Get any user
	const getUser = (userId, setUser) => {
		db.collection("members")
			.doc(userId)
			.onSnapshot((snapshot) => {
				setUser(snapshot.data());
			});
	};

	// update password
	const updatePassword = (newPassword) => {
		auth.currentUser
			.updatePassword(newPassword)
			.then((success) => processSettings("success", "Password changed."))
			.catch((err) => processSettings("error", err.message));
	};

	// Get single post
	const getPost = (creatorId, postId) => {
		return db
			.collection("posts")
			.doc(creatorId)
			.collection("user_posts")
			.doc(postId)
			.get()
			.then((snapshot) => snapshot.data());
	};

	// Get post comments
	const getPostComments = (postId, userId, setComments) => {
		db.collection("posts")
			.doc(userId)
			.collection("user_posts")
			.doc(postId)
			.collection("post_comments")
			.onSnapshot((snapshot) => {
				setComments(snapshot.docs.map((doc) => ({ ...doc.data() })));
			});
	};

	// get user followers
	const getUserFollowers = (userId, setFollowers) => {
		db.collection("members")
			.doc(userId)
			.collection("followers")
			.onSnapshot((snapshot) => {
				setFollowers(snapshot.docs.map((doc) => ({ ...doc.data() })));
			});
	};

	// get user Following users
	const getFollowing = (userId, setFollowing) => {
		db.collection("members")
			.doc(userId)
			.collection("following")
			.onSnapshot((snapshot) => {
				setFollowing(snapshot.docs.map((doc) => ({ ...doc.data() })));
			});
	};

	// handle unFollow user
	const handleUnFollow = (userId, followerId) => {
		// delete them from my following list
		db.collection("members").doc(userId).collection("following").doc(followerId).delete();
		// delete me from their followers list
		db.collection("members")
			.doc(followerId)
			.collection("followers")
			.doc(userId)
			.delete()
			.then((success) => processSettings("success", "unFollowed"))
			.catch((err) => processSettings("error", err.message));
	};

	// handle follow users
	const handleFollow = (authUser, followedUser) => {
		if (authUser != "no user") {
			// add them to your following list
			db.collection("members")
				.doc(authUser.id)
				.collection("following")
				.doc(followedUser.id)
				.set({
					...followedUser,
					// followed info
				});

			// add you to their followers list
			db.collection("members")
				.doc(followedUser.id)
				.collection("followers")
				.doc(authUser.id)
				.set({
					...authUser,
					// followed info
				})
				.then((success) => {
					processSettings("success", "Followed");
					const alertText = `${authUser.fullName} has just followed you`;
					const alertLink = `${authUser.username}`;
					handleSendNotification(followedUser.id, alertText, alertLink, authUser.avatar);
				})
				.catch((err) => processSettings("error", err.message));
		} else processSettings("warning", "Login to follow others");
	};

	// get a certain user's posts
	const getUserPosts = (userId, setPosts) => {
		db.collection("posts")
			.doc(userId)
			.collection("user_posts")
			.get()
			.then((snapshot) => {
				const posts = snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }));
				setPosts(posts);
			});
	};

	// Get a user saved posts
	const getUserSavedPosts = (setPosts) => {
		db.collection("members")
			.doc(loggedUser.id)
			.collection("saved_posts")
			.get()
			.then((savedPostsShot) => {
				const posts = savedPostsShot.docs.map((doc) => ({ id: doc.id, post: doc.data() }));
				setPosts(posts);
			});
	};

	// Get suggested posts
	const getSuggestedPosts = (userId, activePostId, setPosts) => {
		db.collection("posts")
			.doc(userId)
			.collection("user_posts")
			.limit(6)
			.get()
			.then((snapshot) => {
				const mappedPosts = snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }));
				setPosts(mappedPosts.filter((doc) => doc.id != activePostId));
			});
	};

	// handle delete post
	const deletePost = (postId, userId, successCallback) => {
		db.collection("posts")
			.doc(userId)
			.collection("user_posts")
			.doc(postId)
			.delete()
			.then((success) => successCallback());
	};

	// handle get search members
	const getSearchMembers = (searchText, setMembers) => {
		index.search(searchText).then((results) => {
			setMembers(results.hits);
		});
	};

	// Bring a user chats
	const getUserChats = (authUserId, setChats) => {
		db.collection("members")
			.doc(authUserId)
			.collection("chats")
			.onSnapshot((snapshot) => {
				setChats(snapshot.docs.map((doc) => ({ chat: doc.data(), id: doc.id })));
			});
	};

	// handle fetching a single chat - just for showing chats, not for general use
	// to handle see the last message
	const getChat = (userId, chatId, setChat) => {
		const unsubscribe = db
			.collection("members")
			.doc(userId)
			.collection("chats")
			.doc(chatId)
			.onSnapshot((snapshot) => {
				setChat(snapshot.exists ? { ...snapshot.data() } : null);

				// handle update the seen status for the logged user
				snapshot.ref.update({
					seen: true,
				});

				const senToUser = snapshot.data().members.find((member) => member.id != userId);
				// handle see the other user message
				db.collection("members")
					.doc(senToUser.id)
					.collection("chats")
					.doc(chatId)
					.get()
					.then((chatDoc) => {
						if (chatDoc.exists) {
							chatDoc.ref.update({
								lastMsgSeen: true,
								inChat: true,
							});
						}
					});
			});

		return unsubscribe;
	};

	// handle putting a listener on a user's chat messages
	const getChatMessages = (userId, chatId, setMessages) => {
		// unsubscribe to stop the listener each time we open another chat
		let unsubscribe = db
			.collection("members")
			.doc(userId)
			.collection("chats")
			.doc(chatId)
			.collection("messages")
			.orderBy("sendDate", "asc")
			.onSnapshot((snapshot) => {
				const messages = snapshot.docs.map((doc) => ({ id: doc.id, message: doc.data() }));
				setMessages(messages);
			});

		return unsubscribe;
	};

	// handle create a new chat if one-side of users have chat with the other - for the senToUser
	const createChatForSenToUser = (userId, chatId, lastMsg) => {
		const chatObj = {
			isMuted: false,
			seen: false,
			isTyping: false,
			lastMsg,
			inChat: false,
			members: [
				{
					id: userId,
				},
				{
					id: loggedUser.uid,
					username: loggedUser.username,
					avatar: loggedUser.avatar,
				},
			],
		};

		db.collection("members").doc(userId).collection("chats").doc(chatId).set(chatObj);
	};

	// handle create a new chat if one-side of users have chat with the other
	const createChatForLoggedUser = (senToUser, chatId) => {
		const chatObj = {
			isMuted: false,
			lastMsg: {},
			lastMsgSeen: false,
			inChat: false,
			members: [
				{
					id: loggedUser.id,
				},
				{
					id: senToUser.id,
					username: senToUser.username,
					avatar: senToUser.avatar,
				},
			],
			seen: false,
		};

		if (chatId == "" || chatId == null) {
			// return the new chat's id
			return db
				.collection("members")
				.doc(loggedUser.id)
				.collection("chats")
				.add(chatObj)
				.then((chat) => chat.id);
		} else {
			db.collection("members").doc(loggedUser.id).collection("chats").doc(chatId).set(chatObj);
			return chatId;
		}
	};

	// handle send a message to both of two members
	const handleSendMessage = (chatId, loggedUserId, senderName, senToId, msgText) => {
		// Send the message first so it arrives faster
		// message object
		const messageObj = {
			senderId: loggedUserId,
			body: msgText,
			sendDate: firebase.firestore.FieldValue.serverTimestamp(),
			sender: senderName,
		};

		// last message object
		const lastMsg = {
			id: loggedUserId,
			text: msgText,
			sendDate: firebase.firestore.FieldValue.serverTimestamp(),
		};

		// handle add the message to loggedUser chat
		// Send the message first
		db.collection("members")
			.doc(loggedUserId)
			.collection("chats")
			.doc(chatId)
			.get()
			.then(async (chatDoc) => {
				const messages = chatDoc.ref.collection("messages");
				const isFirstMessage = messages
					.get()
					.then((messagesShot) => messagesShot.docs.length === 1);
				messages.add(messageObj);

				// console.log(await isFirstMessage);
				// handle send him a notification
				// Check if the other user is already inside of the chat or not
				// because if they inside the chat, there ain't no need to send them
				// a notification
				// Check if the last unseen message was before enough to send them
				// another noti
				// Check if the message and the new message has a gap in time >= 600 seconds(10 mins)
				const isThereEnoughGap =
					new Date().getTime() / 1000 -
					((await isFirstMessage) ? 0 : chatDoc.data().lastMsg.sendDate.seconds >= 60);
				if (chatDoc.exists && !chatDoc.data().inChat && isThereEnoughGap) {
					// If the other user hasn't seen it send them a notification
					handleSendNotification(
						senToId,
						`${loggedUser.fullName} has sent you a message`,
						`direct/inbox/t/${chatId}`
					);
				}
			});

		// handle add the message to SenTo chat
		db.collection("members")
			.doc(senToId)
			.collection("chats")
			.doc(chatId)
			.get()
			.then((chatDoc) => {
				if (chatDoc.data() == undefined) {
					// Create a new chat to the senTo user
					// set the last message when create the chat first time
					// In the function (createChatForSenToUser) the last message was empty
					// but now it doesn't empty
					createChatForSenToUser(senToId, chatId, lastMsg);
				}

				// update lastMsgSeen and seen
				chatDoc.ref.update({
					lastMsg: { ...lastMsg },
					seen: false,
				});

				// then add the message
				chatDoc.ref
					.collection("messages")
					.add(messageObj)
					.then((_) => {});
			});

		// For the logged user
		db.collection("members")
			.doc(loggedUserId)
			.collection("chats")
			.doc(chatId)
			.update({
				lastMsg: { ...lastMsg },
				lastMsgSeen: false,
			});
	};

	// get the senTo user status (active or not)
	const getUserStatus = (userId, setUserStatus) => {
		db.collection("members")
			.doc(userId)
			.get()
			.then((user) => {
				setUserStatus(user.data().active);
			});
	};

	// handle chat mute
	const toggleChatMute = (chatId, newValue) => {
		// handle mute the chat just at the user who wanna mute it
		db.collection("members").doc(loggedUser.uid).collection("chats").doc(chatId).update({
			isMuted: newValue,
		});
	};

	// handle delete one-side chat (for just one user (logged user))
	const deleteChat = (chatId) => {
		// Delete the chat messages before delete the parent chat
		db.collection("members")
			.doc(loggedUser.uid)
			.collection("chats")
			.doc(chatId)
			.collection("messages")
			.get()
			.then((snapshot) => {
				// Delete all messages - loop cuz we can't delete collections in firebase with code (just manually)
				snapshot.forEach((doc) => {
					doc.ref.delete();
				});

				// then delete the entire chat
				db.collection("members").doc(loggedUser.uid).collection("chats").doc(chatId).delete();
			});
	};

	// handle create a new chat when click on message button in the profile or from
	//  that dialog if I add it later
	const createChat = (senToUser) => {
		// Check if the logged has a chat with them
		const chatId = db
			.collection("members")
			.doc(loggedUser.uid)
			.collection("chats")
			.where("members", "array-contains", {
				id: senToUser.id,
				username: senToUser.username,
				avatar: senToUser.avatar,
			})
			.get()
			.then(async (snapshot) => {
				if (snapshot.empty) {
					// check if they a chat with you to get its id
					const senToUserChatId = db
						.collection("members")
						.doc(senToUser.id)
						.collection("chats")
						.where("members", "array-contains", {
							id: loggedUser.uid,
							username: loggedUser.username,
							avatar: loggedUser.avatar,
						})
						.get()
						.then((chat) => {
							// Another check => 1.if they have a chat with you get its id and create a new chat for yo
							if (chat.docs[0]?.id == undefined || !chat.docs[0].exists) {
								// Create it without that id
								return "";
							} else {
								// return its id
								return chat.docs[0].id;
							}
						});

					// Create a chat for the logged user depend on that id which we got from the code block above
					return createChatForLoggedUser(senToUser, await senToUserChatId);

					// return the chat id
				} else {
					// i have the chat
					return snapshot.docs[0].id;
				}
			});

		return chatId;

		/* // Check if the setTo user has a chat with you
        db
            .collection("members")
            .doc(senToUser.id)
            .collection("chats")
            .where("members", "array-contains",
                { id: loggedUser.uid, username: loggedUser.username, avatar: loggedUser.avatar })
            .get()
            .then(snapshot => console.log(snapshot.empty)) */
	};

	/* // handle see the user's last msg
        const handleLastMsgSeen = (chatId) => {
            db.collection("members")
                .doc(loggedUser.id)
                .collection("chats")
                .doc(chatId)
                .get()
                .then(snapshot => {
                    const senToUser = snapshot.data().members.find(member => member.id != loggedUser.id)
                })
        } */

	// handle show (typing...) when the other user is typing
	const handleOtherUserTyping = (chatId, setToUserId, msgText) => {
		db.collection("members")
			.doc(setToUserId)
			.collection("chats")
			.doc(chatId)
			.get()
			.then((chatDoc) => {
				if (chatDoc.exists) {
					chatDoc.ref.update({
						isTyping: msgText == "" ? false : true,
					});
				}
			});
	};

	// Get any chat - just its info
	const handleGetChat = (chatId, userId, setChat) => {
		db.collection("members")
			.doc(userId)
			.collection("chats")
			.doc(chatId)
			// to listen for each chat's changes
			.onSnapshot((snapshot) => {
				setChat(snapshot.data());
			});
	};

	// check if a user is existed in the db or not
	const isUserExisted = (id) => {
		const existed = db
			.collection("members")
			.doc(id)
			.get()
			.then((snapshot) => snapshot.exists);

		return existed;
	};

	// handle add a comment
	const AddComment = (userId, comment, postId, setText, avatar) => {
		db.collection("posts")
			.doc(userId)
			.collection("user_posts")
			.doc(postId)
			.collection("post_comments")
			.add(comment)
			.then((post) => {
				setText("");

				// Send a notification the post's author
				// but if the user has commented to themself don't send it
				if (userId != loggedUser.id) {
					const alertText = `${loggedUser.fullName} put a comment for you`;
					const alertLink = `${userId}/p/${postId}`;
					handleSendNotification(userId, alertText, alertLink, loggedUser.avatar);
				}
			})
			.catch((err) => processSettings("error", err.message));
	};

	// handle send notification to all friends(followers) when lay out a new post
	const handleInformFriendsNewPost = (postId) => {
		db.collection("members")
			.doc(loggedUser.uid)
			.collection("followers")
			.get()
			.then((followers) => {
				followers.forEach((follower) => {
					const { id } = follower.data();
					const alertText = `${loggedUser.fullName} put out a new post`;
					const alertLink = `${loggedUser.id}/p/${postId}`;
					handleSendNotification(id, alertText, alertLink, loggedUser.avatar);
				});
			});
	};

	// handle get all notifications
	const getNotifications = (setNotifications) => {
		db.collection("members")
			.doc(loggedUser.id)
			.collection("notifications")
			.orderBy("date", "desc")
			.onSnapshot((snapshot) => {
				const notifications = snapshot.docs.map((doc) => ({ id: doc.id, body: doc.data() }));
				setNotifications(notifications);
			});
	};

	// handle update seen notification status
	const handleSeenNotification = (id) => {
		db.collection("members").doc(loggedUser.id).collection("notifications").doc(id).update({
			seen: true,
		});
	};

	// handle show notifications if users are active (in the app)
	const handleShowNotifications = () => {
		return db
			.collection("members")
			.doc(loggedUser.uid)
			.collection("notifications")
			.onSnapshot((snapshot) => {
				// Just get the documents that have been changed
				snapshot.docChanges().forEach((change) => {
					// if the change type is that a document has been added
					// show the alert and change its show to true
					if (change.type == "added") {
						const docData = change.doc.data();
						if (!docData.show) {
							const { text, link, variant } = docData;
							enqueueSnackbar(text, {
								anchorOrigin: {
									horizontal: "right",
									vertical: "bottom",
								},
								action: (
									// click on go button will set the seen state to true
									<Button
										to={link}
										onClick={() => handleSeenNotification(change.doc.id)}
										component={RouterLink}
									>
										Go
									</Button>
								),
								variant,
								resumeHideDuration: 1000,
								autoHideDuration: 2500,
							});

							// Update it
							change.doc.ref.update({ show: true });
						}
					}
				});
			});
	};

	// handle get latest user's 3 posts
	const getLatestUserPosts = (userId, postsCount, setLatestPosts) => {
		setLoading(true);
		db.collection("posts")
			.doc(userId)
			.collection("user_posts")
			.orderBy("timestamp", "desc")
			.limit(postsCount)
			.get()
			.then((posts) => {
				setLatestPosts(posts.docs.map((doc) => ({ id: doc.id, post: doc.data() })));
				setLoading(false);
			});
	};

	// handle get logged user suggested users
	const getSuggestedUsers = (setUsers) => {
		// Get the logged user following users
		db.collection("members")
			.doc(loggedUser.id)
			.collection("following")
			.get()
			.then(async (followings) => {
				// Users that I follow (have followed)
				let followedIds = [...followings.docs.map((doc) => doc.data().id)];

				// Fetch following users friends (followers)
				followedIds.forEach(async (id) => {
					let result = db
						.collection("members")
						.doc(id)
						.collection("following")
						.where("id", "not-in", [...followedIds, loggedUser.id])
						.get()
						.then((friends) => {
							const mappedFriends = friends.docs.map((friend) => friend.data());
							setUsers((prev) => {
								// Check if one of the friends is already suggested
								return [
									...prev,
									...mappedFriends.filter((friend) => !followedIds.includes(friend.id)),
								];
							});
							// If suggested someone put them in followedIds list so that avoid suggesting them again
							followedIds.push(...friends.docs.map((friend) => friend.data().id));
						});
				});
			});
	};

	// update user's active state
	const changeUserActiveState = (changeTo) => {
		db.collection("members").doc(loggedUser.uid).update({
			active: changeTo,
		});
	};

	return {
		getUser,
		getSuggestedPosts,
		updateUser,
		updatePassword,
		getPost,
		getUserFollowers,
		handleUnFollow,
		handleFollow,
		getAllPosts,
		getFollowedPosts,
		getUserPosts,
		getFollowing,
		deletePost,
		getSearchMembers,
		signUpUserWithEmail,
		getUserChats,
		setLoading,
		getChat,
		getChatMessages,
		handleSendMessage,
		getUserStatus,
		toggleChatMute,
		createChat,
		deleteChat,
		getPostComments,
		handleOtherUserTyping,
		handleGetChat,
		handleSignIn,
		isUsernameExisted,
		AddUserToDB,
		addToAlgolia,
		isUserExisted,
		handleSendNotification,
		AddComment,
		handleInformFriendsNewPost,
		getNotifications,
		handleSeenNotification,
		handleShowNotifications,
		getLatestUserPosts,
		updateUserPosts,
		handleUpdateAlgoliaUser,
		changeUserActiveState,
		getSuggestedUsers,
		getUserSavedPosts,
		loading,
	};
}

export default Store;
