// #5
var animatePoints = function() {

    var revealPoint = function () {
        // #7
        $(this).css({
            opacity: 1,
            transform: 'scaleX(1) translateY(0)'
        });
    };
// #6
    $.each($('.point'), revealPoint);
};

// The next block contains functions that need to be executed when an event occurs
$(window).load(function() {

    // #1
    if ($(window).height() > 950) {
        animatePoints();
    }

    // #2
    var scrollDistance = $('.selling-points').offset().top - $(window).height() + 200;

    // #3
    $(window).scroll(function(event) {
        // #4
        if ($(window).scrollTop() >= scrollDistance) {
            animatePoints();
        }
    });
});
