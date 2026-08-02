//synchroniczny
console.log("1");
console.log("2 \n");

//asynchroniczny
setTimeout(function () {
  console.log("A");
}, 3000);

console.log("B");
