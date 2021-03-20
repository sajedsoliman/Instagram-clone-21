import { useEffect, useState } from "react"

// component imports
import PostCard from "./PostCard"
import PostCardSkeleton from "../skeletons/PostCardSkeleton"
import Store from "../../common-components/firebase/Store"


export default function Posts({ loggedUser }) {

    // State vars
    const [posts, setPosts] = useState([])

    useEffect(() => {
        if (loggedUser) {
            getFollowedPosts(loggedUser.uid, setPosts)
        } else {
            getAllPosts(setPosts)
        }
    }, [loggedUser])

    // import Store functions
    const { getAllPosts, getFollowedPosts, loading } = Store()

    const mappedPosts = posts.map(pst => {
        const { id, post } = pst

        return (
            <PostCard key={id.toString()} post={post} docId={id} />
        )
    })

    return (
        <div>
            {
                loading ? <PostCardSkeleton /> : mappedPosts
            }
        </div>
    )
}
