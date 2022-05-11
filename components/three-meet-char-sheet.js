import { LitElement, html, css } from 'lit-element'
import { initializeApp } from 'firebase/app'
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, getAuth, } from 'firebase/auth'
import './sync-sheet-field.js'
import './sync-sheet-box.js'
import '../node_modules/vellum-sheet/dist/vellum-sheet.js'
import '../node_modules/vellum-sheet/dist/vellum-sheet-group.js'

class ThreeMeetCharSheet extends LitElement {

  static get is() { return 'three-meet-char-sheet' }

  static get properties() {
    return {
      email: {
        type: String
      },
      editable: {
        type: Boolean
      }
    }
  }

  static get styles() {
    return css`
      :host {
        display: block;
        width: 8.3in;
        height: 11.5in;
        max-width: 8.3in;
        max-height: 11.5in;
        padding: 8px;
      }

      * {
        box-sizing: border-box;
      }

      .character-content {
        padding: 1em;
        height: 100%;
        width: 100%;
        max-height: 100%;
        max-width: 100%;
        display: grid;
        grid-gap: 1em;
        grid-template-rows: 15% 41% 41%;
        grid-template-columns: 20% auto 45%;
      }

      .character-content > div,
      .character-content > header,
      .character-content > sync-sheet-box {
      }

      .character-content sync-sheet-box ul li {
        margin: 0.5em;
        padding: 0;
      }

      .character-content h1 {
        font-size: 2em;
        padding: 0;
        margin: 0;
        text-align: left;
        border: 0;
      }

      /* .characteristics */

      #characteristics {
        grid-row: 1 / 1;
        grid-column: 1 / 4;
        display: flex;
        flex-direction: column;
      }

      .characteristic {
        display: flex;
        justify-content: flex-end;
        margin: 0.5em;
      }

      .characteristic sync-sheet-field {
        min-width: 150px;
        min-height: 55px;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        font-weight: normal;
      }

      .characteristic sync-sheet-field.long {
        width: 100%;
      }

      .characteristic h2 {
        padding: 0;
        margin: 0.5em 1em 0 1em;
        text-align: left;
        border: 0;
        font-weight: bold;
        white-space: nowrap;
      }

      .character-content #characteristics sync-sheet-box {
        min-height: 5.5em;
      }

      .character-content #allegiances {
        margin: 0;
      }

      .character-content #allegiances sync-sheet-field {
        margin: 8px;
      }

      /* attributes */

      .character-content #abilities {
        grid-column: 1 / 1;
        grid-row:  2 / 2;

        display: flex;
        flex-direction: column;

        padding: 4px;
      }

      .character-content #abilities > .box {
        background: white;
        border: 1px var(--char-sheet-border-color, black) solid;
        font-size: 2em;
        border-radius: 5px;
        text-align: center;
        height: 100%;
        margin: 4px;
      }

      .character-content #abilities > .box + .box {
      }

      /* combat-stats */

      .character-content #combat-stats {
        display: flex;
        flex-direction: column;

        grid-column: 2 / 2;
        grid-row:  2 / 2;

        padding: 4px;
      }

      .character-content #combat-stats .stat.value.box {
        height: 100%;
        margin: 4px;
      }

      /* .value */

      sync-sheet-field.value.box {
        background: white;
        padding: 8px;
        border-radius: 5px;
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        align-content: center;
        --vellum-sheet-input-width: 40%;
        font-size: 1.5em;
      }

      .value.box + .value.box {
      }

      .character-content #proficiencies {
        grid-column: 1 / 3;
        grid-row:  3 / 3;
      }

      .character-content #features {
        grid-column: 3 / 3;
        grid-row:  2 / 2;
      }

      .character-content #notes {
        grid-column: 3 / 4;
        grid-row:  3 / 3;
      }
    `;
  }

  async connectedCallback() {
    super.connectedCallback()

    initializeApp({
      apiKey: 'AIzaSyC23ccaZmf-V6Le47vqhfCTaQOG1PN8Ikc',
      authDomain: 'three-meet-sync.firebaseapp.com',
      projectId: 'three-meet-sync'
    })

    onAuthStateChanged(getAuth(), async user => {
      if (!user) await signInWithPopup(getAuth(), new GoogleAuthProvider())
    })
  }

  render() {
    return html`
      <vellum-sheet class="character-content">

        <div id="characteristics">

          <div class="characteristic">

            <h2>I am</h2>

            ${this.renderField('Title/Character Name', 'small long')}

            <h2>The</h2>

            ${this.renderField('Level/Archetype/Background', 'small long')}

          </div>

          <vellum-sheet-group id="allegiances" class="characteristic">
            ${this.renderField('Major Allegiance', 'small long')}
            ${this.renderField('Medium Allegiance', 'small long')}
            ${this.renderField('Minor Allegiance', 'small long')}
          </vellum-sheet-group>

        </div>

        <vellum-sheet-group id="abilities">

          ${this.renderField('Might', 'box')}

          ${this.renderField('Cunning', 'box')}

          ${this.renderField('Wisdom', 'box')}

        </vellum-sheet-group>

        <vellum-sheet-group id="combat-stats">

          ${this.renderField('Proficiency.', 'horizontal stat value box')}

          ${this.renderField('Stamina', 'horizontal stat value box', 'vellum-sheet-field-health')}

          ${this.renderField('Current Stamina', 'horizontal stat value box', 'vellum-sheet-field-current-health')}

          ${this.renderField('Defence', 'horizontal stat value box')}

          ${this.renderField('Melee Damage', 'horizontal stat value box')}

          ${this.renderField('Ranged Damage', 'horizontal stat value box')}

        </vellum-sheet-group>

        ${this.renderBox('proficiencies', 'Proficiencies')}

        ${this.renderBox('features', 'Features')}

        ${this.renderBox('notes', 'Equipment & Notes')}

      </vellum-sheet>
    `
  }

  renderField(label, classes, id) {
    return html`<sync-sheet-field id=${id ? id : ''} label="${label}" ?editable=${this.editable === true} sync .email=${this.email} class="${classes}"></sync-sheet-field>`
  }

  renderBox(id, label) {
    return html`
      <sync-sheet-box id="${id}" label="${label}" ?editable=${this.editable === true} sync .email=${this.email}></sync-sheet-box>
    `
  }

}

customElements.define(ThreeMeetCharSheet.is, ThreeMeetCharSheet)
