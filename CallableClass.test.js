function Callable(fn) {
    console.log("Callable::", this);
    return function () {
        console.log("Callable::call:", this);
        fn.apply(this, arguments);
    }.bind(this);
}

class CallableClass extends Callable {
    prop1 = "hallo";

    constructor(val1) {
        super(function (arg1) {
            console.log("CallableClass::call:", arg1, val1, this);
            this.test(arg1, val1);
        });
        console.log("CallableClass::ctor:", val1, this);
    }

    test(arg1, val1) {
        console.log("CallableClass::test:", arg1, val1, this);
    }
}

console.log("---start---");
var x1 = new CallableClass('value1');
console.log("---mid---");
x1(1);
x1(2);
x1(3);
console.log("---end---");
