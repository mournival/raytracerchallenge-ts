#!/usr/bin/env node

import {point, vector} from '../tuple';
import {Canvas} from '../canvas';
import {Color} from '../color';
import {rotation_x, rotation_y, scaling, translation, view_transform} from '../matrix';
import {Material} from '../material';
import {World} from '../world';
import {Camera} from '../camera';
import {Cone, Plane} from '../shapes';
import {checkers_pattern, combine_pattern, gradient_pattern} from '../pattern';
import {Light} from '../light';
import * as fs from 'fs';

function saveFile(canvas: Canvas) {
    fs.writeFile('./ppm/cone.ppm', Canvas.canvas_to_ppm(canvas).join('\n'), function (err) {
        if (err) {
            return console.error(err);
        }
        console.log('File created!');
    });
}

const quarterPi = Math.PI / 4;

const reflectiveCheckers = new Material(new Color(.67, 0.67, 0.67), 0.1, 0.9, 0, 200, 0, 0, 1).replace('reflective', 0.25).replace('pattern',
    combine_pattern(
        gradient_pattern(new Color(0.33, 0.33, 0.33), new Color(0.66, 0.66, 0.66), rotation_y(Math.PI / 2)),
        checkers_pattern(new Color(0.66, 0.66, 0.66), new Color(0.33, 0.33, 0.33), scaling(0.2, 0.2, 0.2))
    )
);

const floor = new Plane(
    translation(0, -2, 0)
    , reflectiveCheckers,
);

const cone = new Cone(
    rotation_x(-quarterPi / 2),
    new Material(Color.RED, 0.2, 0.9, 1, 200)
    , -2, 2, true
);

const world = new World([
        new Light(point(-10, 10, -10), new Color(0.25, 0.5, 0.25)),
        new Light(point(10, 10, -10), new Color(0.50, 0.25, 0.5))
    ],
    [
        floor,
        // left_wall,
        // right_wall,
        // ceiling,
        cone,
    ]);

const camera = new Camera(Math.floor(3200 / 16), Math.floor(2400 / 16), Math.PI / 4,
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
