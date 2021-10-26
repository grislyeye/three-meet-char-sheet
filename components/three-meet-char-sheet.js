import { LitElement, html, css } from 'lit-element'
import './sync-sheet.js'
import './sync-sheet-field.js'
import './sync-sheet-box.js'
import '../node_modules/vellum-sheet/dist/vellum-sheet-group.js'

class ThreeMeetCharSheet extends LitElement {

  static get is() { return 'three-meet-char-sheet' }

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
        display: block;
      }

      .character-content {
        width: 100%;
        height: 100%;
        display: grid;
        grid-gap: 1em;
        grid-template-rows: 35% 35% 25%;
        grid-template-columns: 20% auto 45%;
      }

      .character-content > div,
      .character-content > header,
      .character-content > sync-sheet-box {
        margin: 0.5em;
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
      }

      .characteristic sync-sheet-field {
        margin-right: 1em;
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
        margin: 0.5em 1em 0 0;
        text-align: left;
        border: 0;
        font-weight: bold;
        white-space: nowrap;
      }

      .character-content #characteristics > * {
        /*margin-top: 0.5em;*/
        margin: 0.5em;
      }

      .character-content #characteristics .list {
        flex: 1;
      }

      .character-content #characteristics sync-sheet-box {
        min-height: 5.5em;
      }

      .character-content #allegiances {
        margin-right: 0;
        margin-left: 0;
      }

      /* attributes */

      .character-content #abilities {
        grid-column: 1 / 1;
        grid-row:  2 / 2;

        display: flex;
        flex-direction: column;
      }

      .character-content #abilities > .box {
        background: white;
        border: 1px var(--char-sheet-border-color, black) solid;
        font-size: 2em;
        border-radius: 5px;
        text-align: center;
        height: 100%;
      }

      .character-content #abilities > .box + .box {
        margin-top: 0.5em;
      }

      /* combat-stats */

      .character-content #combat-stats {
        display: flex;
        flex-direction: column;

        grid-column: 2 / 2;
        grid-row:  2 / 2;
      }

      .character-content #combat-stats > div {
        height: 100%;
      }

      .character-content #combat-stats > div + div {
        margin-top: 0.5em;
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
        margin-top: 0.2em;
      }

      .value.box + .value.box {
        margin-top: 0.5em;
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

  render() {
    return html`
      <sync-sheet>
        <div class="character-content">

          <div id="characteristics">

            <div class="characteristic">

              <h2>I am</h2>

              <sync-sheet-field label="Title/Character Name" editable="true" email=${this.email} class="small long"></sync-sheet-field>

              <h2>The</h2>

              <sync-sheet-field label="Level/Archetype/Background" editable="true" email=${this.email} class="small long"></sync-sheet-field>

            </div>

            <div class="characteristic">
              <h2>Who</h2>

              <sync-sheet-field label="Bond" editable="true" email=${this.email} class="small long"></sync-sheet-field>

            </div>

            <div class="characteristic">
              <h2>But</h2>

              <sync-sheet-field label="Flaw" editable="true" email=${this.email} class="small long"></sync-sheet-field>
            </div>

            <div id="personality-traits" class="characteristic">
              <h2>I am</h2>

              <sync-sheet-field label="Trait 1" editable="true" email=${this.email} class="small long"></sync-sheet-field>

              <h2>And</h2>

              <sync-sheet-field label="Trait 2" editable="true" email=${this.email} class="small long"></sync-sheet-field>
            </div>

            <vellum-sheet-group id="allegiances" class="characteristic">
              <sync-sheet-field label="Major Allegiance" editable="true" email=${this.email} class="small long"></sync-sheet-field>
              <sync-sheet-field label="Medium Allegiance" editable="true" email=${this.email} class="small long"></sync-sheet-field>
              <sync-sheet-field label="Minor Allegiance" editable="true" email=${this.email} class="small long"></sync-sheet-field>
            </vellum-sheet-group>

          </div>

          <vellum-sheet-group id="abilities">
            <sync-sheet-field label="Might" editable="true" email=${this.email} pattern="^[-+]?[0-9]$" class="box"></sync-sheet-field>
            <sync-sheet-field label="Cunning" editable="true" email=${this.email} class="box"></sync-sheet-field>
            <sync-sheet-field label="Wisdom" editable="true" email=${this.email} class="box"></sync-sheet-field>
          </vellum-sheet-group>

          <vellum-sheet-group id="combat-stats">

            <sync-sheet-field label="Proficiency" editable="true" email=${this.email} class="horizontal value box"></sync-sheet-field>

            <sync-sheet-field label="Health" editable="true" email=${this.email} class="horizontal value box"></sync-sheet-field>

            <sync-sheet-field label="Current Health" editable="true" email=${this.email} class="horizontal value box"></sync-sheet-field>

            <sync-sheet-field label="Defence" editable="true" email=${this.email} class="horizontal value box"></sync-sheet-field>

            <sync-sheet-field label="Melee Damage" editable="true" email=${this.email} class="horizontal value box"></sync-sheet-field>

            <sync-sheet-field label="Ranged Damage" editable="true" email=${this.email} class="horizontal value box"></sync-sheet-field>

          </vellum-sheet-group>

          <sync-sheet-box id="proficiencies" editable="true" email=${this.email} label="Proficiencies">
          </sync-sheet-box>

          <sync-sheet-box id="features" editable="true" email=${this.email} label="Features">
          </sync-sheet-box>

          <sync-sheet-box id="notes" editable="true" email=${this.email} label="Equipment &amp; Notes">
          </sync-sheet-box>

        </div>
      </sync-sheet>
    `
  }

}

customElements.define(ThreeMeetCharSheet.is, ThreeMeetCharSheet)
