#!/usr/bin/env node

import {point, vector} from '../tuple';
import {Canvas} from '../canvas';
import {Color} from '../color';
import {Sphere} from '../sphere';
import {Matrix, rotation_x, rotation_y, scaling, translation, view_transform} from '../matrix';
import {Material} from '../material';
import {Light} from '../light';
import {World} from '../world';
import {Camera, render} from '../camera';

function saveFile(canvas: any) {
    let fs = require('fs');
    // @ts-ignore
    fs.writeFile('./ppm/ray-tracer2.ppm', Canvas.canvas_to_ppm(canvas).join('\n'), function (err) {
        if (err) {
            return console.error(err);
        }
        console.log('File created!');
    });
}

const s1 = scaling(10, 0.01, 10);
const quarterPi = Math.PI / 4;
const floor = new Sphere(
    s1
    , new Material(
        new Color(1, 0.9, 0.9),
        0.1, 0.9, 0)
);

const left_wall = new Sphere(
    Matrix.multiply(translation(0, 0, 5),
        Matrix.multiply(rotation_y(-quarterPi),
            Matrix.multiply(rotation_x(2 * quarterPi),
                s1)
        )
    ), floor.material
);

const right_wall = new Sphere(
    Matrix.multiply(translation(0, 0, 5),
        Matrix.multiply(rotation_y(quarterPi),
            Matrix.multiply(rotation_x(2 * quarterPi),
                s1)
        )
    ), floor.material
);

const middle = new Sphere(
    translation(-0.5, 1, 0.5),
    new Material(
        new Color(0.1, 1, 0.5), 0.1, 0.7, 0.3
    )
);

const right = new Sphere(
    Matrix.multiply(translation(1.5, 0.5, -0.5), scaling(0.5, 0.5, 0.5)),
    new Material(
        new Color(0.5, 1, 0.1), 0.1, 0.7, 0.3)
);

const left = new Sphere(
    Matrix.multiply(translation(-1.5, 1 / 3, -0.75), scaling(1 / 3, 1 / 3, 1 / 3)),
    new Material(
        new Color(1, 0.8, 0.1), 0.1, 0.7, 0.3)
);

const world = new World([
        new Light(point(-10, 10, -10), new Color(1, 1, 1))
    ],
    [
        floor,
        left_wall,
        right_wall,
        middle,
        right,
        left
    ]);

const camera = new Camera(1920 / 2, 1080 / 2, Math.PI / 3,
    view_transform(
        point(0, 1.5, -5),
        point(0, 1, 0),
        vector(0, 1, 0)
    )
);

console.time('Rendering');
const canvas = render(camera, world);
console.timeEnd('Rendering');

saveFile(canvas);
