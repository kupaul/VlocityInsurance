import ${lwc_name} from "c/${lwc_name}";
import { createElement, buildCustomElementConstructor } from "lwc";

const useNativeShadow = LWC_USE_NATIVE_SHADOW === 'enabled';
const useCustomElementRegistry = LWC_CUSTOM_ELEMENT_REGISTRY === 'enabled';
const fullWebComponent = useNativeShadow && useCustomElementRegistry;

if (useCustomElementRegistry) {
  customElements.define('c-${lwc_name}', buildCustomElementConstructor(${lwc_name}));
}

const element = fullWebComponent
  ? document.createElement("c-${lwc_name}")
  : createElement("c-${lwc_name}", { is: ${lwc_name}, fallback: !useNativeShadow });


const container = document.body;
container.appendChild(element);