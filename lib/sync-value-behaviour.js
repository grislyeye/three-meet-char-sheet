import { getFirestore, collection, getDocs } from "firebase/firestore"
import { getApp } from "firebase/app"

export const SyncValueBehaviour = Base => class extends Base {

  async syncValue(event) {
    console.log(`syncValue(${event})`)
    console.log(getApp())

    const querySnapshot = await getDocs(collection(getFirestore(), "stats"))
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`)
    })
  }

}
