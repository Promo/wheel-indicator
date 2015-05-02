;(function($){
    /* Wheel-indicator */

    $.event.special['wheel-indicator'] = {
        setup: function(){
            var $this = $(this);

            if ($this.data('wheel-indicator')) return;

            var indicator = new WheelIndicator(this);

            $this.data('wheel-indicator', indicator);

            indicator.on(function(e){
                $this.trigger('wheel-indicator', e);
            });
        },

        handle: function (e, data) {
            var event = $.extend({}, e, data);
            return e.handleObj.handler.apply( this, [event, data] );
        }
    };
})(jQuery);
