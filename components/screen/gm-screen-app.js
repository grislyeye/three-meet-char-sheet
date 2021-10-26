import { LitElement, html, css } from 'lit-element'
import '@kor-ui/kor/components/app-bar';
import '@kor-ui/kor/components/card';
import '@kor-ui/kor/components/page';
import '@kor-ui/kor/components/tabs';
import '@kor-ui/kor/components/text';
import "./gm-screen-sheet-view.js"

class GmScreenApp extends LitElement {

  static get is() { return 'gm-screen-app' }

  render() {
    return html`
      <kor-page id="app">
        <nav slot="top">
          <kor-app-bar label="Three Meet GM Screen">
            <kor-tabs style="width: fit-content;">
              <kor-tab-item label="ricardo@gladwell.me" active>
                <kor-text>ricardo@gladwell.me</kor-text>
              </kor-tab-item>
              <kor-tab-item label="ricardo@gladwell.me">
                <kor-text>ricardo@gladwell.me</kor-text>
              </kor-tab-item>
            </kor-tabs>
          </kor-app-bar>
        </nav>

        <gm-screen-sheet-view sheet="ricardo@gladwell.me"></gm-screen-sheet-view>
      </kor-page>
    `;
  }
}

customElements.define(GmScreenApp.is, GmScreenApp)
