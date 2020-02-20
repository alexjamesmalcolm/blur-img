import {
  LitElement,
  html,
  css
} from "https://unpkg.com/lit-element/lit-element.js?module";
import { styleMap } from "https://unpkg.com/lit-html@1.1.2/directives/style-map.js?module";

const isNumber = value => {
  return typeof value === "number" && isFinite(value);
};

const outerStylingKeys = ["width", "height"];
const innerStylingKeys = ["object-fit"];

class MyElement extends LitElement {
  static get styles() {
    return css`
      .container {
        position: relative;
        overflow: hidden;
      }
      .foreground-image {
        position: absolute;
        width: inherit;
        height: inherit;
        object-fit: contain;
      }
      .background-image {
        position: absolute;
        width: inherit;
        height: inherit;
        z-index: -1;
        filter: blur(10px) contrast(0.75);
        transform: scale(1.2);
      }
    `;
  }
  render() {
    const stylingFromParentDom = Object.fromEntries(
      Object.entries(
        JSON.parse(JSON.stringify(window.getComputedStyle(this)))
      ).filter(([key, value]) => !isNumber(Number(key)))
    );
    const outerStyling = Object.fromEntries(
      Object.entries(stylingFromParentDom).filter(([key, value]) =>
        outerStylingKeys.includes(key)
      )
    );
    const innerStyling = Object.fromEntries(
      Object.entries(stylingFromParentDom).filter(([key, value]) =>
        innerStylingKeys.includes(key)
      )
    );
    const otherStyling = Object.fromEntries(
      Object.entries(stylingFromParentDom).filter(
        ([key, value]) =>
          !innerStylingKeys.includes(key) && !outerStylingKeys.includes(key)
      )
    );
    return html`
      <div class="container" style=${styleMap(outerStyling)}>
        <img
          src=${this.attributes.src ? this.attributes.src.value : ""}
          class="foreground-image"
          style=${styleMap(innerStyling)}
        />
        <img
          src=${this.attributes.src ? this.attributes.src.value : ""}
          class="background-image"
        />
      </div>
    `;
  }
}

customElements.define("blur-img", MyElement);
