function VlocityAccordion() {
    this.accordionClick();
    this.toggleAll();
}

(function($) {
    /**
     * When clicking an individual item
     */
    VlocityAccordion.prototype.accordionClick = function() {
        var self = this,
            expandCollapseContainer = $('.expand-collapse-container');
        $('.raptorItemsContainer').on('click', '.raptorMappingItem .vlc-accordion-toggle', function() {
            self.performToggle($(this));
            expandCollapseContainer.find('a').removeClass('disabled');
            if(self.accordionObserver()) {
                expandCollapseContainer.find('a.expand-all').addClass('disabled');
            }else if(!self.accordionObserver() && self.accordionObserver() !== undefined) {
                expandCollapseContainer.find('a.collapse-all').addClass('disabled');
            }
        });
    };

    /**
     * Expand/Collapse All links
     */
    VlocityAccordion.prototype.toggleAll = function() {
        var self = this,
            container = $('.expand-collapse-container');
        container.find('a').click(function(e) {            
            e.preventDefault();
            if($(this).hasClass('disabled')) {
                return false;
            }
            if($(this).hasClass('expand-all')) {
                $('.raptorMappingItem').find('.vlc-accordion-toggle.collapsed').each(function() {
                    self.performToggle($(this));
                }); 
            }else if($(this).hasClass('collapse-all')) {
                $('.raptorMappingItem').find('.vlc-accordion-toggle.expanded').each(function() {
                    self.performToggle($(this));
                }); 
            }
            container.find('a').removeClass('disabled');
            $(this).addClass('disabled');
        });
        return true;
    };

    /**
     * Observer checking to see if all items are expanded or collapsed
     */
    VlocityAccordion.prototype.accordionObserver = function() {
        var raptorItem = $('.raptorMappingItem'),
            raptorItemLength = raptorItem.length,
            expanded = 0;

        raptorItem.each(function() {
            if($(this).hasClass('expanded')) {
                expanded += 1;
            }
        });
        if(expanded === 0) {
            return false;
        }else if(expanded === raptorItemLength) {
            return true;            
        }
        return undefined;
    };

    /**
     * Helper method to perform the toggle animation used on click of each item and 
     * the expand/collapse all
     */
    VlocityAccordion.prototype.performToggle = function(scope) {
        var raptorItem = scope.parent(),
            flag = false;
        if(raptorItem.hasClass('expanded')) {
            flag = true;
            scope.add(raptorItem).removeClass('expanded');
        }else{
            scope.add(raptorItem).removeClass('collapsed').addClass('expanded');
        }
        scope.next('.vlc-accordion-content').slideToggle(500, function() {
            if(flag === true) {
                scope.add(raptorItem).addClass('collapsed');
                flag = false;
            }
        });
    };
}(jQuery));