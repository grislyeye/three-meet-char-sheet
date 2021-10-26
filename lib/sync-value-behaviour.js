import { getFirestore, collection, getDocs, setLogLevel, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore"
import { getApp } from "firebase/app"
import { getAuth, onAuthStateChanged } from "firebase/auth"

export const SyncValueBehaviour = Base => class extends Base {

  constructor() {
    super()
    this.db = getFirestore()
    this.auth = getAuth()
  }

  // TODO Fix: documentId not unique per URI
  get documentId() {
    if (this.email) return this.email
    else return this.auth.currentUser.email
  }

  async connectedCallback() {
    super.connectedCallback()

    if(!this.id) {
      this.id = `vellum-sheet-field-${slugify(this.label)}`
    }

    this.docRef = doc(this.db, "stats", this.documentId)

    onAuthStateChanged(this.auth, async user => {
      this.value = (await getDoc(this.docRef)).get(this.id)

      onSnapshot(this.docRef, (doc) => {
        this.value = doc.get(this.id)
      })
    })
  }

  async syncValue(event) {
    if (!this.doc) {
      this.doc = await doc(collection(this.db, "stats"), this.documentId)
    }

    const patch = {}
    patch[this.id] = this.value
    await setDoc(this.doc, patch, { merge: true })
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
