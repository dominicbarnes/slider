// module dependencies
var each = require("each"),
    classes = require("classes"),
    Emitter = require("emitter"),
    isArray = require("isArray"),
    map = require("map"),
    Handle = require("./handle"),
    template = require("./slider.html");

// single export
module.exports = Slider;

/**
 * Represents an input slider
 *
 * @constructor
 * @param {HTMLElement} el
 */
function Slider(el) {
    if (!(this instanceof Slider)) {
        return new Slider(el);
    }

    var slider = this;

    this.element = typeof el === "string" ? document.querySelector(el) : el;
    this.element.innerHTML = template;
    this.classes = classes(this.element).add("slider");

    this.track = this.element.children[0];
    this.range = this.track.children[0];

    this._min = 0;
    this._max = 100;
    this._step = 1;
    this._handles = [];
}


// mixins
Emitter(Slider.prototype);


// configuration methods

/**
 * Sets the minimum value for the slider
 *
 * @param {Number} min
 * @returns {Slider}
 */
Slider.prototype.min = function (min) {
    this._min = min;
    return this;
};

/**
 * Sets the maximum value for the slider
 *
 * @param {Number} max
 * @returns {Slider}
 */
Slider.prototype.max = function (max) {
    this._max = max;
    return this;
};

/**
 * Sets the step value for the slider
 *
 * @param {Number} step
 * @returns {Slider}
 */
Slider.prototype.step = function (step) {
    this._step = step;
    return this;
};

/**
 * Gets the value/s for this slider's handles. If there is a single handle, it
 * will return a single `Number`, otherwise it will return an `Array` of
 * `Number` values.
 *
 * @returns {Number|Array:Number}
 */
Slider.prototype.value = function () {
    var val = map(this._handles, function (handle) {
        return handle.value();
    });

    return val.length === 1 ? val[0] : val;
};

/**
 * Creates and adds a `Handle`.
 *
 * If `value` is a `Number`, the starting value for the handle will be set. If
 * it is a `Function`, the handle will be created and passed into the handler
 * as an argument to perform advanced configuration.
 *
 * @param {Function|Number} value
 * @returns {Slider}
 */
Slider.prototype.handle = function (value) {
    var handle = Handle(this);
    this._handles.push(handle);

    if (typeof value === "function") {
        value(handle);
    } else {
        handle.value(value);
    }

    return this._updateRange();
};

/**
 * Returns the width of the slider element
 *
 * @returns {Number}
 */
Slider.prototype.width = function () {
    return this.element.clientWidth;
};

/**
 * Refreshes the positions of the handles
 *
 * @returns {Slider}
 */
Slider.prototype.refresh = function () {
    each(this._handles, function (handle) {
        handle.refresh();
    });

    return this._updateRange();
};


// private methods

/**
 * Update the positioning of the range element.
 *
 * If there are 2 handles, stretch the range element between those handles.
 * TODO: handle "min" and "max" ranges for a single handle
 *
 * @api private
 * @returns {Slider}
 */
Slider.prototype._updateRange = function () {
    var l = this._handles[0],
        r = this._handles[1],
        range = this.range;

    if (this._handles.length === 2) {
        range.style.left = l.position() + "px";
        range.style.width = (r.position() - l.position() + r.width()) + "px";
    }

    return this;
};
