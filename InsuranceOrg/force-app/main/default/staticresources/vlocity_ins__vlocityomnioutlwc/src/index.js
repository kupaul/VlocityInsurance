import '@lwc/synthetic-shadow';
import { buildCustomElementConstructor } from 'lwc';
import VlocApp from 'vlocityomniscript/typeExampleSubtypeExampleEnglish';

const availableFeature = detectFeatures();
const isCompatibleBrowser = Object.keys(availableFeature).some(
    feature => !availableFeature[feature]
);

if (isCompatibleBrowser) {
    unsupportedErrorMessage(availableFeature);
} else {
    customElements.define('vlocityomniscript-type-example-subtype-example-english', buildCustomElementConstructor(VlocApp));
}

function detectFeatures() {
    return {
        'Service Worker': 'serviceWorker' in navigator
    };
}

function unsupportedErrorMessage() {
    const { outdated } = window;
    outdated.style.display = 'unset';

    let message = `This browser doesn't support all the required features`;

    message += `<ul>`;
    for (const [name, available] of Object.entries(availableFeature)) {
        message += `<li><b>${name}:<b> ${available ? '✅' : '❌'}</li>`;
    }
    message += `</ul>`;

    // eslint-disable-next-line @lwc/lwc/no-inner-html
    outdated.querySelector('.unsupported_message').innerHTML = message;
}
