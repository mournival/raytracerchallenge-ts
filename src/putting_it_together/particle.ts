#!/usr/bin/env node

import {point, Tuple, vector} from "../tuple";
import {Canvas} from "../canvas";
import {Color} from "../color";

class Particle {
    constructor(
        public readonly   position: Tuple,
        public readonly velocity: Tuple) {
    }
}

class Environment {
    constructor(
        public readonly gravity: Tuple,
        public readonly wind: Tuple) {
    }
}

function tick(env: Environment, particle: Particle): Particle {
    const p0 = particle.position;
    const v0 = particle.velocity;

    let p1 = Tuple.add(p0, v0);
    let v1 = Tuple.add(Tuple.add(v0, env.gravity), env.wind);

    return new Particle(p1, v1);
}

let fs = require('fs');

let p = new Particle(point(0, 1, 0), Tuple.multiply(vector(1, 1.8, 0).normalize, 11.25));
const e = new Environment(vector(0, -0.1, 0), vector(-0.01, 0, 0));

let c = new Canvas(900, 550);

const COLOR = new Color(1, 1, 1);

while (p.position.y > 0) {
    // console.log(JSON.stringify(p));

    Canvas.write_pixel(c, 550 - Math.round(p.position.y), Math.round(p.position.x), COLOR);
    p = tick(e, p);
}

// @ts-ignore
fs.writeFile('./ppm/file.ppm', Canvas.canvas_to_ppm(c).join('\n'), function (err) {
    if (err) {
        return console.error(err);
    }
    console.log("File created!");
});

