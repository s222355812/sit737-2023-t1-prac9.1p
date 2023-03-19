//Activity 1
console.log('Hello World')

//Activity 2
var log= function(msg){
    console.log("[log]:", msg)
}
log("hello");
log("welcome")

//Activity 3
var async = function()
{
    setTimeout(function(){log("this is new sentence")},3300);
}
var adder= function(a,b){
    var sum=a+b;
    return sum;
}
var log= function(msg){
    console.log("[log]:",msg);
}
log("sum is "+adder(7,8))
async()

