function Callable(fn) {
    console.log("Callable::", this);
    return fn;
}

class CallableClass extends Callable {
    prop1 = "hallo";

    constructor(val1) {
        // NOTE: super fn param must be arrow fn to preserve this 
        super((arg1) => {
            console.log("CallableClass::call:", arg1, val1, this);
        });
        console.log("CallableClass::ctor:", val1, this);
    }
}

console.log("---start---");
var x1 = new CallableClass('value1');
console.log("---mid---");
x1(1);
x1(2);
x1(3);
console.log("---end---");
