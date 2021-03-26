import { useState } from "react";

// Firebase imports
import { db, auth, storage, firebase, admin } from "./database";

// component imports
import { useAlert } from "../../notification-context/NotificationContext";
import { AuthedUser } from "../../user-context/AuthedUserContext";

// Algolia
import algoliasearch from 'algoliasearch'

const ALGOLIA_INDEX_NAME = 'members';
const client = algoliasearch("CR5WXH0CH1", "a1209f3db13e2a909434e3edb487e3b9");
const index = client.initIndex(ALGOLIA_INDEX_NAME)

index.setSettings({ searchableAttributes: ["username", "fullName"], exactOnSingleWordQuery: false })

function Store() {
    // For notification
    const processSettings = useAlert()
    const loggedUser = AuthedUser()

    // State vars
    const [loading, setLoading] = useState(false)
    const [posts, setPosts] = useState([])

    // get all posts - if there ain't no a logged user
    const getAllPosts = (setPosts) => {
        setLoading(true)
        db.collectionGroup("user_posts")
            .get()
            .then(snapshot => {
                setLoading(false)
                setPosts(snapshot.docs.map(doc => ({ id: doc.id, post: doc.data() })))
            })
    }

    // get followed users posts- if there is a logged user
    const getFollowedPosts = (loggedUserId, setPosts) => {
        setLoading(true)
        // get followed ides
        db.collection("members")
            .doc(loggedUserId)
            .collection("following")
            .get()
            .then(snapshot => {
                // followed id's and with logged user(to show user's on posts)
                const followedIds = [...snapshot.docs.map(doc => doc.id), loggedUserId]

                // fetch followed posts if their id is in the list above
                db.collectionGroup("user_posts")
                    .where("user.id", "in", followedIds)
                    .get()
                    .then(snapshot => {
                        setPosts(snapshot.docs.map(doc => ({ id: doc.id, post: doc.data() })))
                        setLoading(false)
                    })
            })
    }

    // handle sign up user
    const signUpUserWithEmail = async (user, avatarUrl, callback) => {
        // Destructuring the user
        const { email, username, password, fullName } = user

        // Check if the username isExisted or not - await => cuz that's a promise
        const available = Boolean(await isUsernameExisted(username))

        // if the username is vacant (available)
        if (available) {
            // add the user to algolia then take the id and put it in the database
            const createdUser = auth.createUserWithEmailAndPassword(email, password)

            // add to database
            AddUserToDB(user, await (await createdUser).user.uid, avatarUrl)


            // add to algolia
            addToAlgolia(user, avatarUrl)

            // timeout to wait for the user adding to db
            createdUser.then((authUser) => {
                // callback
                callback()

                // stop loading
                setLoading(false)

                // Save info to user profile
                return authUser.user.updateProfile({
                    photoURL: avatarUrl,
                    displayName: fullName
                })
            })
                .catch(err => processSettings("error", err.message))
        }
    }


    // handle add the user to database
    const AddUserToDB = (user, id, avatarUrl) => {
        const { email, username, fullName } = user

        db
            .collection("members")
            .doc(id)
            .set({
                email,
                username,
                fullName,
                bio: "",
                website: "",
                id,
                avatar: avatarUrl,
            })
    }

    // handle add the user to algolia (for search)
    const addToAlgolia = (user, avatar) => {
        const { username, fullName, email } = user

        const algoliaUser = {
            username,
            fullName,
            email,
            avatar: [avatar]
        }
        // index (save) the user into algolia
        index.saveObject(algoliaUser, { autoGenerateObjectIDIfNotExist: true })
    }

    // Check if the username is existed or not
    const isUsernameExisted = (username) => {
        const isAvailable = db
            .collection("members")
            .where("username", "==", username)
            .get()
            .then(user => user.empty ? true : processSettings("error", "username is already existed"))

        return isAvailable
    }

    // Update user
    const updateUser = (id, newValue) => {
        // Check if the user hasn't changed their info to avoid going to the database
        const isChanged = loggedUser == newValue
        if (!isChanged) {
            db.collection("members")
                .doc(id)
                .update({
                    ...newValue
                })
                .then(success => processSettings("success", "User updated."))
                .catch(err => processSettings("error", err.message))
        } else {
            processSettings("warning", "Change something to submit")
        }
    }

    // update password
    const updatePassword = (newPassword) => {
        auth.currentUser
            .updatePassword(newPassword)
            .then(success => processSettings("success", "Password changed."))
            .catch(err => processSettings("error", err.message))
    }

    // Get single post
    const getPost = (creatorId, postId) => {
        return db.collection("posts")
            .doc(creatorId)
            .collection("user_posts")
            .doc(postId)
            .get()
            .then(snapshot => snapshot.data())
    }

    // Get post comments
    const getPostComments = (postId, userId, setComments) => {
        db.collection("posts")
            .doc(userId)
            .collection("user_posts")
            .doc(postId)
            .collection("post_comments")
            .onSnapshot(snapshot => {
                setComments(snapshot.docs.map(doc => ({ ...doc.data() })))
            })
    }


    // get user followers
    const getUserFollowers = (userId, setFollowers) => {
        db
            .collection("members")
            .doc(userId)
            .collection("followers")
            .onSnapshot(snapshot => {
                setFollowers(snapshot.docs.map(doc => ({ ...doc.data() })))
            })
    }

    // get user Following users
    const getFollowing = (userId, setFollowing) => {
        db
            .collection("members")
            .doc(userId)
            .collection("following")
            .onSnapshot(snapshot => {
                setFollowing(snapshot.docs.map(doc => ({ ...doc.data() })))
            })
    }

    // handle unFollow user
    const handleUnFollow = (userId, followerId) => {
        // delete them from my following list
        db
            .collection("members")
            .doc(userId)
            .collection("following")
            .doc(followerId)
            .delete()
        // delete me from their followers list
        db
            .collection("members")
            .doc(followerId)
            .collection("followers")
            .doc(userId)
            .delete()
            .then(success => processSettings("success", "unFollowed"))
            .catch(err => processSettings("error", err.message))
    }

    // handle follow users
    const handleFollow = (authUser, followedUser) => {
        if (authUser != "no user") {
            // add them to your following list
            db
                .collection("members")
                .doc(authUser.id)
                .collection("following")
                .doc(followedUser.id)
                .set({
                    ...followedUser
                    // followed info
                })

            // add you to their followers list
            db
                .collection("members")
                .doc(followedUser.id)
                .collection("followers")
                .doc(authUser.id)
                .set({
                    ...authUser
                    // followed info
                })
                .then(success => processSettings("success", "Followed"))
                .catch(err => processSettings("error", err.message))

        } else processSettings("warning", "Login to follow others")
    }

    // get a certain user's posts
    const getUserPosts = (userId, setPosts) => {
        db
            .collection("posts")
            .doc(userId)
            .collection("user_posts")
            .get()
            .then(snapshot => {
                const posts = snapshot.docs.map(doc => ({ id: doc.id, post: doc.data() }))
                setPosts(posts)
            })
    }

    // Get suggested posts
    const getSuggestedPosts = (userId, activePostId) => {
        db.collection("posts")
            .doc(userId)
            .collection("user_posts")
            .limit(6)
            .get()
            .then(snapshot => {
                const mappedPosts = snapshot.docs.map(doc => ({ id: doc.id, post: doc.data() }))
                setPosts(mappedPosts.filter(doc => doc.id != activePostId))
            })
    }

    // handle delete post
    const deletePost = (postId, userId, successCallback) => {
        db.collection("posts")
            .doc(userId)
            .collection("user_posts")
            .doc(postId)
            .delete()
            .then(success => successCallback())
    }

    // handle get search members
    const getSearchMembers = (searchText, setMembers) => {
        index
            .search(searchText)
            .then(results => {
                setMembers(results.hits)
            })
    }

    // Bring a user chats
    const getUserChats = (authUserId, setChats) => {
        db.collection("members")
            .doc(authUserId)
            .collection("chats")
            .onSnapshot(snapshot => {
                setChats(snapshot.docs.map(doc => ({ chat: doc.data(), id: doc.id })))
            })
    }

    // handle fetching a single chat
    const getChat = (userId, chatId, setChat) => {
        db.collection("members")
            .doc(userId)
            .collection("chats")
            .doc(chatId)
            .onSnapshot(snapshot => {
                if (window.location.pathname != `/direct/inbox/t/${chatId}`) return

                setChat(snapshot.exists ? { ...snapshot.data() } : null)

                if (snapshot.data().lastMsg.id != userId) {
                    const senToUser = snapshot.data().members.find(member => member.id != userId)
                    db.collection("members")
                        .doc(senToUser.id)
                        .collection("chats")
                        .doc(chatId)
                        .update({
                            lastMsgSeen: true
                        })
                }
            })
    }

    // handle putting a listener on a user's chat messages
    const getChatMessages = (userId, chatId, setMessages) => {
        db.collection("members")
            .doc(userId)
            .collection("chats")
            .doc(chatId)
            .collection("messages")
            .orderBy("sendDate", "asc")
            .onSnapshot(snapshot => {
                console.log("Here")
                const messages = snapshot.docs.map(doc => ({ id: doc.id, message: doc.data() }))
                setMessages(messages)
            })
    }

    // handle send a message to both of two members
    const handleSendMessage = (chatId, loggedUserId, senderName, senToId, msgText) => {
        // Send the message first so it arrives faster
        // message object
        const messageObj = {
            senderId: loggedUserId,
            body: msgText,
            sendDate: firebase.firestore.FieldValue.serverTimestamp(),
            sender: senderName
        }

        // handle add the message to loggedUser chat
        // Send the message first
        db
            .collection("members")
            .doc(loggedUserId)
            .collection("chats")
            .doc(chatId)
            .collection("messages")
            .add(messageObj)

        // handle the chat's last msg seen
        db
            .collection("members")
            .doc(loggedUserId)
            .collection("chats")
            .doc(chatId)
            .update({
                lastMsgSeen: false
            })

        // handle add the message to SenTo chat
        db.collection("members")
            .doc(senToId)
            .collection("chats")
            .doc(chatId)
            .get()
            .then(chatDoc => {
                if (chatDoc.data() == undefined) {
                    // Create a new chat to the senTo user
                    createChatForSenToUser(senToId, chatId)

                    // then add the message
                    chatDoc
                        .ref
                        .collection("messages")
                        .add(messageObj)
                } else {
                    // just send the message cuz the user has the chat
                    chatDoc
                        .ref
                        .collection("messages")
                        .add(messageObj)
                }
            })


        // handle update the chat's last message
        // For the logged user
        const lastMsg = {
            id: loggedUserId,
            text: msgText,
            sendDate: firebase.firestore.FieldValue.serverTimestamp()
        }
        db.collection("members")
            .doc(loggedUserId)
            .collection("chats")
            .doc(chatId)
            .update({
                lastMsg: { ...lastMsg }
            })

        // For the senTo user
        db.collection("members")
            .doc(senToId)
            .collection("chats")
            .doc(chatId)
            .update({
                lastMsg: { ...lastMsg }
            })
    }

    // get the senTo user status (active or not)
    const getUserStatus = (userId, setUserStatus) => {
        db.collection("members")
            .doc(userId)
            .get()
            .then(user => {
                setUserStatus(user.data().active)
            })
    }

    // handle chat mute
    const toggleChatMute = (chatId, newValue) => {
        // handle mute the chat just at the user who wanna mute it 
        db.collection("members")
            .doc(loggedUser.uid)
            .collection("chats")
            .doc(chatId)
            .update({
                isMuted: newValue
            })
    }

    // handle delete one-side chat (for just one user (logged user))
    const deleteChat = (chatId) => {
        // Delete the chat messages before delete the parent chat
        db.collection("members")
            .doc(loggedUser.uid)
            .collection("chats")
            .doc(chatId)
            .collection("messages")
            .get()
            .then(snapshot => {
                // Delete all messages - loop cuz we can't delete collections in firebase with code (just manually)
                snapshot.forEach(doc => {
                    doc.ref.delete()
                })

                // then delete the entire chat
                db.collection("members")
                    .doc(loggedUser.uid)
                    .collection("chats")
                    .doc(chatId)
                    .delete()
            })
    }

    // handle create a new chat if one-side of users have chat with the other - for the senToUser
    const createChatForSenToUser = (userId, chatId) => {
        const chatObj = {
            isMuted: false,
            lastMsg: {},
            members: [
                {
                    id: userId,

                },
                {
                    id: loggedUser.uid,
                    username: loggedUser.username,
                    avatar: loggedUser.avatar
                }
            ]
        }

        db.collection("members")
            .doc(userId)
            .collection("chats")
            .doc(chatId)
            .set(chatObj)
    }

    // handle create a new chat if one-side of users have chat with the other
    const createChatForLoggedUser = (senToUser, chatId) => {
        const chatObj = {
            isMuted: false,
            lastMsg: {},
            lastMsgSeen: false,
            members: [
                {
                    id: loggedUser.id,
                },
                {
                    id: senToUser.id,
                    username: senToUser.username,
                    avatar: senToUser.avatar
                }
            ]
        }

        if (chatId == "" || chatId == null) {
            // return the new chat's id
            return db.collection("members")
                .doc(loggedUser.id)
                .collection("chats")
                .add(chatObj)
                .then(chat => chat.id)
        } else {
            db.collection("members")
                .doc(loggedUser.id)
                .collection("chats")
                .doc(chatId)
                .set(chatObj)
            return chatId
        }

    }

    // handle create a new chat when click on message button in the profile or from that dialog if I add it later
    const createChat = (senToUser) => {
        // Check if the logged has a chat with them
        const chatId = db
            .collection("members")
            .doc(loggedUser.uid)
            .collection("chats")
            .where("members", "array-contains", { id: senToUser.id, username: senToUser.username, avatar: senToUser.avatar })
            .get()
            .then(async snapshot => {
                if (snapshot.empty) {
                    // check if they a chat with you to get its id
                    const senToUserChatId = db
                        .collection("members")
                        .doc(senToUser.id)
                        .collection("chats")
                        .where("members", "array-contains",
                            { id: loggedUser.uid, username: loggedUser.username, avatar: loggedUser.avatar })
                        .get()
                        .then(chat => {
                            // Another check => 1.if they have a chat with you get its id and create a new chat for yo
                            if (chat.docs[0]?.id == undefined || !chat.docs[0].exists) {
                                // Create it without that id
                                return ""
                            } else {
                                // return its id
                                return chat.docs[0].id
                            }
                        })

                    // Create a chat for the logged user depend on that id which we got from the code block above
                    return createChatForLoggedUser(senToUser, await senToUserChatId)

                    // return the chat id 
                } else {
                    // i have the chat
                    return snapshot.docs[0].id
                }
            })

        return chatId

        /* // Check if the setTo user has a chat with you
        db
            .collection("members")
            .doc(senToUser.id)
            .collection("chats")
            .where("members", "array-contains",
                { id: loggedUser.uid, username: loggedUser.username, avatar: loggedUser.avatar })
            .get()
            .then(snapshot => console.log(snapshot.empty)) */
    }

    // handle see the user's last msg
    const handleLastMsgSeen = (chatId) => {
        db.collection("members")
            .doc(loggedUser.id)
            .collection("chats")
            .doc(chatId)
            .get()
            .then(snapshot => {
                const senToUser = snapshot.data().members.find(member => member.id != loggedUser.id)

            })
    }

    // handle show (typing...) when the other user is typing
    const handleOtherUserTyping = (chatId, setToUserId, msgText) => {
        db
            .collection("members")
            .doc(setToUserId)
            .collection("chats")
            .doc(chatId)
            .update({
                isTyping: msgText == "" ? false : true
            })
    }

    return {
        posts,
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
        handleLastMsgSeen,
        handleOtherUserTyping,
        loading,
    }
}

export default Store
