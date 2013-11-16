# slider

An input slider built with
[c8](https://github.com/component/component) (Component.js)


## Installation

    component install dominicbarnes/slider


## Example

````javascript
var slider = require("slider");

slider("#root")
    .min(1)
    .max(10)
    .handle(5); // required to be called at least once manually
````


## API

### Slider(el) *constructor*

Creates a new instance, takes a root `HTMLElement` or a CSS selector `String`
as it's only argument. Use the fluent API to perform additional configuration.

### Slider#min(min)

Sets the minimum value for the slider (i.e. the left-bound)

### Slider#max(max)

Sets the maximum value for the slider (i.e. the right-bound)

### Slider#step(step)

Sets the increment/decrement value for the slider

### Slider#value()

Gets the value/s for this slider's handles. If there is a single handle,
it will return a single `Number`, otherwise it will return an `Array` of
`Number` values.

### Slider#handle(value)

Creates a new handle for the slider.

If a `Number` is passed, then a "simple" configuration is done to set the value
of the handle.

If a `Function` is passed, then the new handle object is passed as the only
argument, allow "advanced" configuration to be performed.

**NOTE:** this is not called automatically called, so you must call it yourself
for each handle you need.

### Slider#width()

Returns the width of the slider element.


## Events

### dragstart (handle)

Emitted when a handle is about to be dragged

### drag (handle)

Emitted during the drag of a handle

### dragend (handle)

Emitted when a handle is no longer being dragged

### change

Emitted when the value of either handle is changed during either keyboard input
or when a drag is ended
