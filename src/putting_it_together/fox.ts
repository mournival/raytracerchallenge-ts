#!/usr/bin/env node

import {point, vector} from '../tuple';
import {Canvas} from '../canvas';
import {Color} from '../color';
import {Matrix, rotation_x, rotation_y, rotation_z, scaling, translation, view_transform} from '../matrix';
import {Material} from '../material';
import {World} from '../world';
import {Camera} from '../camera';
import {Plane} from '../shapes';
import {checkers_pattern, combine_pattern, fill_pattern, gradient_pattern} from '../pattern';
import {Light} from '../light';
import {ObjFile} from '../obj_file';

let fs = require('fs');

function saveFile(canvas: any) {
    // @ts-ignore
    fs.writeFile('./ppm/fox.ppm', Canvas.canvas_to_ppm(canvas).join('\n'), function (err) {
        if (err) {
            return console.error(err);
        }
        console.log('File created!');
    });
}

const s1 = scaling(10, 0.01, 10);
const quarterPi = Math.PI / 4;

const defaultMaterial = new Material(new Color(1, 0.9, 0.9), 0.1, 0.9, 0, 200, 0.0, 0, 1, checkers_pattern(Color.BLACK, Color.WHITE));

const reflectiveCheckers = defaultMaterial.replace('reflective', 0.25).replace('pattern',
    combine_pattern(
        gradient_pattern(new Color(0.33, 0.33, 0.33), new Color(0.66, 0.66, 0.66), rotation_y(Math.PI / 2)),
        checkers_pattern(new Color(0.66, 0.66, 0.66), new Color(0.33, 0.33, 0.33), scaling(8, 8, 8))
    )
);

const floor = new Plane(
    translation(0, -0.121749, 0)
    , reflectiveCheckers,
);

const left_wall = new Plane(
    Matrix.multiply(translation(0, 0, 5),
        Matrix.multiply(rotation_y(-quarterPi), rotation_x(2 * quarterPi))
    ), defaultMaterial.replace('pattern', fill_pattern(new Color(0.75, 0.75, 0.75)))
);

const right_wall = new Plane(
    Matrix.multiply(translation(0, 0, 5),
        Matrix.multiply(rotation_y(quarterPi),
            rotation_x(2 * quarterPi),
        )
    ), defaultMaterial.replace('pattern', gradient_pattern(Color.BLACK, Color.WHITE))
);

const ceiling = new Plane(
    Matrix.multiply(translation(0, 15, 0), rotation_z(-quarterPi)),
    defaultMaterial.replace('pattern', checkers_pattern(Color.BLACK, Color.WHITE))
);


const foxFile = new ObjFile(fs.readFileSync('./files/low-poly-fox-by-pixelmannen.obj', 'utf8'));
const foxObj = foxFile.parser.getGroup().replace(rotation_y(Math.PI / 1.5));

const world = new World([
        new Light(point(-10, 10, -100), new Color(.5, .5, .5)),
        new Light(point(0, 100, -100), new Color(.5, .5, .5))

    ],
    [
        floor,
        // left_wall,
        // right_wall,
        // ceiling,
        foxObj
    ]);

const camera = new Camera(Math.floor(3200 / 4), Math.floor(2400 / 4), Math.PI / 3,
    view_transform(
        point(5, 35, -140),
        point(0, 35, 0),
        vector(0, 1, 0)
    )
);


console.time('Rendering');
const canvas = camera.render(world);
console.timeEnd('Rendering');

saveFile(canvas);
