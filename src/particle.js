#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tuple_1 = require("./tuple");
var canvas_1 = require("./canvas");
var color_1 = require("./color");
var Particle = /** @class */ (function () {
    function Particle(position, velocity) {
        this.position = position;
        this.velocity = velocity;
    }
    return Particle;
}());
var Environment = /** @class */ (function () {
    function Environment(gravity, wind) {
        this.gravity = gravity;
        this.wind = wind;
    }
    return Environment;
}());
function tick(env, particle) {
    var p0 = particle.position;
    var v0 = particle.velocity;
    var p1 = tuple_1.Tuple.add(p0, v0);
    var v1 = tuple_1.Tuple.add(tuple_1.Tuple.add(v0, env.gravity), env.wind);
    return new Particle(p1, v1);
}
var fs = require('fs');
var p = new Particle(tuple_1.point(0, 1, 0), tuple_1.Tuple.multiply(tuple_1.Tuple.normalize(tuple_1.vector(1, 1.8, 0)), 11.25));
var e = new Environment(tuple_1.vector(0, -0.1, 0), tuple_1.vector(-0.01, 0, 0));
var c = new canvas_1.Canvas(900, 550);
var COLOR = new color_1.Color(1, 1, 1);
while (p.position.y > 0) {
    // console.log(JSON.stringify(p));
    canvas_1.Canvas.write_pixel(c, 550 - Math.round(p.position.y), Math.round(p.position.x), COLOR);
    p = tick(e, p);
}
// @ts-ignore
fs.writeFile('./ppm/file.ppm', canvas_1.Canvas.canvas_to_ppm(c).join('\n'), function (err) {
    if (err) {
        return console.error(err);
    }
    console.log("File created!");
});
//# sourceMappingURL=particle.js.map