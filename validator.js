(function ($) {
	$.fn.validator = function (options) {

		// Initialize and extend settings
		var settings = $.extend({
			name: "^[a-zA-Z]{2,}",
			address: "^[a-zA-Z]{2,}",
			city: "^[a-zA-Z]{2,}",
			state: "^[a-zA-Z]{2,}",
			zip: ".{2,}",
			country: "^[a-zA-Z]{3,}",
			phone: "^[0-9]{7,11}$",
			ext: "^x[0-9]{1,}|^[0-9]{1,}",
			email: "^[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\\.[a-zA-Z]{2,4}",
			url: "[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)",
			valid: "valid",
			validAfter: "<i class='fa fa-fw fa-check' style='color:#2ecc71;'></i>",
			invalid: "invalid",
			invalidAfter: "<i class='fa fa-fw fa-times' style='color:#e74c3c';></i>"
		}, options);

		// Initialize check object
		var check = {};
		// Populate the check object
		for (var key in settings) {
			if (settings.hasOwnProperty(key)) {
				check[key] = new RegExp(settings[key]);
			}
		}

		function validate(element) {
			$element = $(element);
			var validateType = $element.data("validate");
			// Element hasn't been clicked yet.
			if ( $element.hasClass('pristine') ) {
				// If validation passes...
				if ( check[validateType].test( $element.val() ) ) {
					if ( $element.hasClass(settings.invalid) ) {
						$element.removeClass(settings.invalid);
					}
					$element.next(".fa").remove();
					$element.addClass(settings.valid);
					$element.after(settings.validAfter);
				}
				// If validation fails...
				else {
					$element.next(".fa").remove();
					$element.addClass(settings.invalid);
					$element.after(settings.invalidAfter);
				}
				$element.unbind("blur").removeClass('pristine').addClass('dirty').on('input', function() {
					validate(this);
				});
			}
			// Element is not pristine (is dirty)
			else {
				if ( check[validateType].test( $element.val() ) ) {
					if ( $element.hasClass(settings.invalid) ) {
						$element.removeClass(settings.invalid);
					}
					$element.next(".fa").remove();
					$element.addClass(settings.valid);
					$element.after(settings.validAfter);
				}
				// If validation fails...
				else {
					$element.next(".fa").remove();
					$element.addClass(settings.invalid);
					$element.after(settings.invalidAfter);
				}
			}
		}

		return this.each(function() {
			var formElems = $(this).find('input[data-validate]');
			for (var i = 0; i < formElems.length; i++) {
				(function () {
					var $item = $(formElems[i]);
					$item.addClass("pristine");
					$item.bind("blur", function() {
						validate(this);
					});
				})();
			}
		});
	};
}( jQuery ));