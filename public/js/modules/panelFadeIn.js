let panelFadeIn = $('.panel').each(function(index) {
    $(this).delay(index * 400).fadeIn(300);

});

export default panelFadeIn;