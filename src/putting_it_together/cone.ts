#!/usr/bin/env node

import {point, vector} from '../tuple';
import {Canvas} from '../canvas';
import {Color} from '../color';
import {Matrix, rotation_x, rotation_y, scaling, translation, view_transform} from '../matrix';
import {Material} from '../material';
import {World} from '../world';
import {Camera} from '../camera';
import {Plane} from '../plane';
import {checkers_pattern, combine_pattern, gradient_pattern} from '../pattern';
import {Light} from '../light';
import {Cone} from "../cone";

function saveFile(canvas: any) {
    let fs = require('fs');
    // @ts-ignore
    fs.writeFile('./ppm/cone.ppm', Canvas.canvas_to_ppm(canvas).join('\n'), function (err) {
        if (err) {
            return console.error(err);
        }
        console.log('File created!');
    });
}

const s1 = scaling(10, 0.01, 10);
const quarterPi = Math.PI / 4;

const reflectiveCheckers = new Material(new Color(.67, 0.67, 0.67), 0.1, 0.9, 0, 200, 0.875, 0, 1).replace('reflective', 0.25).replace('pattern',
    combine_pattern(
        gradient_pattern(new Color(0.33, 0.33, 0.33), new Color(0.66, 0.66, 0.66), rotation_y(Math.PI / 2)),
        checkers_pattern(new Color(0.66, 0.66, 0.66), new Color(0.33, 0.33, 0.33), scaling(0.2, 0.2, 0.2))
    )
);

const floor = new Plane(
    translation(0, -2, 0)
    , reflectiveCheckers,
);

const left_wall = new Plane(
    Matrix.multiply(translation(0, 0, 5),
        Matrix.multiply(rotation_y(-quarterPi), rotation_x(2 * quarterPi))
    ), new Material(new Color(.67, 0.16, 0.67), 0.1, 0.9, 0, 200, 0.875, 0, 1));

const right_wall = new Plane(
    Matrix.multiply(translation(0, 0, 5),
        Matrix.multiply(rotation_y(quarterPi),
            rotation_x(2 * quarterPi),
        )
    ), new Material(new Color(.16, 0.67, 0.16), 0.1, 0.9, 0, 200, 0.875, 0, 1));

const middle = new Cone(
   Matrix.identity(),
    new Material((new Color(246, 103, 51).scale(1 / 255)), 0.1, 0.9, 1, 200 ),
    -2, 3, true
);

const world = new World([
        new Light(point(-10, 10, -10), new Color(1, 1, 1))
    ],
    [
        floor,
        left_wall,
        right_wall,
        // ceiling,
        middle,
    ]);

const camera = new Camera(Math.floor(3200 / 8), Math.floor(2400 / 8), Math.PI / 4,
    view_transform(
        point(0, 5, -15),
        point(0, 0, 1),
        vector(0, 1, 0)
    )
);


console.time('Rendering');
const canvas = camera.render(world);
console.timeEnd('Rendering');

saveFile(canvas);
