//Verificar se preencheu todos os campos
//Verificar se colocou @ no email
var d = new Date().getTime();
console.log(`d: ${d}`);

var t0 = performance.now() * 1000;
r = (d + t0)%16 | 0;
console.log(r);

const str = "abc's test#s";
console.log(str.replace(/[^a-zA-Z ]/g, "")); 
// isso é um match dos caracteres 'a' até o 'z', 'A' até o 'Z'
//^ indicando o início de uma string e indica que ocorrera o replace apenas em caracteres diferentes do que estão sendo indicado dentro das []