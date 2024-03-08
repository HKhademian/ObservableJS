"use strict";


// todo class extends function

class Observable {
    $___value;
    get $isObject() {
        return typeof this.$___value === 'object';
    }
    get value() {
        if (this.$isObject) {
            return { A: 1, B: 2, v: this.$___value };
        }
        return this.$___value;
    }
    set value(v) {
        const prevValue = this.value;
        this.$___value = typeof v === 'function' ? v(prevValue) : v;
    }

    constructor(value) {
        const self = this;
        this.value = value;

        function get_set() {
            if (arguments.length > 0) {
                return self.value = arguments[0];
            }
            return self.value;
        }
        get_set.__proto__ = self;

        return new Proxy(
            Function.bind.call(get_set, this), {
            get(target, p, receiver) {
                if (p in self) return self[p];
            },
            set(target, p, newValue, receiver) {
                if (p in self) return (self.value = newValue);
            }
        });
    }
}



function Observable(value) {
    var isValue = typeof value != 'object';
    var nodes = {};
    function getValue() {
    }
    function setValue(newValue) {
    }

    return function () {
    }
}


function Observable(value, parent = undefined) {
    var isValue = typeof value != 'object';
    var nodes = {};

    function clearNodes() { nodes = {}; }
    function appendNodes() {
        if (isValue) return;
        for (let k in value) {
            nodes[k] = Observable(value[k]);
        }
    }

    function getValue() {
        if (isValue) {
            return value;
        }
        return nodes;
    }
    function setValue(newValue) {
        var oldValue = getValue();
        value = typeof newValue === 'function' ? newValue(oldValue) : newValue;
        isValue = typeof value != 'object';
        clearNodes();
        appendNodes();
    }

    const handler = {
        has: function (target, key) {
            if (isValue) {
                return false;
            }
            return key in nodes;
        },
        get: function (target, key, receiver) {
            if (isValue) {
                // access just by call
                return undefined;
            }
            return nodes[key];
        },
        set: function (target, key, newValue, receiver) {
            if (typeof value != 'object') {
                if (value[key] != undefined) {
                    value[key] = value;
                    return true;
                }
            }
            nodes[key] = Observable(newValue);
            return true;
        },
    };
    return new Proxy(function fn() {
        if (arguments.length > 0) {
            return setValue(arguments[0]);
        }
        return getValue();
    }, handler);
}

var test = Observable(12);
