import {StepDefinitions} from 'jest-cucumber';
import {CameraArray, NumberArray} from "../types";
import {Camera} from "../../../src/camera";
import {Matrix, rotation_y, translation, view_transform} from "../../../src/matrix";
import {Color} from "../../../src/color";
import {parseArg} from "../../../src/util";
import {canvases, rays, tuples, worlds} from "../steps";

export let cameras: CameraArray

export const cameraSteps: StepDefinitions = ({given, when, then}) => {
    let numbers: NumberArray;

    beforeAll(() => {
        cameras = {}
    })

    beforeEach(() => {
        numbers = {}
    })

    given(/^(\w+) ← ([-+]?[0-9π]*[./]?[0-9]+)$/, (key: string, value: string) => {
        numbers[key] = parseArg(value);
    })

    when(/^(\w+) ← camera\(([\w_]+), ([\w_]+), ([\w_]+)\)$/, (key: string, hsize: string, vsize: string, fov: string) => {
        cameras[key] = new Camera(numbers[hsize], numbers[vsize], numbers[fov]);
    })

    when(/^(\w+) ← camera\((\d+), (\d+), ([^,]+)\)$/, (key: string, hsize: string, vsize: string, fov: string) => {
        cameras[key] = new Camera(parseArg(hsize), parseArg(vsize), parseArg(fov));
    })

    when(/^(\w+) ← ray_for_pixel\(([^,]+), ([^,]+), ([^,]+)\)$/, (rayId: string, cameraId: string, px: string, py: string) => {
        rays[rayId] = cameras[cameraId].ray_for_pixel(parseArg(px), parseArg(py));
    })

    when(/^(\w+).transform ← rotation_y\(([^,]+)\) \* translation\(([^,]+), ([^,]+), ([^,]+)\)$/, (cameraId: string, theta: string, x: string, y: string, z: string) => {
        const t = Matrix.multiply(rotation_y(parseArg(theta)), translation(parseArg(x), parseArg(y), parseArg(z)));
        const c = cameras[cameraId];
        cameras[cameraId] = new Camera(c.hsize, c.vsize, c.field_of_view, t);
    })

    when(/^(\w+).transform ← view_transform\(([^,]+), ([^,]+), ([^,]+)\)$/, (cameraId: string, from: string, to: string, up: string) => {
        const t = view_transform(tuples[from], tuples[to], tuples[up]);
        const c = cameras[cameraId];
        cameras[cameraId] = new Camera(c.hsize, c.vsize, c.field_of_view, t);
    })

    when(/^(\w+) ← render\(([^,]+), ([^,]+)\)$/, (key: string, cameraId: string, worldId: string) => {
        const c = cameras[cameraId];
        const w = worlds[worldId];
        canvases[key] = c.render(w);
    })

    then(/^(\w+).hsize = ([-+]?[0-9π]*[./]?[0-9]+)$/, (key: string, value: string) => {
        expect(cameras[key].hsize).toBeCloseTo(parseArg(value), 0.0001);
    })

    then(/^(\w+).vsize = ([-+]?[0-9π]*[./]?[0-9]+)$/, (key: string, value: string) => {
        expect(cameras[key].vsize).toBeCloseTo(parseArg(value), 0.0001);
    })

    then(/^(\w+).field_of_view = ([-+]?[0-9π]*[./]?[0-9]+)$/, (key: string, value: string) => {
        expect(cameras[key].field_of_view).toBeCloseTo(parseArg(value), 0.0001);
    })

    then(/^(\w+).pixel_size = ([-+]?[0-9π]*[./]?[0-9]+)$/, (key: string, value: string) => {
        expect(cameras[key].pixel_size).toBeCloseTo(parseArg(value), 0.0001);
    })

    then(/^pixel_at\((\w+), ([^,]+), ([^,]+)\) = color\(([^,]+), ([^,]+), ([^,]+)\)$/, (canvasId: string, x: string, y: string, r: string, g: string, b: string) => {
        const image = canvases[canvasId];
        const actual = image.colors[parseArg(x)][parseArg(y)];
        const expected = new Color(parseArg(r), parseArg(g), parseArg(b));
        expect(Color.equals(actual, expected)).toBeTruthy()
    })
}