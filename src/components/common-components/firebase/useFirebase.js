import { useEffect, useState } from "react"

// firebase import
import { db } from './database'

export default function useFirebase(collectionRef) {
    const [value, setValue] = useState([])
    const [loading, setLoading] = useState(false)

    // Fetch Data once the page loads
    useEffect(() => {
        /*  db.collectionGroup(collectionRef).orderBy("timestamp", "desc").get((snapshot => {
            setValue(snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() })))
         })) */
        setLoading(true)
        db.collectionGroup(collectionRef).orderBy("timestamp", "desc").get().then(data => {
            setValue(data.docs.map((doc) => ({ id: doc.id, post: doc.data() })))
            setLoading(false)
        })
    }, [])

    // get items by doc id
    const getItemsByDocId = (docId) => {
        db.collection("posts").doc(docId).collection(collectionRef).get()
            .then(items => items.docs.map(doc => doc.data()))
    }

    // handle add item


    // handle remove item
    const deleteDoc = (docId, user) => {
        db.collection("posts").doc(user.uid).collection(collectionRef).doc(docId).delete().then(value => {
        }).catch(err => alert(err.message))
    }


    // handle edit item


    return { value, deleteDoc, getItemsByDocId, loading }

}
