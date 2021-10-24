import { getFirestore, collection, getDocs } from "firebase/firestore"

export const SyncValueBehaviour = Base => class extends Base {

  async syncValue(event) {
    console.log(`syncValue(${event})`)

    const querySnapshot = await getDocs(collection(getFirestore(), "stats"))
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`)
    })
  }

}
