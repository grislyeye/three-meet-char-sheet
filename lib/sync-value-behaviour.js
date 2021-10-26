import { getFirestore, collection, getDocs, setLogLevel, doc, setDoc, onSnapshot } from "firebase/firestore"
import { getApp } from "firebase/app"
import { getAuth, onAuthStateChanged } from "firebase/auth"

export const SyncValueBehaviour = Base => class extends Base {

  constructor() {
    super()
    this.db = getFirestore()
    this.auth = getAuth()
  }

  async connectedCallback() {
    super.connectedCallback()

    if(!this.id) {
      this.id = `vellum-sheet-field-${slugify(this.label)}`
    }

    onAuthStateChanged(this.auth, async user => {
      // TODO Fix: makes too many calls
      await this.syncValue()

      onSnapshot(doc(this.db, "stats", this.email), (doc) => {
        this.value = doc.get(this.id)
      })
    })
  }

  async syncValue(event) {
    if (!this.doc) {
      // TODO Fix: email not unique per URI
      this.email = this.auth.currentUser.email
      this.doc = await doc(collection(this.db, "stats"), this.email)
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
