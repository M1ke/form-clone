/*@include ../js-utils-jq/input-blank.js */

var formClone = {
	event: 'form-cloned',
	setQuantity: function(num, reduce, item){
		$(typeof item!=='undefined' ? item : '.form-clone:first').formCloneQuantity(num, reduce);
	}
};

$.fn.formCloneQuantity = function(num, reduce){
	var i = 0;
	var opts = this.data('form-clone');
	while (this.children(opts.el).length<num && i<num){
		this.children('.form-clone-add').click();
		i++;
	}
	if (reduce){
		i = this.children(opts.el).length;
		while (this.children(opts.el).length>num && i>0){
			this.children('.form-clone-remove').last().click();
			i--;
		}
	}
};

$.fn.formClone = function(options){
	return this.each(function(key){
		var opts = $.extend({
			all: $(this).data('clone-all') || true,
			allValues: $(this).data('clone-all-values') || false,
			buttonCss: {'float': 'right', clear: 'right'},
			buttonText: '+',
			el: $(this).data('clone-el') || 'div',
			elCss: {
				overflow: 'hidden'
			}
		}, options);

		if (opts.onClone){
			$(this).bind('form-cloned', opts.onClone);
		}

		var $items = $(this).children(opts.el)
			, length = $items.length;

		$(this).data('form-clone', opts);

		$items.addClass('form-clone-el').each(function(key){
			function $formCloneRemoveButton(el, buttonCss){
				return $('<a href="#" class="form-clone-button form-clone-remove">-</a>').data('el', el).formCloneRemove(buttonCss);
			}

			if (length!==1){
				$formCloneRemoveButton(opts.el, opts.buttonCss).insertBefore($(this));
			}

			if (key===(length-1)){
				$('<a href="#" class="form-clone-button form-clone-add">'+opts.buttonText+'</a>').data(opts).click(function(e){
					e.preventDefault();
					var el = $(this).data('el')
						, $div = $(this).parent().children($(this).data('el')).last()
						, $cloned;

					if ($(this).prev('.form-clone-remove').length<1){
						$formCloneRemoveButton(el, $(this).data('buttonCss')).insertBefore($div);
					}

					$(this).insertAfter($div);

					// Pass in "all" to copy events
					$cloned = $div.clone($(this).data('all'));

					$formCloneRemoveButton(el, $(this).data('buttonCss')).insertBefore($(this));

					// Set data.all-values to copy values
					if (!$(this).data('all-values')){
						$cloned.inputBlankArray().find('input').not('[type="submit"], [type="radio"], [type="checkbox"]').val('');
						$cloned.find('input[type="radio"], input[type="checkbox"]').prop('checked', false);
					}
					// do insert after un-check any radios so we don't insert checked radios and so possibly unset another already in the page
					$cloned.insertAfter($(this));

					$(this).parent().trigger(formClone.event);

					if (typeof $(this).data('cloneCallback')=='function'){
						$(this).data('cloneCallback').call(null, $cloned, $div);
					}
				}).css(opts.buttonCss).attr('title', 'Click to add another').insertBefore($(this));
			}

			$(this).css(opts.elCss);
		});
	});
};

$.fn.formCloneInit = function(opts){
	return this.find('.form-clone').formClone(opts);
};

$.fn.formCloneRemove = function(buttonCss){
	return this.css(buttonCss).attr('title', 'Click to remove this').click(function(e){
		e.preventDefault();
		var $parent = $(this).parent()
			, clones = $parent.children($(this).data('el')).length-1;

		$(this).nextAll($(this).data('el')+':first').remove();
		if (0===$(this).nextAll($(this).data('el')).length){
			$(this).prevAll($(this).data('el')+':first').before($(this).siblings('.form-clone-add'));
		}
		$(this).remove();

		if (clones<2){
			$parent.children('.form-clone-remove').remove();
		}

		$parent.trigger(formClone.event);
	});
};

$(function(){
	$('.form-clone').formClone();
});
