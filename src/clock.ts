#!/usr/bin/env node

import {point, Tuple} from "./tuple";
import {Canvas} from "./canvas";
import {Color} from "./color";
import {Matrix, rotation_z, scaling, translation} from "./matrix";

class Clock {
    constructor(
        public readonly   center: Tuple,
        public readonly   radius: number
    ) {
    }
}

const COLOR = new Color(1, 1, 1);

let c = new Canvas(1200, 1200);

let p_0 = point(600, 600, 0);
const PiOver6 = Math.PI / 6;
for (let i = 0; i < 12; ++i) {
    const p = Matrix.multiplyVector(
        Matrix.multiply(
            translation(c.width / 2, c.width / 2, 0),
            Matrix.multiply(
                scaling(c.width / 3, c.width / 3, 0),
                rotation_z(PiOver6 * i)))
        , point(0, 1, 0));
    // console.log(JSON.stringify(p));

    const dotSize = 16;

    for (let rOffset = 0; rOffset < dotSize; ++rOffset) {
        for (let cOffset = 0; cOffset < dotSize; ++cOffset) {
            const xPos = Math.round(p.x - dotSize / 2) + rOffset;
            const yPos = Math.round(p.y - dotSize / 2) + cOffset;
            c.colors[xPos][yPos] = COLOR;
        }
    }
}

let p = c.width / 2;
for (let n = 0; n < c.width; ++n) {
    c.colors[n][p] = COLOR;
    c.colors[p][n] = COLOR;
}

let fs = require('fs');
// @ts-ignore
fs.writeFile('./ppm/clock.ppm', Canvas.canvas_to_ppm(c).join('\n'), function (err) {
    if (err) {
        return console.error(err);
    }
    console.log("File created!");
});

