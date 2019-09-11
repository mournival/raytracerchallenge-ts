import {binding, given, then, when} from 'cucumber-tsflow';
import {parseArg, Workspace} from './Workspace';
import {Camera, ray_for_pixel} from "../../src/camera";
import {expect} from 'chai';
import {Matrix, rotation_y, translation} from "../../src/matrix";

@binding([Workspace])
class CameraSteps {

    constructor(protected workspace: Workspace) {
    }


    @given(/^(\w+) ← ([-+]?[0-9π]*[\./]?[0-9]+)$/)
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

    @then(/^(\w+).hsize = ([-+]?[0-9π]*[\./]?[0-9]+)$/)
    public thenHSizeEquals(key: string, value: string) {
        const actual = this.workspace.cameras[key].hsize;
        const expected = parseArg(value);

        expect(actual).to.be.closeTo(expected, 0.0001);
    }

    @then(/^(\w+).vsize = ([-+]?[0-9π]*[\./]?[0-9]+)$/)
    public thenVSizeEquals(key: string, value: string) {
        const actual = this.workspace.cameras[key].vsize;
        const expected = parseArg(value);

        expect(actual).to.be.closeTo(expected, 0.0001);
    }

    @then(/^(\w+).field_of_view = ([-+]?[0-9π]*[\./]?[0-9]+)$/)
    public thenFOVEquals(key: string, value: string) {
        const actual = this.workspace.cameras[key].field_of_view;
        const expected = parseArg(value);

        expect(actual).to.be.closeTo(expected, 0.0001);
    }

    @given(/^(\w+) ← camera\((\d+), (\d+), ([^,]+)\)$/)
    public givenCamera(key: string, hsize: string, vsize: string, fov: string) {
        this.workspace.cameras[key] = new Camera(
            parseArg(hsize),
            parseArg(vsize),
            parseArg(fov)
        );
    }

    @then(/^(\w+).pixel_size = ([-+]?[0-9π]*[\./]?[0-9]+)$/)
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

    // c.transform ← rotation_y\(π/4\) \* translation\(0, -2, 5\)
    @when(/^(\w+).transform ← rotation_y\(([^,]+)\) \* translation\(([^,]+), ([^,]+), ([^,]+)\)$/)
    public whenRotatedTranslationIs(cameraId: string, theta: string, x: string, y: string, z: string) {
        const t = Matrix.multiply(rotation_y(parseArg(theta)), translation(parseArg(x), parseArg(y), parseArg(z)));
        const c  = this.workspace.cameras[cameraId];
        this.workspace.cameras[cameraId] = new Camera(c.hsize, c.vsize, c.field_of_view, t);
    }

}

export = CameraSteps;