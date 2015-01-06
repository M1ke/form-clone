/*@include ../easy-js-jq/jq-input-blank.js */

var formClone={
	event:'form-cloned'
	,setQuantity:function(num,reduce,item){
		$(typeof item!='undefined' ? item : '.form-clone:first').formCloneQuantity(num,reduce);
	}
};

$.fn.formCloneQuantity=function(num,reduce){
	var i=0;
	while (this.find('.form-clone-el').length<num && i<num){
		this.find('.form-clone-add').click();
		i++;
	}
};

$.fn.formClone=function(opts){
	opts=$.extend({
		all:this.data('clone-all') || true
		,buttonCss:{'float':'left'}
		,buttonText:'+'
		,el:this.data('clone-el') || 'div'
		,elCss:{overflow:'auto','float':'left',clear:'left'}
	},opts);
	if (opts.onClone){
		this.bind('form-cloned',opts.onClone);
	}
	return this.each(function(opts){
		return function(key){
			var $items=$(this).children(opts.el)
				,length=$items.length;
			$items.addClass('form-clone-el').each(function(opts){
				return function(key){
					var $formCloneRemoveButton=function(el,buttonCss){
						return $('<a href="#" class="form-clone-button form-clone-remove">-</a>').data('el',el).formCloneRemove(buttonCss);
					};
					if (key==(length-1)){
						$('<a href="#" class="form-clone-button form-clone-add">'+opts.buttonText+'</a>').data(opts).click(function(e){
							var el,$div,$cloned;
							e.preventDefault();
							var el=$(this).data('el')
								,$div=$(this).prevAll($(this).data('el')).first();
							if ($(this).prev('.form-clone-remove').length<1){
								$formCloneRemoveButton(el,$(this).data('buttonCss')).insertBefore($(this));
							}
							var $cloned=$div.clone($(this).data('all')).insertBefore($(this));
							$formCloneRemoveButton(el,$(this).data('buttonCss')).insertBefore($(this));
							$cloned.inputBlankArray().find('input:not([type="submit"])').val('');
							$(this).parent().trigger(formClone.event);
							if (typeof $(this).data('cloneCallback')=='function'){
								$(this).data('cloneCallback').call(null,$cloned,$div);
							}
						}).css(opts.buttonCss).attr('title','Click to add another').insertAfter($(this));
						// if (length>1) $('<a href="#">-</a>').formCloneRemove().insertAfter($(this));
					}
					if (length!=1){
						$formCloneRemoveButton(opts.el,opts.buttonCss).insertAfter($(this));
					}
					$(this).css(opts.elCss);
				};
			}(opts));
		};
	}(opts));
};

$.fn.formCloneInit=function(opts){
	return this.find('.form-clone').formClone(opts);
};

$.fn.formCloneRemove=function(buttonCss){
	return this.css(buttonCss).attr('title','Click to remove this').click(function(e){
		e.preventDefault();
		var $parent=$(this).parent()
			,clones=$parent.find($(this).data('el')).length-1;
		$(this).prev().remove()
		.end().remove();
		if (clones<2){
			$parent.find('.form-clone-remove').remove();
		}
		$parent.trigger(formClone.event);
	});
};

$(function(){
	$('.form-clone').formClone();
});
