import {StepDefinitions} from 'jest-cucumber';
import {parseArg} from "../../../src/util";
import {Canvas} from "../../../src/canvas";
import {Color} from "../../../src/color";
import {CanvasArray, PPMArray} from "../types";
import {colors} from "../steps";

export let canvases: CanvasArray;

export const canvasSteps: StepDefinitions = ({given, when, then}) => {

    let ppm: PPMArray = {}

    beforeAll(() => {
        canvases = {}
        ppm = {}
    })
    given(/^([\w\d_]+) ← canvas\(([^,]+), ([^,]+)\)$/, (id: string, x: string, y: string) => {
        canvases[id] = new Canvas(parseArg(x), parseArg(y));
    })

    then(/^(\w+)\.width = ([^,]+)$/, (id: string, value: string) => {
        expect(canvases[id].width).toEqual(parseArg(value));
    })

    then(/^(\w+)\.height = ([^,]+)$/, (id: string, value: string) => {
        expect(canvases[id].height).toEqual(parseArg(value));
    })

    then(/^every pixel of c is color\(0, 0, 0\)$/, () => {
        const canvas = canvases['c'];
        for (let col = canvas.width; col < 10; ++col) {
            for (let row = canvas.height; row < 20; ++row) {
                expect(Color.equals(canvas.colors[row][col], new Color(0, 0, 0))).toBeTruthy()
            }
        }
    })

    then(/^(\w+) has ([^,]+) columns$/, (id: string, value: string) => {
        expect(canvases[id].data[0].length).toEqual(parseArg(value));
    })

    then(/^(\w+) has ([^,]+) rows$/, (id: string, value: string) => {
        expect(canvases[id].data.length).toEqual(parseArg(value));
    })

    when(/^write_pixel\((\w+), ([^,]+), ([^,]+), (\w+)\)$/, (canvasId: string, col: string, row: string, colorId: string) => {
        Canvas.write_pixel(canvases[canvasId], parseArg(row), parseArg(col), colors[colorId] as Color);
    })

    then(/^pixel_at\((\w+), ([^,]+), ([^,]+)\) = (\w+)$/, (canvasId: string, col: string, row: string, colorId: string) => {
        const pixel = canvases[canvasId].colors[parseArg(row)][parseArg(col)];
        expect(Color.equals(pixel, colors[colorId] as Color)).toBeTruthy()
    })

    when(/^([\w\d_]+) ← canvas_to_ppm\((\w+)\)$/, (ppmId: string, canvasId: string) => {
        ppm[ppmId] = Canvas.canvas_to_ppm(canvases[canvasId]);
    })

    then(/^lines ([^,]+)-([^,]+) of (\w+) are$/, (start: string, end: string, ppmID: string, contents: string) => {
        const f = ppm[ppmID];
        const strings = contents.split('\n');
        let j = 0;
        for (let i = parseArg(start) - 1; i < parseArg(end); ++i) {
            expect(f[i]).toEqual(strings[j++]);
        }
    })

    then(/^(\w+) ends with a newline character$/, (ppmId: string) => {
        const f = ppm[ppmId];
        expect(f[f.length - 1]).toEqual('');
    })

    when(/^every pixel of (\w+) is set to color\(([^,]+), ([^,]+), ([^,]+)\)$/, (canvasId: string, red: string, green: string, blue: string) => {
        const color = new Color(parseArg(red), parseArg(green), parseArg(blue));
        const canvas = canvases[canvasId];
        for (let c = 0; c < canvas.width; ++c) {
            for (let r = 0; r < canvas.height; ++r) {
                Canvas.write_pixel(canvas, r, c, color);
            }
        }
    })
}
