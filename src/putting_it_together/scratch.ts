
let r = '255 204 153 255 204 153 255 204 153 255 204 153 255 204 153 255 204 153 255 204 153 255 204 153 255 204 153 255 204 153';

let strings = r.split(' ');

while(strings.length > 0) {
    console.log(strings.slice(0, 17). join(' '));
    strings = strings.slice(16);
    console.log(strings);
}