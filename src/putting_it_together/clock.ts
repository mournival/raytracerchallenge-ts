#!/usr/bin/env node

import {point} from '../tuple';
import {Canvas} from '../canvas';
import {Color} from '../color';
import {Matrix, rotation_z, scaling, translation} from '../matrix';
import * as fs from 'fs';

const COLOR = new Color(1, 1, 1);

const c = new Canvas(1200, 1200);

const scaledTranslation = Matrix.multiply(
    translation(c.width / 2, c.width / 2, 0),
    scaling(c.width / 3, c.width / 3, 0));

function clock(dots: number, dotSize: number) {
    const slice = 2 * Math.PI / dots;

    for (let i = 0; i < dots; ++i) {
        const p = Matrix.multiplyVector(
            Matrix.multiply(
                scaledTranslation,
                rotation_z(slice * i))
            , point(0, 1, 0));

        for (let rOffset = 0; rOffset < dotSize; ++rOffset) {
            for (let cOffset = 0; cOffset < dotSize; ++cOffset) {
                const xPos = Math.round(p.x - dotSize / 2) + rOffset;
                const yPos = Math.round(p.y - dotSize / 2) + cOffset;
                c.colors[xPos][yPos] = COLOR;
            }
        }
    }
}

function axes() {
    const p = c.width / 2;
    for (let n = 0; n < c.width; ++n) {
        c.colors[n][p] = COLOR;
        c.colors[p][n] = COLOR;
    }
}

function saveFile() {
    fs.writeFile('./ppm/clock.ppm', Canvas.canvas_to_ppm(c).join('\n'), function (err) {
        if (err) {
            return console.error(err);
        }
        console.log('File created!');
    });
}

axes();
clock(12, 16);
clock(60, 4);
saveFile();

