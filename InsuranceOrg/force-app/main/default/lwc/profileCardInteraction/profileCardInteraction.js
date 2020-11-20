import { LightningElement, track } from 'lwc';

import util from "vlocity_ins/utility";
import { BaseState } from "vlocity_ins/baseState";
import sldsTemplate from "./profileCardInteraction_slds.html";
import ndsTemplate from "./profileCardInteraction_nds.html";

let idGenerator = 0;
export default class profileCardInteraction extends BaseState(LightningElement) {
    @track userName = "";
    @track iconurl = "";
    @track activityContent = [];
    @track profileTags = [];
    @track userInfo = "";
    @track userState = "";
    @track rowActions = [];
    @track menuActions = [];
    @track actionIconOnly = false;
    @track badgeColor;
    @track displayBadge = false;
    @track profileTagsToShow = [];
    @track extraProfileTags = [];
    currentTime = "";
    iconClass = "";
    nsPrefix = "";
    coloredTags = [];


    // eslint-disable-next-line consistent-return
    render() {
        if (this.theme === "nds") {
            return ndsTemplate;
        }
        return sldsTemplate;
    }

    get getProfilePic() {
        let url =
            "https://2ab9pu2w8o9xpg6w26xnz04d-wpengine.netdna-ssl.com/wp-content/uploads/staticmaps/o/2412429-osso-dtla/osso-dtla-map-large.png";
        if (this.session && this.session.APIKEY) {
            url = `https://maps.googleapis.com/maps/api/staticmap?center=${
                this.session.location ? this.session.location : "Vlocity"
                }&zoom=14&size=600x400&key=${this.session.APIKEY}`;
        }
        return `background-image:url("${encodeURI(url)}")`;
    }
    get url() {
        let url = `https://maps.googleapis.com/maps/api/staticmap?center=${
            this.session.location ? this.session.location : "Vlocity"
            }&zoom=14&size=600x400&key=${this.session.APIKEY}`;
        return url;
    }

    connectedCallback() {
        this.theme = this.theme ? this.theme : "slds";
        this.nsPrefix = util.namespace;
        this.iconClass = `${this.theme}-icon_selected ${this.theme}-icon-text-default ${this.theme}-p-around_xx-small ${this.theme}-icon_container `;
    }

    renderedCallback() {
        super.renderedCallback();
        if (this.obj && !this.isFirstRender) {
            if (this.obj.Id) {
                this.isFirstRender = true;
                // eslint-disable-next-line array-callback-return
                this.setProfileAttrs()
                    .then(() => {
                        if (this.coloredTags) {
                            // eslint-disable-next-line array-callback-return
                            this.coloredTags.map(name => {
                                // eslint-disable-next-line @lwc/lwc/no-async-operation
                                setTimeout(() => {
                                    let tag = this.template.querySelector("." + name);
                                    if (tag) {
                                        tag.firstChild.style.backgroundColor = tag.dataset.color;
                                        tag.firstChild.style.color = "#ffffff";
                                    }
                                }, 0);
                            });
                        }
                    })
                    .catch(e => {
                        console.error(e);
                    });
            }
            this.userName = this.obj.Name;

            this.userStreet = this.obj.BillingAddress
                ? this.obj.BillingAddress.street
                : "";

            this.userCity = this.obj.BillingAddress
                ? this.obj.BillingAddress.city
                : "";

            this.userState = this.obj.BillingAddress
                ? this.obj.BillingAddress.state
                : "";

            this.userCountry = this.obj.BillingAddress
                ? this.obj.BillingAddress.country
                : "";

            this.currentTime = new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            });

            this.userInfo = this.userState
                ? `${this.userStreet} ${this.userCity} ${this.userState} (${this.currentTime})`
                : "";
        }
        if (this.session && !this.isSessionRendered) {
            this.isSessionRendered = true;
            this.displayBadge =
                this.session.showBadge && this.session.showBadge !== "false"
                    ? true
                    : false;
            if (this.displayBadge) {
                let customerValue = this.obj[this.nsPrefix + "CustomerValue__c"]
                    ? this.obj[this.nsPrefix + "CustomerValue__c"].toLowerCase()
                    : "";
                switch (customerValue) {
                    case "diamond":
                        this.badgeColor = "#b9f2ff";
                        break;
                    case "platinum":
                        this.badgeColor = "#e5e4e2";
                        break;
                    case "gold":
                        this.badgeColor = "#ffd700";
                        break;
                    case "silver":
                        this.badgeColor = "#aaa9ad";
                        break;
                    default:
                        this.badgeColor = "#cd7f32";
                }
            }
        }
        if (this.actions && this.actions.length && !this.isRendered) {
            this.isRendered = true;
            this.actionIconOnly =
                this.session.showActionLabel && this.session.showActionLabel !== "false"
                    ? false
                    : true;
            this.actionInaRow =
                this.actions && this.actions.length > 3 ? 3 : this.actions.length;
            for (let i = 0; i < this.actionInaRow; i++) {
                this.rowActions.push(this.actions[i]);
            }
            for (let i = this.actionInaRow; i < this.actions.length; i++) {
                let action = Object.assign({}, this.actions[i], {
                    label: this.actions[i].displayName || this.actions[i].id
                });
                this.menuActions.push(action);
            }
        }
    }

    setProfileAttrs() {
        return new Promise((resolve, reject) => {
            let userAttr = JSON.parse(
                sessionStorage.getItem("vlocity.profileAttribites")
            );
            if (!userAttr || !userAttr[this.obj.Id]) {
                let objId = JSON.stringify(this.obj.Id);
                let getAttributeQuery = {
                    type: "apexremote",
                    value: {
                        className: "ProfileClientAttributeController",
                        methodName: "getAttributeCategories",
                        remoteNSPrefix: "vlocityins2",
                        vlocityAsync: true,
                        inputMap: '{ "entityId" : "' + this.obj.Id + '"}',
                        optionsMap: '{}'
                    }
                };
                let requestData = JSON.stringify(getAttributeQuery);
                util.getDataHandler(requestData).then(category => {
                    let categoryIndexArr = [];
                    category = JSON.parse(category);
                    category = category && category.result ? category.result : [];
                    // eslint-disable-next-line array-callback-return
                    category.map((catVal, catIndex) => {
                        let catCode = catVal[this.nsPrefix + "Code__c"];
                        catCode = catCode ? JSON.stringify(catCode) : "";
                        let getAppliedAttributes = {
                            type: "apexremote",
                            value: {
                                className: "ProfileClientAttributeController",
                                methodName: "getAppliedAttributes",
                                remoteNSPrefix: "vlocityins2",
                                vlocityAsync: true,
                                inputMap: `{ "clientId" : ${objId} , "categoryCode" : ${catCode} }`,
                                optionsMap: "{}"
                            }
                        };
                        let requestData1 = JSON.stringify(getAppliedAttributes);
                        util.getDataHandler(requestData1).then(profileAttr => {
                            profileAttr = JSON.parse(profileAttr);
                            profileAttr =
                                profileAttr && profileAttr.result
                                    ? JSON.parse(profileAttr.result)
                                    : [];

                            if (categoryIndexArr.indexOf(catIndex) === -1) {
                                categoryIndexArr.push(catIndex);
                            }
                            // eslint-disable-next-line array-callback-return
                            profileAttr.map(val => {
                                let attrNum = idGenerator++;
                                let attrClassName =
                                    "attr-" + val.Name.replace(/\s/g, "") + attrNum;
                                this.profileTags.push({
                                    id: "attr-" + attrNum,
                                    class: attrClassName,
                                    content: val.Name,
                                    colorC: val.Color ? val.Color : ""
                                });
                                if (val.Color) this.coloredTags.push(attrClassName);
                            });

                            if (categoryIndexArr.length === category.length) {
                                let obj = sessionStorage.getItem("vlocity.profileAttribites") ? JSON.parse(sessionStorage.getItem("vlocity.profileAttribites")) : {};
                                obj = obj ? obj : {};
                                obj[this.obj.Id] = this.profileTags;
                                sessionStorage.setItem(
                                    "vlocity.profileAttribites",
                                    JSON.stringify(obj)
                                );
                                resolve("profile attributes fetched");
                            }
                        })
                            .catch(e => {
                                console.error(e);
                                reject("Error in fetching profile attributes");
                            });
                    });
                })
                    .catch(e => {
                        console.error(e);
                        reject("Error in fetching profile attributes");
                    });
            } else {
                this.profileTags = userAttr[this.obj.Id];
                // eslint-disable-next-line array-callback-return
                this.profileTags.map(val => {
                    if (val.colorC && val.class) this.coloredTags.push(val.class);
                });
                resolve("profile attributes fetched");
            }
        });
    }

    get iconCheckin() {
        let iconClass = `${this.theme}-icon_selected ${this.theme}-icon-text-default ${this.theme}-m-right_x-small`;
        return iconClass;
    }

    get actionClass() {
        let classes = `${this.theme}-m-top--x-small ${this.theme}-truncate via-actions state-action-item ${this.theme}-col`;
        return classes;
    }

    get rowActionClass() {
        let classes =
            this.menuActions && this.menuActions.length
                ? `${this.theme}-col ${this.theme}-size--11-of-12`
                : `${this.theme}-col ${this.theme}-size--1-of-1`;
        return classes;
    }

    get menuActionClass() {
        let classes = `${this.theme}-m-top--xx-small ${this.theme}-col ${this.theme}-size--1-of-12`;
        return classes;
    }
}