import { getFirestore, collection, getDocs, setLogLevel, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore"
import { getApp } from "firebase/app"
import { getAuth, onAuthStateChanged } from "firebase/auth"

export const SyncValueBehaviour = Base => class extends Base {


  // TODO Fix: documentId not unique per URI
  get documentId() {
    console.log(this.email === "undefined")
    console.log(getAuth().currentUser)
    if (this.email) return this.email
    else return getAuth().currentUser.email
  }

  async connectedCallback() {
    super.connectedCallback()

    if(this.editable) {
      this.db = getFirestore()
      this.auth = getAuth()

      if(!this.id) {
        this.id = `vellum-sheet-field-${slugify(this.label)}`
      }

      onAuthStateChanged(this.auth, async user => {
        console.log(this.documentId)
        this.value = (await getDoc(doc(this.db, "stats", this.documentId))).get(this.id)

        onSnapshot(doc(this.db, "stats", this.documentId), (doc) => {
          this.value = doc.get(this.id)
        })
      })
    }
  }

  async syncValue(event) {
    if(this.editable) {
      const ref = await doc(collection(this.db, "stats"), this.documentId)

      const patch = {}
      patch[this.id] = this.value
      await setDoc(ref, patch, { merge: true })
    }
  }

}

// TODO DRY: duplication in StoreValueBehaviour
const slugify = text =>
  text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
