import { LitElement, html } from 'lit-element'
import '../node_modules/vellum-sheet/dist/vellum-sheet-field.js'
import { SyncValueBehaviour } from '../lib/sync-value-behaviour.js'

class SyncSheetField extends SyncValueBehaviour(LitElement) {

  static get is() { return 'sync-sheet-field' }

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

  constructor() {
    super()
    this.editable = true
  }

  get value() {
    return this.shadowRoot.querySelector('vellum-sheet-field').value
  }

  set value(value) {
    const inputElement = this.shadowRoot.querySelector('vellum-sheet-field')
    inputElement.value = value
  }

  render() {
    return html`
      <vellum-sheet-field
        label=${this.label}
        lines=${this.label}
        .editable=${this.editable}
        class=${this.className}
        @input=${this.syncValue}
        docid=${this.email}
      ><slot></slot></vellum-sheet-field>`
  }

}

customElements.define(SyncSheetField.is, SyncSheetField)
