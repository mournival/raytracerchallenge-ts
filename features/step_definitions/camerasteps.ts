import {binding, given, then, when} from 'cucumber-tsflow';
import {parseArg, shouldEqualMsg, Workspace} from './Workspace';
import {Camera, ray_for_pixel, render} from '../../src/camera';
import {expect} from 'chai';
import {Matrix, rotation_y, translation, view_transform} from '../../src/matrix';
import {Color} from '../../src/color';

@binding([Workspace])
class CameraSteps {

    constructor(protected workspace: Workspace) {
    }


    @given(/^(\w+) ← ([-+]?[0-9π]*[./]?[0-9]+)$/)
    public givenValue(key: string, value: string) {
        this.workspace.numbers[key] = parseArg(value);
    }

    @when(/^(\w+) ← camera\(([\w_]+), ([\w_]+), ([\w_]+)\)$/)
    public whenCamera(key: string, hsize: string, vsize: string, fov: string) {
        this.workspace.cameras[key] = new Camera(
            this.workspace.numbers[hsize],
            this.workspace.numbers[vsize],
            this.workspace.numbers[fov]
        );
    }

    @then(/^(\w+).hsize = ([-+]?[0-9π]*[./]?[0-9]+)$/)
    public thenHSizeEquals(key: string, value: string) {
        const actual = this.workspace.cameras[key].hsize;
        const expected = parseArg(value);

        expect(actual).to.be.closeTo(expected, 0.0001);
    }

    @then(/^(\w+).vsize = ([-+]?[0-9π]*[./]?[0-9]+)$/)
    public thenVSizeEquals(key: string, value: string) {
        const actual = this.workspace.cameras[key].vsize;
        const expected = parseArg(value);

        expect(actual).to.be.closeTo(expected, 0.0001);
    }

    @then(/^(\w+).field_of_view = ([-+]?[0-9π]*[./]?[0-9]+)$/)
    public thenFOVEquals(key: string, value: string) {
        const actual = this.workspace.cameras[key].field_of_view;
        const expected = parseArg(value);

        expect(actual).to.be.closeTo(expected, 0.0001);
    }

    @when(/^(\w+) ← camera\((\d+), (\d+), ([^,]+)\)$/)
    public whenCameraByLiteral(key: string, hsize: string, vsize: string, fov: string) {
        this.workspace.cameras[key] = new Camera(parseArg(hsize), parseArg(vsize), parseArg(fov));
    }

    @then(/^(\w+).pixel_size = ([-+]?[0-9π]*[./]?[0-9]+)$/)
    public thenPixelSizeEquals(key: string, value: string) {
        const actual = this.workspace.cameras[key].pixel_size;
        const expected = parseArg(value);

        expect(actual).to.be.closeTo(expected, 0.0001);
    }

    @when(/^(\w+) ← ray_for_pixel\(([^,]+), ([^,]+), ([^,]+)\)$/)
    public whenRayForPixelIs(rayId: string, cameraId: string, px: string, py: string) {
        this.workspace.rays[rayId] = ray_for_pixel(
            this.workspace.cameras[cameraId],
            parseArg(px),
            parseArg(py)
        );
    }

    @when(/^(\w+).transform ← rotation_y\(([^,]+)\) \* translation\(([^,]+), ([^,]+), ([^,]+)\)$/)
    public whenRotatedTranslationIs(cameraId: string, theta: string, x: string, y: string, z: string) {
        const t = Matrix.multiply(rotation_y(parseArg(theta)), translation(parseArg(x), parseArg(y), parseArg(z)));
        const c = this.workspace.cameras[cameraId];
        this.workspace.cameras[cameraId] = new Camera(c.hsize, c.vsize, c.field_of_view, t);
    }

    @when(/^(\w+).transform ← view_transform\(([^,]+), ([^,]+), ([^,]+)\)$/)
    public whenViewTransformIs(cameraId: string, from: string, to: string, up: string) {
        const t = view_transform(
            this.workspace.tuples[from],
            this.workspace.tuples[to],
            this.workspace.tuples[up]);
        const c = this.workspace.cameras[cameraId];
        this.workspace.cameras[cameraId] = new Camera(c.hsize, c.vsize, c.field_of_view, t);
    }

    @when(/^(\w+) ← render\(([^,]+), ([^,]+)\)$/)
    public whenImageRenderedIs(key: string, cameraId: string, worldId: string) {
        const c = this.workspace.cameras[cameraId];
        const w = this.workspace.worlds[worldId];
        this.workspace.canvases[key] = render(c, w);
    }


    @then(/^pixel_at\((\w+), ([^,]+), ([^,]+)\) = color\(([^,]+), ([^,]+), ([^,]+)\)$/)
    public checkPixelAt(canvasId: string, x: string, y: string, r: string, g: string, b: string) {
        const image = this.workspace.canvases[canvasId];
        const actual = image.colors[parseArg(x)][parseArg(y)];
        const expected = new Color(parseArg(r), parseArg(g), parseArg(b));

        expect(Color.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }

}

export = CameraSteps;