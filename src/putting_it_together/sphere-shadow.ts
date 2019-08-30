#!/usr/bin/env node

import {point, Tuple} from '../tuple';
import {Canvas} from '../canvas';
import {Color} from '../color';
import {Ray} from '../ray';
import {intersect, Sphere} from '../sphere';

function saveFile() {
    let fs = require('fs');
// @ts-ignore
    fs.writeFile('./ppm/sphere-shadow.ppm', Canvas.canvas_to_ppm(c).join('\n'), function (err) {
        if (err) {
            return console.error(err);
        }
        console.log('File created!');
    });
}

const COLOR = new Color(1, 0, 0);

const wall_z = 10;
const wall_size = 8;
const canvas_pixels = 800;

const pixel_size = wall_size / canvas_pixels;

const ray_origin = point(0, 0, -5);
const half = wall_size / 2;

const c = new Canvas(canvas_pixels, canvas_pixels);

const s = new Sphere();

for (let y = 0; y < c.height; ++y) {
    const world_y = half - pixel_size * y;
    for (let x = 0; x < c.width; ++x) {
        const world_x = -half + pixel_size * x;
        const position = point(world_x, world_y, wall_z);
        const r = new Ray(ray_origin, Tuple.normalize(Tuple.subtract(position, ray_origin)));
        intersect(s, r).forEach(i => Canvas.write_pixel(c, x, y, COLOR));
    }
}

saveFile();
