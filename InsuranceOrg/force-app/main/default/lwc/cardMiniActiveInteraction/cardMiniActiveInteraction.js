import { LightningElement } from "lwc";
import { BaseState } from "vlocity_ins/baseState";
import sldsTemplate from "./cardMiniActiveInteraction.html";

export default class cardMiniActiveInteraction extends BaseState(LightningElement) {
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

  get smartActionObj() {
    if (this.session.isSmartAction && this.obj) {
      return this.modifySmartAction([this.obj])[0];
    }
    return {};
  }

  get leftIconObj() {
    return this.getIconObj({ iconName: this.session.leftIcon });
  }

  get rightIconObj() {
    return this.getIconObj({ iconName: this.session.rightIcon });
  }

  getIconObj(icon) {
    let iconObj = {
      hasIcon: false,
      iconClass: "slds-icon_container"
    };
    let iconName = "";
    if (icon.iconName) {
      iconName =
        icon.iconName && !/^icon-/.test(icon.iconName)
          ? icon.iconName.replace("-", ":")
          : icon.iconName
          ? "standard:default"
          : "";
    }
    if (iconName) {
      iconObj.hasIcon = true;
      iconObj.iconVariant = "default";
      iconObj.iconName = iconName.replace(/_/g, "-");
      let iconSplit = iconName.split(":");
      iconObj.iconClass += ` slds-icon-${iconSplit[0]}-${iconSplit[1]}`;
      if (iconName.indexOf("utility") === -1) {
        iconObj.iconVariant = `inverse`;
      }
    }

    return iconObj;
  }

  get leftImageFromAttachment() {
    if (this.obj && this.obj.attachment) {
      let name = Object.keys(this.obj.attachment)[0];
      return (
        window.location.origin +
        "/servlet/servlet.FileDownload?file=" +
        this.obj.attachment[name]
      );
    }
    return "";
  }

  // eslint-disable-next-line consistent-return
  render() {
    return sldsTemplate;
  }
}