import { getFirestore, collection, getDocs, setLogLevel, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore"
import { getApp } from "firebase/app"
import { getAuth, onAuthStateChanged } from "firebase/auth"

export const SyncValueBehaviour = Base => class extends Base {

  // TODO Fix: documentId not unique per URI
  get documentId() {
    if (this.email) return this.email
    else return getAuth().currentUser.email
  }

  async connectedCallback() {
    super.connectedCallback()

    this.db = getFirestore()
    this.auth = getAuth()

    console.log('*')
    console.log(`this.id=${this.id}`)

    if(!this.id || this.id.trim() === '') {
      this.id = `vellum-sheet-field-${slugify(this.label)}`
    }

    console.log(`this.id=${this.id}`)

    onAuthStateChanged(this.auth, async user => {
      onSnapshot(doc(this.db, "stats", this.documentId), (doc) => {
        const remoteValue = doc.get(this.id)
        if (remoteValue) this.value = remoteValue
      })
    })
  }

  async syncValue() {
    const ref = await doc(collection(this.db, "stats"), this.documentId)

    const patch = {}
    patch[this.id] = this.value
    await setDoc(ref, patch, { merge: true })
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
