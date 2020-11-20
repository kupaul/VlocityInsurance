angular.module("vlocity").directive('input', function() {
    return {
        restrict: 'E',
        link: function (scope, element, attr, ngModel) {
          if (attr.type !== 'file' || $(element).parent(".btn-file").length === 0) return;

          var existingParent = $(element).parent(".btn-file"),
              originalLabel = existingParent.contents().last();

          // Override the input event and add custom 'path' logic
          element.unbind('change');
          element.bind('change', function () {
            var input = $(element),
                numFiles = input.get(0).files ? input.get(0).files.length : 1,
                label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
            existingParent.contents().last().replaceWith( numFiles > 0 ? label : originalLabel );
          });
        }
    };
});