import { LightningElement } from "lwc";
import { BaseState } from "vlocity_ins/baseState";
import cardActive from "./npProfile.html";

export default class npProfile extends BaseState(LightningElement) {

    render() {
        return cardActive;
    }

    renderedCallback() {
        let cardvisible = this.template.querySelector(".profile-picture");
        if (this.obj.PrimaryBroker.Image) {
            cardvisible.innerHTML = this.obj.PrimaryBroker.Image;
        }
        else if (this.obj.PrimaryBroker.PhotoUrl) {
            cardvisible.innerHTML = this.obj.PrimaryBroker.PhotoUrl;
        }
        let divImage = cardvisible.querySelector("img");
        if (divImage) {
            divImage.setAttribute("style", "width:128px;border-radius: 100%;");
        }
    }
    get showImage() {
        if (this.obj.PrimaryBroker && this.obj.PrimaryBroker.PhotoUrl)
            return true;
        else if (this.obj.PrimaryBroker && this.obj.PrimaryBroker.Image)
            return true;
        else
            return false;
    }


}