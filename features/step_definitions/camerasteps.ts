import {binding, given, then, when} from 'cucumber-tsflow';
import {parseArg, Workspace} from './Workspace';
import {Camera} from "../../src/camera";
import {expect} from 'chai';

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

}

export = CameraSteps;