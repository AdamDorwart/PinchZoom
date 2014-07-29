var reqAnimationFrame = (function () {
    return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

var log = document.querySelector("#log");
var el = document.querySelector("#hit");

var START_X = Math.round((window.innerWidth - el.offsetWidth) / 2);
var START_Y = Math.round((window.innerHeight - el.offsetHeight) / 2);

var ticking = false;
var transform;

var mc = new Hammer.Manager(el);

mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));

mc.add(new Hammer.Swipe()).recognizeWith(mc.get('pan'));
mc.add(new Hammer.Rotate({ threshold: 0 })).recognizeWith(mc.get('pan'));
mc.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith([mc.get('pan'), mc.get('rotate')]);

mc.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }));
mc.add(new Hammer.Tap()).recognizeWith('doubletap');

mc.on("pan", onPan);
mc.on("swipe", onSwipe);
mc.on("rotate", onRotate);
mc.on("pinch", onPinch);
mc.on("tap", onTap);
mc.on("doubletap", onDoubleTap);

mc.on("panend rotateend pinchend pancancel rotatecancel pinchcancel", resetElement);


function resetElement() {
    transform = {
        translate: { x: START_X, y: START_Y },
        scale: 1,
        rotate: 0
    };
    el.className = 'animate';

    requestElementUpdate();

    if (log.textContent.length > 2000) {
        log.textContent = log.textContent.substring(0, 2000) + "...";
    }
}

function updateElementTransform() {
    var value = [
        'translate3d(' + transform.translate.x + 'px, ' + transform.translate.y + 'px, 0)',
        'scale(' + transform.scale + ', ' + transform.scale + ')',
        'rotate(' + transform.rotate + 'deg)'];

    value = value.join(" ");
    el.textContent = value;
    el.style.webkitTransform = value;
    el.style.mozTransform = value;
    el.style.transform = value;
    ticking = false;
}

function requestElementUpdate() {
    if(!ticking) {
        reqAnimationFrame(updateElementTransform);
        ticking = true;
    }
}

function logEvent(str) {
    //log.insertBefore(document.createTextNode(str +"\n"), log.firstChild);
}

function onPan(ev) {
    el.className = '';
    transform.translate = {
        x: START_X + ev.deltaX,
        y: START_Y + ev.deltaY
    };
    requestElementUpdate();
    logEvent(ev.type);
}

function onSwipe(ev) {
    el.style.background = 'white';
    setTimeout(function () {
        el.style.background = '#42d692';
        requestElementUpdate();
    }, 300);
    requestElementUpdate();
    logEvent(ev.type);
}

function onPinch(ev) {
    el.className = '';
    transform.scale = ev.scale;
    requestElementUpdate();
    logEvent(ev.type);
}
function onRotate(ev) {
    el.className = '';
    transform.rotate = ev.rotation;
    requestElementUpdate();
    logEvent(ev.type);
}

function onTap(ev) {
    el.style.borderRadius = '100%';
    setTimeout(function () {
        el.style.borderRadius = '0';
        requestElementUpdate();
    }, 100);
    requestElementUpdate();
    logEvent(ev.type);
}

function onDoubleTap(ev) {
    transform.scale = transform.scale === 1 ? 1.5 : 1;
    requestElementUpdate();
    logEvent(ev.type);
}

resetElement();
