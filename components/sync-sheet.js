import { LitElement, html } from 'lit-element'
import '../node_modules/vellum-sheet/dist/vellum-sheet.js'
import { initializeApp } from 'firebase/app'
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, getAuth } from 'firebase/auth'

class SyncSheet extends LitElement {

  static get is() { return 'sync-sheet' }

  constructor() {
    super()

    initializeApp({
      apiKey: 'AIzaSyC23ccaZmf-V6Le47vqhfCTaQOG1PN8Ikc',
      authDomain: 'three-meet-sync.firebaseapp.com',
      projectId: 'three-meet-sync'
    })
  }

  connectedCallback() {
    super.connectedCallback()

    const auth = getAuth()
    if (!auth.currentUser) {
      signInWithPopup(auth, new GoogleAuthProvider())
    }
  }

  render() {
    return html`
      <vellum-sheet class="char-sheet">
        <slot></slot>
      </vellum-sheet-field>
    `
  }

}

customElements.define(SyncSheet.is, SyncSheet)
