import { LightningElement } from "lwc";
import { BaseState } from "vlocity_ins/baseState";
import cardActive from "./npProfileContact.html";

export default class cnpProfileContact extends BaseState(LightningElement) {
    render() {
        return cardActive;
    }

    renderedCallback() {
        let cardvisible = this.template.querySelector(".profile-picture");
        if (this.obj.PrimaryContact && this.obj.PrimaryContact.Image) {
            cardvisible.innerHTML = this.obj.PrimaryContact.Image;
        }
        else if (this.obj.PrimaryContact && this.obj.PrimaryContact.PhotoUrl) {
            cardvisible.innerHTML = this.obj.PrimaryContact.PhotoUrl;
        }
        let divImage = cardvisible.querySelector("img");
        if (divImage) {
            divImage.setAttribute("style", "width:128px;border-radius: 100%;");
        }
    }

    get showImage() {
        if (this.obj.PrimaryContact && this.obj.PrimaryContact.PhotoUrl)
            return true;
        else if (this.obj.PrimaryContact && this.obj.PrimaryContact.Image)
            return true;
        else
            return false;
    }

}