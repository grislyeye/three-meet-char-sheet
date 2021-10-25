import { getFirestore, collection, getDocs, setLogLevel, doc, setDoc } from "firebase/firestore"
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
      await this.syncValue()
    })
  }

  async syncValue(event) {
    if (!this.doc) {
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
