import { LitElement, html, css } from 'lit-element'
import { initializeApp } from 'firebase/app'
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, getAuth, } from 'firebase/auth'
import { collection, onSnapshot, query, getFirestore } from 'firebase/firestore'
import '@kor-ui/kor/components/app-bar';
import '@kor-ui/kor/components/card';
import '@kor-ui/kor/components/page';
import '@kor-ui/kor/components/tabs';
import '@kor-ui/kor/components/text';
import "./gm-screen-sheet-view.js"

class GmScreenApp extends LitElement {

  static get is() { return 'gm-screen-app' }

  static get properties() {
    return {
      sheet: {
        type: String
      },
      sheets: {
        type: Array
      }
    }
  }

  static get styles() {
    return css`
      .hidden {
        display: none;
      }
    `
  }

  constructor() {
    super()

    this.sheets = []

    // TODO Dry: Firebase code also in sync-sheet
    initializeApp({
      apiKey: 'AIzaSyC23ccaZmf-V6Le47vqhfCTaQOG1PN8Ikc',
      authDomain: 'three-meet-sync.firebaseapp.com',
      projectId: 'three-meet-sync'
    })
  }

  async connectedCallback() {
    super.connectedCallback()

    onAuthStateChanged(getAuth(), async user => {
      if (!user) await signInWithPopup(auth, new GoogleAuthProvider())

      onSnapshot(query(collection(getFirestore(), "stats")), (stats) => {
        this.sheets =
          stats
            .docs
            .map((doc) => doc.id)
      })
    })
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
      <kor-page id="app">
        <nav slot="top">
          <kor-app-bar label="Three Meet GM Screen">
            <kor-tabs style="width: fit-content;">
              ${this.renderTabs()}
            </kor-tabs>
          </kor-app-bar>
        </nav>

        ${this.renderSheets()}
      </kor-page>
    `;
  }

  renderTabs() {
    return this.sheets.map(sheet => {
      return html`
        <kor-tab-item label="${sheet}" @click="${this.changeSheet}">
          <kor-text>${sheet}</kor-text>
        </kor-tab-item>
      `
    })
  }

  renderSheets() {
    return this.sheets.map(sheet => {
      return html`
        <gm-screen-sheet-view class=${this.sheet === sheet ? '' : 'hidden'} email="${sheet}"></gm-screen-sheet-view>
      `
    })
  }

  changeSheet(event) {
    this.sheet = event.target.label
  }

}

customElements.define(GmScreenApp.is, GmScreenApp)
