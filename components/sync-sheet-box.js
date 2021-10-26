import { LitElement, html, css } from 'lit-element'
import '../node_modules/vellum-sheet/dist/vellum-sheet-box.js'
import { SyncValueBehaviour } from '../lib/sync-value-behaviour.js'

class SyncSheetBox extends SyncValueBehaviour(LitElement) {

  static get is() { return 'sync-sheet-box' }

  static get styles() {
    return css`
      vellum-sheet-box {
        height: 100%;
      }
    `;
  }

  static get properties() {
    return {
      label: {
        type: String
      },
      lines: {
        type: Number
      },
      editable: {
        type: Boolean
      },
      email: {
        type: String
      }
    }
  }

  get value() {
    return this.shadowRoot.querySelector('vellum-sheet-box').value
  }

  set value(value) {
    const inputElement = this.shadowRoot.querySelector('vellum-sheet-box')
    inputElement.value = value
  }

  render() {
    return html`
      <vellum-sheet-box
        label=${this.label}
        editable="${this.editable}"
        class="${this.className}"
        @input=${this.syncValue}
        docid=${this.email}
      ><slot></slot></vellum-sheet-box>`
  }

}

customElements.define(SyncSheetBox.is, SyncSheetBox)
