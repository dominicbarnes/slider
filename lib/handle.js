// module dependencies
var classes = require("classes"),
    domify = require("domify"),
    events = require("events"),
    keyname = require("keyname"),
    mouse = require("mouse"),
    translate = require("translate"),
    template = require("./handle.html");

// single export
module.exports = Handle;

/**
 * Represents a slider handle
 *
 * @constructor
 * @param {Slider} slider
 */
function Handle(slider) {
    if (!(this instanceof Handle)) {
        return new Handle(slider);
    }

    this.slider = slider;
    this.element = domify(template);
    this.dragHandle = this.element.children[0];
    this.classes = classes(this.element);
    this.events = events(this.element, this);
    this.events.bind("keydown");
    this.mouse = mouse(this.element, this).bind();
    this._position = 0;

    slider.track.appendChild(this.element);
}


// event handlers

/**
 * Initializes a drag "session"
 *
 * @param {Event} e
 */
Handle.prototype.onmousedown = function (e) {
    e.preventDefault(); // stops text from being selected

    this.start = e.clientX;
    this.classes.add("dragging");
    classes(document.body).add("dragging");
    this.slider.emit("dragstart", this);
};

/**
 * Updates the handle elements during drag "session"
 *
 * @param {Event} e
 */
Handle.prototype.onmousemove = function (e) {
    var pos = e.clientX - this.slider.track.getBoundingClientRect().left;
    this.value(this.position2value(pos));

    this.slider
        ._updateRange()
        .emit("drag", this);
};

/**
 * Ends the drag "session"
 *
 * @param {Event} e
 */
Handle.prototype.onmouseup = function (e) {
    this.classes.remove("dragging");
    classes(document.body).remove("dragging");

    this.slider
        .emit("dragend", this)
        ._updateRange()
        .emit("change");
};

/**
 * Handles keyboard input
 *
 * @param {Event} e
 */
Handle.prototype.onkeydown = function (e) {
    switch (keyname(e.keyCode)) {
    case "left":
        this.stepDown();
        break;

    case "right":
        this.stepUp();
        break;

    case "home":
        this.value(this.slider._min);
        break;

    case "end":
        this.value(this.slider._max);
        break;

    default:
        return;
    }

    this.slider._updateRange().emit("change");
};


// conversion methods

/**
 * Converts an x-coordinate into the corresponding value
 *
 * @param {Number} position
 * @returns {Number}
 */
Handle.prototype.position2value = function (position) {
    var s = this.slider,
        val = (position / (s.width() - this.width())) * (s._max - s._min) + s._min;

    return this.snapValue(val);
};

/**
 * Converts a value into an x-coordinate
 *
 * @param {Number} value
 * @returns {Number}
 */
Handle.prototype.value2position = function (value) {
    var s = this.slider,
        val = this.snapValue(value);

    return ((val - s._min) / (s._max - s._min)) * (s.width() - this.width());
};

/**
 * Takes a value and "rounds" it to the nearest valid value (corresponding to
 * the min, max and step configuration)
 *
 * @param {Number} value
 * @returns {Number}
 */
Handle.prototype.snapValue = function (value) {
    var slider = this.slider,
        step = slider._step,
        mod = value % step,
        val = value - mod;

    if (Math.abs(mod) * 2 >= step) {
        val += (mod > 0) ? step : (-step);
    }

    val = parseFloat(val.toFixed(5));

    if (val > slider._max)      return slider._max;
    else if (val < slider._min) return slider._min;
    else                        return val;
};


// configuration methods

/**
 * Returns the width of the handle element
 *
 * @returns {Number}
 */
Handle.prototype.width = function () {
    return this.element.clientWidth;
};

/**
 * Get the position of the handle element
 *
 * @returns {Number}
 */
Handle.prototype.position = function () {
    return this._position;
};

/**
 * Moves the slider element to the specified position
 *
 * @param {Number} position
 * @returns {Handle}
 */
Handle.prototype.moveTo = function (position) {
    this._position = position;
    translate(this.element, position, 0);
    return this;
};

/**
 * Get or set the value of this handle
 *
 * @param {Number} [value]
 * @returns {Handle|Number}
 */
Handle.prototype.value = function (value) {
    if (typeof value === "undefined") {
        return this.position2value(this.position());
    } else {
        var slider = this.slider;

        if (slider._handles && slider._handles.length === 2) {
            left = slider._handles[0];
            right = slider._handles[1];

            if (this === right && value < left.value()) {
                value = left.value();
            } else if (this === left && value > right.value()) {
                value = right.value();
            }
        }

        return this.moveTo(this.value2position(value));
    }
};

/**
 * Increment this handle up a step
 *
 * @returns {Handle}
 */
Handle.prototype.stepUp = function () {
    return this.value(this.value() + this.slider._step);
};

/**
 * Decrement this handle up a step
 *
 * @returns {Handle}
 */
Handle.prototype.stepDown = function () {
    return this.value(this.value() - this.slider._step);
};
