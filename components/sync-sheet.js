import { LitElement, html, css } from 'lit-element'
import '../node_modules/vellum-sheet/dist/vellum-sheet.js'
import { initializeApp } from 'firebase/app'
import { onAuthStateChanged, signInWithPopup, signInWithCredential, GoogleAuthProvider, getAuth, OAuthCredential } from 'firebase/auth'

class SyncSheet extends LitElement {

  static get is() { return 'sync-sheet' }

  static get styles() {
    return css`
      :host {
        display: block;
      }
    `;
  }

  constructor() {
    super()

    initializeApp({
      apiKey: 'AIzaSyC23ccaZmf-V6Le47vqhfCTaQOG1PN8Ikc',
      authDomain: 'three-meet-sync.firebaseapp.com',
      projectId: 'three-meet-sync'
    })
  }

  async connectedCallback() {
    super.connectedCallback()

    const auth = getAuth()
    const credential = this.credential

    if (credential) {
      // TODO Fix: cannot re-authenticate when oauth credentials expire
      await signInWithCredential(auth, credential)
    } else if (!auth.currentUser) {
      await signInWithPopup(auth, new GoogleAuthProvider())
        .then(result => {
          this.credential = GoogleAuthProvider.credentialFromResult(result)
        })
    }
  }

  set credential(credential) {
    const json = JSON.stringify(credential.toJSON())
    document.cookie = `google-credential=${json}; Secure`
  }

  get credential() {
    const cookie =
      document.cookie
        .split('; ')
        .find(row => row.startsWith('google-credential='))

    if (cookie) {
      return OAuthCredential.fromJSON(cookie.split('=')[1])
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
