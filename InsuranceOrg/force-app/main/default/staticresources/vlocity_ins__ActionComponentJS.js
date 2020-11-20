// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
    'use strict';
    var timeout;
    return function() {
        var context = this,
            args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) {
                func.apply(context, args);
            }
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
            func.apply(context, args);
        }
    };
}
 //workaround to call the 'ResponsiveTail' method from lightning component.
(function(w){
    "use strict";

    var respTailMethods = {
        "responsiveTailMethod":responsiveTailMethod
    };

    function responsiveTailMethod(){
        var responsiveTail = new ResponsiveTail();
    } 
    w.responsiveTail = respTailMethods;

})(window);

// ResponsiveTail Object
function ResponsiveTail() {
    'use strict';
    var self = this;
    this.createDropdown();
    if (this instanceof ResponsiveTail) {
        this.createDropdown();
        // console.log('Dropdown created 2');
        this.activateMenu();
        // console.log('Menu activated 2');
    } else {
        return new ResponsiveTail();
    }

    $(window).resize(debounce(function() {
        self.createDropdown();
        // console.log('Dropdown created on window resize');
    }, 20));
}

/**
 * Get the summed width of all the .action-item's 
 *
 */
ResponsiveTail.prototype.getItemsWidth = function() {
    'use strict';
    var actionItemsW = 0;
    $('.action-container.action-horizontal').children('.action-item').each(function() {
        actionItemsW += $(this).outerWidth();
    });
    if ($('.action-container.action-horizontal').hasClass('dropdown')) {
        actionItemsW += 31;
    }
    return actionItemsW;
};

/**
 * Decide whether we need a dropdown or not based on comparing the two widths
 *
 */
ResponsiveTail.prototype.getDropdown = function() {
    'use strict';
    var actionContainerW = $('.action-container.action-horizontal').outerWidth();
    // console.log('actionContainerW (in getDropdown): ', actionContainerW);
    // console.log('this.getItemsWidth() (in getDropdown): ', this.getItemsWidth());
    if (actionContainerW < this.getItemsWidth()) {
        return true;
    } else {
        return false;
    }
};

/**
 * This is where the magic happens. Create the dropdown container if it doesn't
 * exist, then one by one add each last action-item to the dropdown container.
 * Additionally, return each action-item to its original position when the browser
 * width is increasing in size. :)
 *
 */
ResponsiveTail.prototype.createDropdown = function() {
    'use strict';
    var vlocityActionsW = $('.vlocity-actions').outerWidth();
    // console.log('vlocityActionsW (in createDropdown): ', vlocityActionsW);
    // This moves the action-item into a actions-dropdown element as the browser size gets smaller
    // by calculating the sum of all the action-item's width compared to the container's width
    if (this.getDropdown()) {
        if ($('.actions-dropdown').length < 1) {
            $('.action-container.action-horizontal').addClass('dropdown')
                .append('<div class="actions-dropdown"></div>');
        }
        if ($('.actions-dropdown').length) {
            var addedElementsWidth = 0;
            $($('.action-container.action-horizontal').children('.action-item').get().reverse()).each(function() {
                if ((addedElementsWidth + $(this).outerWidth()) > vlocityActionsW) {
                    $(this).prependTo('.actions-dropdown');
                } else {
                    addedElementsWidth += $(this).outerWidth();
                }
            });
        }
        // This moves the action item's back out of the actions-dropdown into their original position
        // as the browser size gets larger by checking to see if the sum of the action-item's on the
        // main level plus the width of first action item in the actions-dropdown is more than or equal
        // to the width of the actions-container
    } else if ($('.actions-dropdown').length) {
        var actionsDropdown = $('.actions-dropdown'),
            firstInDropdown = actionsDropdown.find('.action-item').first(),
            firstInDropdownW = actionsDropdown.find('.action-item').first().outerWidth();
        // console.log('firstInDropdownW (in else if of createDropdown: ', firstInDropdownW);
        if (vlocityActionsW >= (parseInt(this.getItemsWidth()) + firstInDropdownW)) {
            $('.action-container.action-horizontal').children('.action-item').last().after(firstInDropdown);
        }
        if (actionsDropdown.is(':empty')) {
            actionsDropdown.remove();
            $('.action-container.action-horizontal').removeClass('dropdown');
        }
    }
};

ResponsiveTail.prototype.activateMenu = function() {
    'use strict';
    $('html').click(function(e) {
        if ($(e.target).parents('.actions-dropdown').length) {
            return;
        }
        $('.action-container.action-horizonntal, .actions-dropdown').removeClass('active');
        $('.action-container.action-horizontal').removeClass('active');
    });
    $('.action-container.action-horizontal').children('i.icon').click(function(e) {
        e.stopPropagation();
        $(this).siblings('.actions-dropdown').toggleClass('active');
        $('.action-container.action-horizontal').toggleClass('active');
    });
};
