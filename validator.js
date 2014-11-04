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

		// Initialize the defaultStyles object
		var defaultFormStyle = "<style> input:focus {border-color: #9ecaed; box-shadow: 0 0 3px #9ecaed; } input.valid {border-color: #7ca82b; transition: border 0.25s box-shadow: 0.25s; } input.valid:focus {box-shadow: 0 0 3px #7ca82b; } input.invalid {border-color: #cc3300; transition: border 0.25s box-shadow: 0.25s; } input.invalid:focus {box-shadow: 0 0 3px #cc3300; } </style> ";

		// .mergeValdiation is used to 
		this.mergeValidation = function(target, regexes_to_merge) {
			if (typeof(regexes_to_merge) == "string") {
				check[target] = new RegExp(check[target].source + "|" + check[regexes_to_merge].source );
			}
			else if (regexes_to_merge instanceof Array) {
				check[target] = new RegExp(check[target].source + recursiveMerge(regexes_to_merge));
			}
			return this;
		};

		function recursiveMerge(list) {
			if (list.length === 0) {
				return "";
			}
			else {
				return "|" + check[list[0]].source + recursiveMerge(list.slice(1));
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

		function validate(element, elemSiblings) {
			$element = $(element);
			// If it is required (has a "!" at the front), pass it through without the !
			var validateType = $element.data("validate");
			// Element hasn't been clicked yet.
			if ( $element.hasClass('pristine') ) {
				// If validation passes...
				if ( check[validateType].test( $element.val() ) ) {
					// Add the validClass and the validAfter
					$element.addClass(settings.validClass);
					// If requiredFlag is set to true
					if (settings.requiredFlag) {
						$element.next().remove();
					}
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
					if (settings.requiredFlag) {
						$element.next().remove();
					}
					if (settings.invalidAfter) {
						$element.after(settings.invalidAfterElem);
					}
				}
				// To keep bound events low, we unbind "blur" from items that are dirty and
				// now bind the "input" event to keep track of input changes.
				$element.unbind("blur").removeClass('pristine').addClass('dirty').on('input', function() {
					validate(this, elemSiblings);
				});
				if (completion(elemSiblings)) {
					$(settings.blockUntilComplete).prop('disabled', false).css('cursor', 'pointer');
				}
				else {
					$(settings.blockUntilComplete).prop('disabled', true).css('cursor', 'not-allowed');
				}
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
					if ( settings.invalidAfter ) {
						$element.next().remove();
					}
					$element.addClass(settings.invalidClass);
					if (settings.invalidAfter) {
						$element.after(settings.invalidAfterElem);
					}
				}
				if (completion(elemSiblings)) {
					$(settings.blockUntilComplete).prop('disabled', false).css('cursor', 'pointer');
				}
				else {
					$(settings.blockUntilComplete).prop('disabled', true).css('cursor', 'not-allowed');
				}
			}
		}

		return this.each(function() {
			$this = $(this);
			if (settings.defaultStyle) {
				$(defaultFormStyle).appendTo($this);
			}
			$this.attr('autocomplete', (settings.autocomplete ? "on" : "off"));
			if (settings.blockUntilComplete !== null) {
				$(settings.blockUntilComplete).prop('disabled', true).css('cursor', 'not-allowed');
			}
			var $formElems = $this.find('input[data-validate]');
			$formElems.each(function() {
				var $elem = $(this);
				if (settings.immediateValidation) {
					$elem.on('input', function() {
						validate(this, $formElems);
					});
				}
				$elem.bind('blur', function() {
					validate(this, $formElems);
				});
				$elem.addClass("pristine").attr('required','true');
				if (settings.requiredFlag) {
					$elem.after(settings.requiredElement);
				}
				/**************************************************************
				******* TO DO -- MAKE THIS WORK WITH DELETION. Currently does
				******* not support deletion of characters. Figure out how to
				******* make it work with that.
				*/
				
				/*
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
				*/

				/*
				**************************************************************/
				if (settings.autocomplete) {
					setInterval(function() {
						if ( $elem.val() !== "") {
							$formElems.each(function() {
								if ( $(this).val() !== "" ) {
									validate(this, $formElems);
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
		name: "^[a-zA-Z]{2,15}\\s[a-zA-Z]{2,15}",
		address: "^.{5,}",
		city: "^[a-zA-Z]{2,}",
		state: "^[a-zA-Z]{2,}",
		zip: "(?:^[0-9]{5})|(?:^[0-9a-zA-Z]{4,})",
		country: "^[a-zA-Z]{3,}",
		phone: "^[0-9]{7,11}$",
		phoneWithFormat: "^\\(\\d{3}\\) \\d{3}\\-\\d{4}",
		ext: "^x[0-9]{1,}|^[0-9]{1,}",
		email: "^[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\\.[a-zA-Z]{2,4}",
		url: "[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)",
		autocomplete: false,
		requiredFlag: true,
		requiredElement: "<i class='fa fa-fw fa-asterisk' style='color:#CCC; font-size:10px;'></i>",
		validClass: "valid",
		validAfter: true,
		validAfterElem: "<i class='fa fa-fw fa-check' style='color:#7ca82b;'></i>",
		invalidClass: "invalid",
		invalidAfter: true,
		invalidAfterElem: "<i class='fa fa-fw fa-times' style='color:#cc3300';></i>",
		// Block Until Complete: null if no action should be locked until completion.
		// If you want to block a submit button until the form is complete,
		// set blockUntilComplete to the id of the button to block.
		blockUntilComplete: null,
		immediateValidation: false,
		defaultStyle: false
	};
}( jQuery ));