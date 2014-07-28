var ANIMATION = "transform 300ms ease";
var PANTHRESHOLD = .5;
var VELTHRESHOLD = 0.65;

var itemWidth = 0;
var itemHeight = 0;
var marginSize = 0;
var curItem = 0;
var totalItems = 0;

var lastTouch = {
    x: 0,
    y: 0,
    scale: 1
};

var animationInProgress = false;
var requestMade = false;
var itemWidth = 0;
var itemHeight = 0;
var offset = {
    x: 0,
    y: 0
}
var scale = 1;

var swipeItems = document.getElementsByClassName("swipe-item");
totalItems = swipeItems.length;

var prevSwipeItem = null;
var curSwipeItem = swipeItems[curItem];
var nextSwipeItem = swipeItems[curItem+1];

var hammer;
var container = document.getElementById("SwipeSet");


function onPan( event) {
    if (scale == 1) {
        setTimeout( function( event){
            offset.x += event.deltaX - lastTouch.x;
            lastTouch.x = event.deltaX;
            requestUpdate()
        },0, event);
    }
}

function onPanEnd( event) {
    if (scale == 1) {
        setTimeout( function(event) {
            lastTouch.x = 0;
            if ( Math.abs( event.deltaX) > (PANTHRESHOLD*itemWidth) || Math.abs( event.velocityX) > VELTHRESHOLD) {
                if ( event.direction & Hammer.DIRECTION_LEFT) {
                    requestNextItem();
                    return;
                } else if (event.direction & Hammer.DIRECTION_RIGHT) {
                    requestPrevItem();
                    return;
                }
            }
            offset.x = 0;
            animateTransition();
        },0,event);
    }
}


function onPinch( event) {
    event.preventDefault();
        var scaleFactor = event.scale / lastTouch.scale;
        lastTouch.scale = event.scale;

        scale *= scaleFactor;
        offset.x += (scaleFactor - 1) * (event.center.x + offset.x) + (event.deltaX - lastTouch.x);
        offset.y += (scaleFactor - 1) * (event.center.y + offset.y) + (event.deltaY - lastTouch.y);

        lastTouch.x = event.deltaX;
        lastTouch.y = event.deltaY;

}

function onPinchEnd( event) {
    event.preventDefault();
    if (scale < 1) {
        scale = 1;
        offset.x = 0;
        offset.y = 0;
    }
    lastTouch.x = 0;
    lastTouch.y = 0;
    lastTouch.scale = 1;
}

function requestNextItem() {
    if ( curItem < totalItems - 1) {
        curItem++;
        offset.x = -itemWidth;
    } else {
        offset.x = 0;
    }
    animateTransition();
}

function requestPrevItem() {
    if ( curItem > 0) {
        curItem--;
        offset.x = itemWidth;
    } else {
        offset.x = 0;
    }
    animateTransition();
}

function animateTransition() {
    updateTransition();
    if (!animationInProgress) {
        animationInProgress = true;
        requestUpdate();
    }
}

function updateTransition() {
    if ( prevSwipeItem !== null) {
        /*prevSwipeItem.style["-webkit-transition"] = "";
        prevSwipeItem.style["-moz-transition"] = "";
        prevSwipeItem.style["-ms-transition"] = "";
        prevSwipeItem.style["-o-transition"] = "";*/
        prevSwipeItem.style.transition = ANIMATION;
    }
    /*curSwipeItem.style["-webkit-transition"] = "";
    curSwipeItem.style["-moz-transition"] = "";
    curSwipeItem.style["-ms-transition"] = "";
    curSwipeItem.style["-o-transition"] = "";*/
    curSwipeItem.style.transition = ANIMATION;
    if ( nextSwipeItem !== null) {
        /*nextSwipeItem.style["-webkit-transition"] = "";
        nextSwipeItem.style["-moz-transition"] = "";
        nextSwipeItem.style["-ms-transition"] = "";
        nextSwipeItem.style["-o-transition"] = "";*/
        nextSwipeItem.style.transition = ANIMATION;
    }
}

function updateTransitionEnd() {
    if ( prevSwipeItem !== null) {
        /*prevSwipeItem.style["-webkit-transition"] = "";
        prevSwipeItem.style["-moz-transition"] = "";
        prevSwipeItem.style["-ms-transition"] = "";
        prevSwipeItem.style["-o-transition"] = "";*/
        prevSwipeItem.style.transition = "";
    }
    /*curSwipeItem.style["-webkit-transition"] = "";
    curSwipeItem.style["-moz-transition"] = "";
    curSwipeItem.style["-ms-transition"] = "";
    curSwipeItem.style["-o-transition"] = "";*/
    curSwipeItem.style.transition = "";
    if ( nextSwipeItem !== null) {
        /*nextSwipeItem.style["-webkit-transition"] = "";
        nextSwipeItem.style["-moz-transition"] = "";
        nextSwipeItem.style["-ms-transition"] = "";
        nextSwipeItem.style["-o-transition"] = "";*/
        nextSwipeItem.style.transition = "";
    }
}

function transitionEnd() {
    updateTransitionEnd();
    if ( curSwipeItem !== swipeItems[curItem]) {
        prevSwipeItem = (curItem > 0) ? swipeItems[curItem-1] : null;
        curSwipeItem = swipeItems[curItem];
        nextSwipeItem = (curItem < totalItems - 1) ? swipeItems[curItem+1] : null;
        offset.x = 0;
    }
    animationInProgress = false;
    requestUpdate();
}

function resize() {
    itemWidth = container.offsetWidth;
    itemHeight = container.offsetHeight;

    for (var i = 0; i < swipeItems.length; i++) {
        var transform;
        if ( i < curItem ) {
            transform = "translateX(" + (-itemWidth) + "px) translateY(" + 0 + "px)";
        } else if ( i > curItem) {
            transform = "translateX(" + (itemWidth) + "px) translateY(" + 0 + "px)";
        } else {
            transform = "translateX(" + 0 + "px) translateY(" + 0 + "px) scale(" + scale + "," + scale + ")";
        }
        //swipeItems[i].style.webkitTransform = transform;
        //swipeItems[i].style.mozTransform = transform;
        swipeItems[i].style.transform = transform;
        swipeItems[i].style.width = itemWidth;
        swipeItems[i].style.height = itemHeight;
    }
    requestUpdate();
}


function setup( ) {

    hammer = new Hammer.Manager(container, {touchAction: "pan-y"});

    hammer.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));
    hammer.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith(hammer.get('pan'));

    //hammer.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }));
    //hammer.add(new Hammer.Tap()).recognizeWith('doubletap');

    hammer.on("pan", onPan);
    hammer.on("pinch", onPinch);
    //hammer.on("tap", onTap);
    //hammer.on("doubletap", onDoubleTap);
    hammer.on("panend pancancel", onPanEnd);
    hammer.on("pinchend pinchcancel", onPinchEnd);

    container.addEventListener( "webkitTransitionEnd", transitionEnd);
    container.addEventListener( "oTransitionEnd", transitionEnd);
    container.addEventListener( "transitionend", transitionEnd);
    container.addEventListener( "msTransitionEnd", transitionEnd);
    window.addEventListener( "resize", resize);
    // Hides mobile browser's address bar when page is done loading.
    window.addEventListener('load', function(e) {
        setTimeout(function() { window.scrollTo(0, 1); }, 1);
    }, false);

    resize();
}

function updateTransform() {
    var styleValue;

    if ( prevSwipeItem !== null) {
        styleValue = "translateX(" + (offset.x - itemWidth) + "px) translateY(" + offset.y + "px)";
        /*prevSwipeItem.style["-webkit-transform"] = styleValue;
        prevSwipeItem.style["-moz-transform"] = styleValue;
        prevSwipeItem.style["-ms-transform"] = styleValue;
        prevSwipeItem.style["-o-transform"] = styleValue;*/
        prevSwipeItem.style.transform = styleValue;
    }

    styleValue = "translateX(" + offset.x + "px) translateY(" + offset.y + "px) scale(" + scale + "," + scale + ")";
    /*curSwipeItem.style["-webkit-transform"] = styleValue;
    curSwipeItem.style["-moz-transform"] = styleValue;
    curSwipeItem.style["-ms-transform"] = styleValue;
    curSwipeItem.style["-o-transform"] = styleValue;*/
    curSwipeItem.style.transform = styleValue;

    if ( nextSwipeItem !== null) {
        styleValue = "translateX(" + (offset.x + itemWidth) + "px) translateY(" + offset.y + "px)";
        /*nextSwipeItem.style["-webkit-transform"] = styleValue;
        nextSwipeItem.style["-moz-transform"] = styleValue;
        nextSwipeItem.style["-ms-transform"] = styleValue;
        nextSwipeItem.style["-o-transform"] = styleValue;*/
        nextSwipeItem.style.transform = styleValue;
    }

    requestMade = false;
}

function requestUpdate( force, uniqueCallback) {
    if ((!requestMade && !animationInProgress) || force) {
        if ( typeof uniqueCallback === "undefined"){
            requestAnimationFrame( updateTransform);
        } else {
            requestAnimationFrame( uniqueCallback);
        }
        requestMade = true;
    }
}

setup();
