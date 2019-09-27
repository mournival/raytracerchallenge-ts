#!/usr/bin/env node

import {point, vector} from '../tuple';
import {Canvas} from '../canvas';
import {Color} from '../color';
import {Sphere} from '../sphere';
import {Matrix, rotation_x, rotation_y, rotation_z, scaling, translation, view_transform} from '../matrix';
import {Material} from '../material';
import {Light} from '../light';
import {World} from '../world';
import {Camera, render} from '../camera';
import {Plane} from '../plane';
import {checkers_pattern, gradient_pattern, stripe_pattern} from '../pattern';

function saveFile(canvas: any) {
    let fs = require('fs');
    // @ts-ignore
    fs.writeFile('./ppm/ray-tracer3.ppm', Canvas.canvas_to_ppm(canvas).join('\n'), function (err) {
        if (err) {
            return console.error(err);
        }
        console.log('File created!');
    });
}

const s1 = scaling(10, 0.01, 10);
const quarterPi = Math.PI / 4;
const floor = new Plane(
    Matrix.identity()
    , new Material(
        new Color(1, 0.9, 0.9),
        0.1, 0.9, 0, 200, checkers_pattern(Color.BLACK, Color.WHITE)
    ),
);

const left_wall = new Plane(
    Matrix.multiply(translation(0, 0, 5),
        Matrix.multiply(rotation_y(-quarterPi), rotation_x(2 * quarterPi))
    ), floor.material.replace('pattern', stripe_pattern(Color.BLACK, Color.WHITE))
);

const right_wall = new Plane(
    Matrix.multiply(translation(0, 0, 5),
        Matrix.multiply(rotation_y(quarterPi),
            rotation_x(2 * quarterPi),
        )
    ), floor.material.replace('pattern', gradient_pattern(Color.BLACK, Color.WHITE))
);

const ceiling = new Plane(
    Matrix.multiply(translation(0, 15, 0), rotation_z(-quarterPi)),
    floor.material.replace('pattern', checkers_pattern(Color.BLACK, Color.WHITE))
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
        ceiling,
        middle,
        right,
        left
    ]);

const camera = new Camera(1920 / 4, 1080 / 4, Math.PI / 3,
    view_transform(
        point(0, 1.0, -7),
        point(0, 1, 0),
        vector(0, 1, 0)
    )
);

console.time('Rendering');
const canvas = render(camera, world);
console.timeEnd('Rendering');

saveFile(canvas);
