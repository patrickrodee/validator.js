(function ($) {

	$.fn.validator = function (options) {

		// Initialize and extend settings
		var settings = $.extend( {}, $.fn.validator.defaults, options);

		// Initialize check object
		var check = {};
		// Populate the check object
		for (var key in settings.comparators) {
			if (settings.comparators.hasOwnProperty(key) && (settings.comparators[key] != null)) {
				check[key] = new RegExp(settings.comparators[key]);
			}
		}

		function validate(element) {
			$element = $(element);
			var validateType = $element.data("validate");
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
					// Add the invalidClass and the invalidAfter element
					$element.addClass(settings.invalidClass);
					if (settings.invalidAfter) {
						$element.after(settings.invalidAfterElem);
					}
				}
				$element.unbind("blur").removeClass('pristine').addClass('dirty').on('input', function() {
					validate(this);
				});
			}
			// Element is not pristine (is dirty)
			else {
				if ( check[validateType].test( $element.val() ) ) {
					if ( $element.hasClass(settings.invalidClass) ) {
						$element.removeClass(settings.invalidClass);
					}
					$element.next().remove();
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

			/*
			for (var i = 0; i < formElems.length; i++) {
				(function () {
					var $item = $(formElems[i]);
					$item.addClass("pristine");
					if (settings.autocomplete) {
						setInterval(function() {
							if ($item.val() != "") {
								formElems.each(function() {
									if ($(this).val() != "") {
										validate(this);
									}
								});
							}
						}, 200);
					}
					$item.bind("blur", function() {
						validate(this);
					});
				})();
			}
			*/
		});
	};

	// Exposing the defaults
	$.fn.validator.defaults = {
		comparators: {
			name: "^[a-zA-Z]{2,}",
			address: "^.{2,}",
			city: "^[a-zA-Z]{2,}",
			state: "^[a-zA-Z]{2,}",
			zip: ".{2,}",
			country: "^[a-zA-Z]{3,}",
			phone: "^[0-9]{7,11}$",
			ext: "^x[0-9]{1,}|^[0-9]{1,}",
			email: "^[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\\.[a-zA-Z]{2,4}",
			url: "[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)"
		},
		autocomplete: false,
		validClass: "valid",
		validAfter: false,
		validAfterElem: "<i class='fa fa-fw fa-check' style='color:#2ecc71;'></i>",
		invalidClass: "invalid",
		invalidAfter: false,
		invalidAfterElem: "<i class='fa fa-fw fa-times' style='color:#e74c3c';></i>"
	};
}( jQuery ));