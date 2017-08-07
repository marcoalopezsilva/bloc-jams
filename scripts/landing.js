var pointsArray = document.getElementsByClassName('point');

var animatePoints = function (points) {

    var revealPoint = function (index) {
        points[index].style.opacity = 1;
        points[index].style.transform = "scaleX(1) translateY(0) rotate(0deg)";
        points[index].style.msTransform = "scaleX(1) translateY(0) rotate(0deg)";
        points[index].style.webkitTransform = "scaleX(1) translateY(0) rotate(0deg)";
    }

    for (var counter=0; counter < points.length; counter++) {
        revealPoint(counter);
    };

};

window.onload = function () {
    // This next line triggers the animation if the user's window is too tall to permit scrolling. Otherwise, the animation would never be triggered;
    if (window.innerHeight > 950) {
        animatePoints(pointsArray);
    }
    
    var sellingPoints = document.getElementsByClassName('selling-points')[0];
    var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;

    window.addEventListener('scroll', function(event) {
        //console.log("Current offset from the top is " + sellingPoints.getBoundingClientRect().top + " pixels");
        if (document.documentElement.scrollTop || document.body.scrollTop >= scrollDistance) {
            animatePoints(pointsArray);
        }
    })
};
