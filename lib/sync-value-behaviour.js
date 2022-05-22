import { getFirestore, collection, getDocs, setLogLevel, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore"
import { getApp } from "firebase/app"
import { getAuth, onAuthStateChanged } from "firebase/auth"

export const SyncValueBehaviour = Base => class extends Base {

  set sync(sync) {
    if(sync !== true && this.unsubscribe) this.unsubscribe()
    else this.syncValue()
  }

  updated(changedProperties) {
    super.updated(changedProperties)

    if (changedProperties.has('sync')) {
      if(this.sync !== true && this.unsubscribe) {
        this.value = undefined
        this.unsubscribe()
      } else this.syncValue()
    }
  }

  // TODO Fix: documentId not unique per URI
  get documentId() {
    if (this.email) return this.email
    else return getAuth().currentUser.email
  }

  async connectedCallback() {
    super.connectedCallback()

    if(!this.id || this.id.trim() === '') {
      this.id = `vellum-sheet-field-${slugify(this.label)}`
    }

    onAuthStateChanged(getAuth(), async user => {
      if(user !== null) {
        this.db = getFirestore()
        this.unsubscribe = onSnapshot(doc(this.db, "stats", this.documentId), (doc) => {
          const remoteValue = doc.get(this.id)
          if (remoteValue) this.value = remoteValue
        })
      }
    })
  }

  async syncValue() {
    if(this.sync && this.db && this.value) {
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
