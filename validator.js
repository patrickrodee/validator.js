(function ($) {

	$.fn.validator = function (options) {

		// Initialize and extend settings
		var settings = $.extend( {}, $.fn.validator.defaults, options);

		// Initialize check object
		var check = {};
		// Populate the check object
		for (var key in settings) {
			if (settings.hasOwnProperty(key) && (settings[key] != null) && (typeof(settings[key]) == "string"))  {
				check[key] = new RegExp(settings[key]);
			}
		}

		function validate(element) {
			$element = $(element);
			// If it is required (has a "!" at the front), pass it through without the !
			var validateType = ( $element.data("validate").charAt(0) == "!" ? $element.data("validate").slice(1) : $elemet.data("validate") );
			// Element hasn't been clicked yet.
			if ( $element.hasClass('pristine') ) {
				// If validation passes...
				if ( check[validateType].test( $element.val() ) ) {
					// Add the validClass and the validAfter
					$element.addClass(settings.validClass);
					// If invalidAfter is set to display
					if (settings.validAfter) {
						$element.after(settings.validAfterElem);
					}
				}
				// If validation fails...
				else {
					// Add the invalidClass
					$element.addClass(settings.invalidClass);
					// If invalidAfter is true, append the invalidAfterElem
					if (settings.invalidAfter) {
						$element.after(settings.invalidAfterElem);
					}
				}
				// To keep bound events low, we unbind "blur" from items that are dirty and
				// now bind the "input" event to keep track of input changes.
				$element.unbind("blur").removeClass('pristine').addClass('dirty').on('input', function() {
					validate(this);
				});
			}
			// Element is not pristine (is dirty)
			else {
				// If validation passes... 
				if ( check[validateType].test( $element.val() ) ) {
					// If the element has invalidClass, remove invalidClass
					if ( $element.hasClass(settings.invalidClass) ) {
						$element.removeClass(settings.invalidClass);
					}
					if ( settings.invalidAfter ) {
						$element.next().remove();
					}
					$element.addClass(settings.validClass);
					if (settings.validAfter) {
						$element.after(settings.validAfterElem);
					}
				}
				// If validation fails...
				else {
					$element.next().remove();
					$element.addClass(settings.invalidClass);
					if (settings.invalidAfter) {
						$element.after(settings.invalidAfterElem);
					}
				}
			}
		}

		return this.each(function() {
			$(this).attr('autocomplete', (settings.autocomplete ? "on" : "off"));
			var $formElems = $(this).find('input[data-validate]');
			$formElems.each(function() {
				var $elem = $(this);
				$elem.bind('blur', function() {
					validate(this);
				});
				$elem.addClass("pristine");
				if ($elem.data('validate').charAt(0) == "!") {
					$elem.attr('required', 'true');
				}
				if (settings.autocomplete) {
					setInterval(function() {
						if ( $elem.val() != "") {
							$formElems.each(function() {
								if ( $(this).val() != "" ) {
									validate(this);
								}
							});
						}
					}, 200);
				}
			});
		});
	};

	// Exposing the defaults
	$.fn.validator.defaults = {
		name: "^[a-zA-Z]{2,}",
		address: "^.{5,}",
		city: "^[a-zA-Z]{2,}",
		state: "^[a-zA-Z]{2,}",
		zip: "^[0-9]{5}",
		country: "^[a-zA-Z]{3,}",
		phone: "^[0-9]{7,11}$",
		ext: "^x[0-9]{1,}|^[0-9]{1,}",
		email: "^[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\\.[a-zA-Z]{2,4}",
		url: "[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)",
		autocomplete: false,
		validClass: "valid",
		validAfter: false,
		validAfterElem: "<i class='fa fa-fw fa-check' style='color:#2ecc71;'></i>",
		invalidClass: "invalid",
		invalidAfter: false,
		invalidAfterElem: "<i class='fa fa-fw fa-times' style='color:#e74c3c';></i>"
	};
}( jQuery ));