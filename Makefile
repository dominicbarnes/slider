NPM_BIN = ./node_modules/.bin/
C8 ?= $(NPM_BIN)component
LESS ?= $(NPM_BIN)lessc
SERVE ?= $(NPM_BIN)component-serve

PORT ?= 3000

JS = index.js lib/slider.js lib/handle.js
CSS = style.css
TPL = lib/slider.html lib/handle.html
SRC = $(JS) $(CSS) $(TPL)


all: build

deps: node_modules components

node_modules: package.json
	npm install

components: component.json | node_modules
	$(C8) install --dev

build: components $(SRC)
	$(C8) build --dev

style.css: style.less
	$(LESS) $^ > $@

server: $(SRC) | deps
	rm -rf build/
	$(SERVE) -p $(PORT)

clean:
	rm -rf build/ style.css

clean-deps:
	rm -rf node_modules/ components/


.PHONY: all deps server clean clean-deps
