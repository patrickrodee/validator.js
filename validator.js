/*
 * Author: Patrick RoDee
 * Updated: 2 Nov/14
 * More info: https://github.com/patrickrodee/validator.js
 */
(function ($) {

	$.fn.validator = function (options) {

		// Initialize and extend settings
		var settings = $.extend( {}, $.fn.validator.defaults, options);

		// Initialize check object
		var check = {};
		// Populate the check object
		for (var key in settings) {
			if (settings.hasOwnProperty(key) && (settings[key] !== null) && (typeof(settings[key]) == "string"))  {
				check[key] = new RegExp(settings[key]);
			}
		}

		function completion(elems) {
			if (elems.length === 0) {
				return true;
			}
			else {
				var $elem = $(elems[0]);
				var vType = $elem.data("validate");
				return check[vType].test( $elem.val() ) && completion(elems.slice(1));
			}
		}

		function validate(element) {
			$element = $(element);
			// If it is required (has a "!" at the front), pass it through without the !
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
			$this = $(this);
			$this.attr('autocomplete', (settings.autocomplete ? "on" : "off"));
			$this.find("button[type='submit']").prop('disabled', (settings.blockUntilComplete === true ? true : false ) );
			var $formElems = $this.find('input[data-validate]');
			$formElems.each(function() {
				var $elem = $(this);
				$elem.bind('blur', function() {
					validate(this);
				});
				$elem.addClass("pristine").attr('required','true');
				/**************************************************************
				******* TO DO -- MAKE THIS WORK WITH DELETION. Currently does
				******* not support deletion of characters. Figure out how to
				******* make it work with that.
				*/
				if ($elem.data('validate') == "phoneWithFormat" || $elem.data('validate') == "!phoneWithFormat") {
					$elem.on('input', function() {
						if ($elem.val().length == 3) {
							$elem.val($elem.val().replace(/(\d{3})/, "($1) "));
						}
						if ($elem.val().length >= 9 ) {
							$elem.val($elem.val().replace(/(\u0028\d{3}\u0029\s\d{3})(\d{1,4})/, "$1-$2"));
						}
						//$elem.val($elem.val().replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3"))
					});
				}
				/*
				**************************************************************/
				if (settings.autocomplete) {
					setInterval(function() {
						if ( $elem.val() !== "") {
							$formElems.each(function() {
								if ( $(this).val() !== "" ) {
									validate(this);
								}
							});
						}
					}, 200);
				}
			});
			setInterval(function() {
				if (settings.blockUntilComplete) {
					if (completion($formElems)) {
						$this.find("button[type='submit']").prop('disabled', false);
					}
					else {
						$this.find("button[type='submit']").prop('disabled', true);
					}
				}
			}, 200);
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
		phoneWithFormat: "^\\(\\d{3}\\) \\d{3}\\-\\d{4}",
		ext: "^x[0-9]{1,}|^[0-9]{1,}",
		email: "^[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\\.[a-zA-Z]{2,4}",
		url: "[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)",
		autocomplete: false,
		validClass: "valid",
		validAfter: false,
		validAfterElem: "<i class='fa fa-fw fa-check' style='color:#2ecc71;'></i>",
		invalidClass: "invalid",
		invalidAfter: false,
		invalidAfterElem: "<i class='fa fa-fw fa-times' style='color:#e74c3c';></i>",
		requiredClass: null,
		optionalClass: null,
		blockUntilComplete: true
	};
}( jQuery ));