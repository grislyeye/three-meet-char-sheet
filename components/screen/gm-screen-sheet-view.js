import { LitElement, html, css } from 'lit-element'
import '../three-meet-char-sheet.js'

class GmScreenSheetView extends LitElement {

  static get is() { return 'gm-screen-sheet-view' }

  static get properties() {
    return {
      email: {
        type: String
      }
    }
  }

  static get styles() {
    return css`
      :host {
        max-width: 1200px;
        width: 100%;
        margin: 0 auto;
        padding: 16px;
        overflow: scroll;
      }

      #char-sheet {
        background: white;
        font-family: 'Alegreya', serif;

        width: 8.3in;
        height: 11.5in;

        margin-top: 0.5cm;
      }
    `;
  }

  render() {
    return html`
      <div id="view">
        <three-meet-char-sheet id="char-sheet" sync email=${this.email}></three-meet-char-sheet>
      </div>
    `
  }

}

customElements.define(GmScreenSheetView.is, GmScreenSheetView)
