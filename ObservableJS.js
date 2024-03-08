"use strict";

class Callable extends Function {
    constructor(handler) {
        super();
        return new Proxy(this, {
            apply: (target, thisArg, args) => {
                return target.invoke.apply(thisArg || target, args)
            },
            ...(handler || {}),
        });
    }

    invoke() {
    }
}

class Observable extends Callable {
    $nodes = {};
    $value;
    get $isObject() {
        return typeof this.$value === 'object';
    }
    get value() {
        if (this.$isObject) {
            return this.$nodes;
        }
        return this.$value;
    }
    set value(v) {
        const resp = (this.$value = v);
        this.clearNodes();
        this.appendNodes(resp);
        return resp;
    }

    invoke() {
        if (arguments.length > 0) {
            const input = arguments[0];
            const prevValue = this.value;
            const value = typeof input === 'function' ? input(prevValue) : input;
            return (this.value = value);
        }
        return this.value;
    }

    clearNodes() {
        this.$nodes = {};
    }
    appendNodes(value) {
        if (!this.$isObject) return;
        for (let k in value) {
            this.$nodes[k] = new Observable(value[k], this);
        }
    }

    constructor(value, parent) {
        super({
            get(target, p, receiver) {
                if (p in target) return target[p];
                if (target.$isObject && p in target.$nodes) return target.$nodes[p];
                // console.log(target, p, receiver);
            },
            set(target, p, newValue, receiver) {
                if (p in target) return (target.value = newValue);
                if (target.$isObject) {
                    return target.$nodes[p] = new Observable(newValue, target);
                }
                // console.log(target, p, newValue, receiver);
            },
        });
        this.value = value;
    }
}
