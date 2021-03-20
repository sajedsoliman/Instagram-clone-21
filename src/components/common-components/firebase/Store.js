import { useState } from "react";

// Firebase imports
import { db, auth, storage, } from "./database";

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
        const { email, username, password } = user

        // Check if the username isExisted or not
        const available = await isUsernameExisted(username)

        // if the username is vacant (available)
        if (available) {
            const createdUser = auth.createUserWithEmailAndPassword(email, password)

            // Add the user to database before auth them
            AddUserToDB(user, (await createdUser).user.uid, avatarUrl)


            // add the user to algolia
            addToAlgolia(user, avatarUrl)

            // loading before the auth state changes
            setLoading(true)

            // timeout to wait for the user adding to db
            setTimeout(() => {
                createdUser.then(callback)
                    .catch(err => processSettings("error", err.message))
            })
        }
    }

    // handle add the user to database
    const AddUserToDB = (user, id, avatarUrl) => {
        const { email, username, fullName } = user

        db.collection("members")
            .doc(id)
            .set({
                email,
                username,
                fullName,
                bio: "",
                website: "",
                id,
                avatar: avatarUrl
            }).then(_ => {
                setLoading(false)
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
        const isExisted = db.collection("members")
            .where("username", "==", username)
            .get()
            .then(user => user.empty ? true : processSettings("error", "username is already existed"))

        return isExisted
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
    const getPost = (creatorId, postId, setPost) => {
        db.collection("posts")
            .doc(creatorId)
            .collection("user_posts")
            .doc(postId)
            .get()
            .then(snapshot => {
                setPost(snapshot.data())
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
        if (authUser != null) {
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
            .then(success => successCallback)
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
            .get()
            .then(snapshot => {
                setChats(snapshot.docs.map(doc => ({ chat: doc.data(), id: doc.id })))
            })
    }

    // handle fetching a single chat
    const getChat = (userId, chatId, setChat) => {
        db.collection("members")
            .doc(userId)
            .collection("chats")
            .doc(chatId)
            .onSnapshot(snapshot => setChat({ ...snapshot.data() }))
    }

    // handle putting a listener on a user's chat messages
    const getChatMessages = (userId, chatId, setMessages) => {
        db.collection("members")
            .doc(userId)
            .collection("chats")
            .doc(chatId)
            .collection("messages")
            .onSnapshot(snapshot => {
                const messages = snapshot.docs.map(doc => ({ id: doc.id, message: doc.data() }))
                setMessages(messages)
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
        loading,
    }
}

export default Store
