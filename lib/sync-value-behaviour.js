import { getFirestore, collection, getDocs, setLogLevel, doc, setDoc } from "firebase/firestore"
import { getApp } from "firebase/app"
import { getAuth } from "firebase/auth"

export const SyncValueBehaviour = Base => class extends Base {

  constructor() {
    super()
    this.db = getFirestore()
  }

  async syncValue(event) {
    if(!this.id) {
      this.id = `vellum-sheet-field-${slugify(this.label)}`
    }

    if (!this.doc) {
      this.email = getAuth().currentUser.email
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
