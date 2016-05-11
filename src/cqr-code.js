'use strict';

(function(definition) {
	if (typeof define === 'function' && define.amd) {
		define(['cQRCode'], definition);
	} else if (typeof module === 'object' && module.exports) {
		var cQRCode = require('cqrjs');
		module.exports = definition(cQRCode);
	} else {
		definition(window.cQRCode);
	}
})(function(cQRCode) {
//
// Prototype
//
var proto = Object.create(HTMLElement.prototype, {
    //
    // Attributes
    //
    attrs: {
        value: {
            data: null,
            format: 'png',
            modulesize: 5,
            margin: 4,
						layer: 3
        }
    },
    defineAttributes: {
        value: function () {
            var attrs = Object.keys(this.attrs),
                attr;
            for (var i=0; i<attrs.length; i++) {
                attr = attrs[i];
                (function (attr) {
                    Object.defineProperty(this, attr, {
                        get: function () {
                            var value = this.getAttribute(attr);
                            return value === null ? this.attrs[attr] : value;
                        },
                        set: function (value) {
                            this.setAttribute(attr, value);
                        }
                    });
                }.bind(this))(attr);
            }
        }
    },
    //
    // LifeCycle Callbacks
    //
    createdCallback: {
        value: function () {
            this.createShadowRoot();
            this.defineAttributes();
            this.generate();
        }
    },
    attributeChangedCallback: {
        value: function (attrName, oldVal, newVal) {
            var fn = this[attrName+'Changed'];
            if (fn && typeof fn === 'function') {
                fn.call(this, oldVal, newVal);
            }
            this.generate();
        }
    },
    //
    // Methods
    //
    getOptions: {
    	value: function () {
            var modulesize = this.modulesize,
                margin = this.margin;
            return {
                modulesize: modulesize !== null ? parseInt(modulesize) : modulesize,
                margin: margin !== null ? parseInt(margin) : margin
            };
    	}
    },
    generate: {
        value: function () {
            if (this.data !== null) {
                if (this.format === 'png') {
                    this.generatePNG();
                }
								else if (this.format === 'pngd') {
                    this.generatePNGD();
                }
								else if (this.format === 'svg') {
                    this.generateSVG();
                }
								else if (this.format === 'svgd') {
                    this.generateSVGD();
                }
                else {
                    this.shadowRoot.innerHTML = '<div>cqr-code: '+ this.format +' not supported!</div>'
                }
            }
            else {
                this.shadowRoot.innerHTML = '<div>cqr-code: no data!</div>'
            }
        }
    },
    generatePNG: {
        value: function () {
					try {
							var img = document.createElement('img');
							img.src = cQRCode.generatePNG(this.data, this.layer, this.getOptions());
							this.clear();
							this.shadowRoot.appendChild(img);
					}
					catch (e) {
							console.log(e);
							this.shadowRoot.innerHTML = '<div>cqr-code: no canvas support!</div>'
					}
        }
    },
		generatePNGD: {
        value: function () {
					try {
							var _this = this;
							this.clear();
							var codes = cQRCode.generatePNGD(this.data, this.layer, true, this.getOptions());
							codes.forEach(function(code){
								var img = document.createElement('img');
								img.src = code;
								_this.shadowRoot.appendChild(img);
							});

					}
					catch (e) {
							console.log(e);
							this.shadowRoot.innerHTML = '<div>cqr-code: no canvas support!</div>'
					}
        }
    },
		generateSVG: {
        value: function () {
					try {
							this.clear();
							this.shadowRoot.appendChild(cQRCode.generateSVG(this.data, this.layer, this.getOptions()));
					}
					catch (e) {
							console.log(e);
							this.shadowRoot.innerHTML = '<div>cqr-code: no canvas support!</div>'
					}
        }
    },
		generateSVGD: {
        value: function () {
					try {
							var _this = this;
							this.clear();
							var codes = cQRCode.generateSVGD(this.data, this.layer, true, this.getOptions());
							codes.forEach(function(code){
								_this.shadowRoot.appendChild(code);
							});

					}
					catch (e) {
							console.log(e);
							this.shadowRoot.innerHTML = '<div>cqr-code: no canvas support!</div>'
					}
        }
    },
    clear: {
        value: function () {
            while (this.shadowRoot.lastChild) {
                this.shadowRoot.removeChild(this.shadowRoot.lastChild);
            }
        }
    }
});
//
// Register
//
document.registerElement('cqr-code', {
    prototype: proto
});
});
