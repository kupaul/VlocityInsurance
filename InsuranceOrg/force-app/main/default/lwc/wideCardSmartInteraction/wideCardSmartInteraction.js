import { LightningElement } from "lwc";
import { BaseState } from "vlocity_ins/baseState";
import cardActive from "./wideCardSmartInteraction.html";
import { fieldTrackingObj, initInteraction } from "vlocity_ins/utility";
import { get } from "vlocity_ins/lodash";

export default class wideCardSmartInteraction extends BaseState(LightningElement) {
  // eslint-disable-next-line consistent-return
  render() {
    return cardActive;
  }

  get firstField() {
    if (this.state && this.state.fields && this.state.fields.length > 0) {
      return this.state.fields[0];
    }
    return [];
  }

  get restField() {
    if (this.state && this.state.fields && this.state.fields.length > 1) {
      let fields = [...this.state.fields];
      return fields.splice(1, this.state.fields.length);
    }
    return [];
  }

  get firstAction() {
    if (this.smartActions && this.smartActions.length > 0) {
      return this.smartActions[0];
    }
    return {};
  }

  get iconObj() {
    let iconObj = {
      hasIcon: false,
      iconClass: "slds-icon_container"
    };
    let iconName = "";
    if (this.firstAction) {
      iconName =
        this.firstAction.iconName && !/^icon-/.test(this.firstAction.iconName)
          ? this.firstAction.iconName.replace("-", ":")
          : this.firstAction.iconName
          ? "standard:default"
          : "";
    }
    if (iconName) {
      iconObj.hasIcon = true;
      iconObj.iconVariant = "default";
      iconObj.iconName = iconName.replace(/_/g, "-");
      let icon = iconName.split(":");
      iconObj.iconClass += ` slds-icon-${icon[0]}-${icon[1]}`;
      if (iconName.indexOf("utility") === -1) {
        iconObj.iconVariant = `inverse`;
      }
    }

    return iconObj;
  }

  get getImageStyle() {
    if (this.session && this.session.height) {
      return `position: relative;width: ${
        this.session.width ? this.session.width : "auto"
      }; height: ${this.session.height};margin: 0 auto; display: block;`;
    }
    return "";
  }

  get isImageAvailable() {
    if (this.session && this.session.img) {
      return true;
    }
    return false;
  }

  get infoDivClass() {
    let classes = `slds-col ${
      this.session && this.session.img
        ? "slds-size_9-of-12"
        : "slds-size_12-of-12"
    }`;
    return classes;
  }

  toggleFlyoutCustom() {
    this.toggleFlyout();
    let modal = this.template.querySelector("vlocity_ins-modal");
    if (modal && !this.hideFlyout) {
      modal.openModal();
    } else if (modal) {
      modal.closeModal();
    }
  }

  trackInteraction(event) {
    let element = event.target;
    if (element.iconName === "utility:check") {
      return;
    }
    element.iconName = "utility:check";
    let fieldIndex = element.dataset.fieldindex
      ? parseInt(element.dataset.fieldindex, 10)
      : element.dataset.fieldindex;
    let field = this.state.fields[fieldIndex + 1];
    let trackingData = new fieldTrackingObj();
    trackingData.EntityName = (this.obj && this.obj.Name) || "";
    trackingData.EntityLabel = field.label;
    trackingData.fieldValue = (this.obj && get(this.obj, field.name)) || "";
    trackingData.CustomerInteractionId =
      (this.obj && this.obj.InteractionId) || "";
    trackingData.CardElement = field.label;
    initInteraction(trackingData, false, "");
  }

  resetIcon(event) {
    let element = event.currentTarget.getElementsByClassName("trackIcon")[0];
    if (element && element.iconName === "utility:check") {
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      window.setTimeout(() => {
        element.iconName = "utility:preview";
      }, 250);
    }
  }

  get isFlyout() {
    return this.state && this.state.flyout && this.state.flyout.lwc;
  }
}