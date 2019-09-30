// let r = '255 204 153 255 204 153 255 204 153 255 204 153 255 204 153 255 204 153 255 204 153 255 204 153 255 204 153 255 204 153';
//
// let strings = r.split(' ');
//
// while(strings.length > 0) {
//     console.log(strings.slice(0, 17). join(' '));
//     strings = strings.slice(16);
//     console.log(strings);
// }


const xs: string[][] = [['a', 'b'], ['c', 'd']];

const x = xs.flatMap(a => a);
console.log(JSON.stringify(x));

// world:
// {"lights":[{"position":{"x":-10,"y":10,"z":-10,"w":1},"intensity":{"red":1,"green":1,"blue":1}}],"objects":[
// {"transform":{"data":[[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]]},"material":{"color":{"red":0.8,"green":1,"blue":0.6},"ambient":0.1,"diffuse":0.7,"specular":0.2,"shininess":200,"reflective":0,"transparency":0,"refractive_index":1,"pattern":null}},
// {"transform":{"data":[[0.5,0,0,0],[0,0.5,0,0],[0,0,0.5,0],[0,0,0,1]]},"material":{"color":{"red":1,"green":1,"blue":1},"ambient":0.1,"diffuse":0.9,"specular":0.9,"shininess":200,"reflective":0,"transparency":0,"refractive_index":1,"pattern":null}}]}
// {"transform":{"data":[[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]]},"material":{"color":{"red":1,"green":1,"blue":1},"ambient":0.1,"diffuse":0.9,"specular":0.9,"shininess":200,"reflective":0,"transparency":0,"refractive_index":1,"pattern":null}}