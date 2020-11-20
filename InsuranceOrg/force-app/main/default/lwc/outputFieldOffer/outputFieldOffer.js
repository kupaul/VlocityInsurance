import { LightningElement, api } from "lwc";
import { get } from "vlocity_ins/lodash";
import { formatCurrency, getUserProfile } from "vlocity_ins/utility";
//import { format } from "c/date_fns";
export default class OutputFieldOffer extends LightningElement {
    @api record;
    @api fieldName;
    @api type = "string";
    @api placeholder = "output Field";
    @api extraclass;

    userProfile;

    connectedCallback() {
        this.userProfile = JSON.parse(sessionStorage.getItem("userProfile"));
        if (!this.userProfile) {
            getUserProfile().then(result => {
                let userProfile = {
                    $root: {
                        vlocity: {}
                    }
                };

                let uData = {};
                uData.userId = result.userid;
                uData.userAnLocale = result.anlocale;
                uData.userSfLocale = result.sflocale;
                uData.userCurrency = result.money;
                uData.userLanguage = result.language;
                uData.userTimeZone = result.timezone;
                uData.userName = result.name;
                uData.userType = result.type;
                uData.userRole = result.role;
                uData.userProfileName = result.profilename;
                uData.userProfileId = result.profileid;
                uData.userAccountId = result.accountid;
                uData.userContactId = result.contactid;
                userProfile.$root.vlocity = uData;
                this.userProfile = userProfile;
                sessionStorage.setItem("userProfile", JSON.stringify(userProfile));
            });
        }
    }

    get fieldValue() {
        return this.formatField(get(this.record, this.fieldName), this.type);
    }

    formatUsPhone(phone) {
        let phoneTest = new RegExp(
            /^((\+1)|1)? ?\(?(\d{3})\)?[ .-]?(\d{3})[ .-]?(\d{4})( ?(ext\.? ?|x)(\d*))?$/
        );
        phone = phone.trim();
        let results = phoneTest.exec(phone);
        if (results !== null && results.length > 8) {
            return (
                "(" +
                results[3] +
                ") " +
                results[4] +
                "-" +
                results[5] +
                (typeof results[8] !== "undefined" ? " x" + results[8] : "")
            );
        }
        return phone;
    }

    //   formatDate(date) {
    //     return format(new Date(date), "MM/dd/yy");
    //   }

    //   formatDateTime(date) {
    //     return format(new Date(date), "eee dd, yyyy hh:mm a");
    //   }

    /* eslint-disable consistent-return */
    formatCurrency(amount) {
        try {
            let userCurrency = this.userProfile.$root.vlocity.userCurrency;
            let userLocale = this.userProfile.$root.vlocity.userAnLocale;
            let value = formatCurrency(amount, {
                anlocale: userLocale || "en-US",
                money: userCurrency || "USD"
            });
            return value;
        } catch (e) {
            // handle error
        }
    }
    /* eslint-enable consistent-return */

    formatAddress(address) {
        if (!address) return "";

        let add = [
            address.street || address.Street,
            address.city || address.City,
            address.state || address.State,
            address.postalCode || address.PostalCode,
            address.country || address.Country
        ].filter(val => val != null);

        if (add.length === 0 && (address.Latitude || address.latitude)) {
            return (
                "Longitude: " +
                (address.longitude || address.Longitude) +
                "; Latitude: " +
                (address.latitude || address.Latitude)
            );
        }

        return add.join(", ");
    }

    formatField(input, type) {
        let val = input;
        /* eslint-disable default-case */
        switch (type) {
            case "currency":
                // $ **,***.**
                val = this.formatCurrency(val);
                break;
            case "date":
                // mm/dd/yy
                val = this.formatDate(val);
                break;
            case "datetime":
                // mon dd, yyyy hh:mm AM/PM
                val = this.formatDateTime(val);
                break;
            case "percentage":
                val = parseFloat(input) + "%";
                break;
            case "phone":
                // (***) ***-****
                val = this.formatUsPhone(val);
                break;
            case "address":
                // stree,city,state,postalcode,country
                val = this.formatAddress(val);
                break;
        }
        /* eslint-enable default-case */
        return val;
    }
}