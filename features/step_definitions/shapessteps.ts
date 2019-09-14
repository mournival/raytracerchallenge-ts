import {binding, given, then} from 'cucumber-tsflow';
import {parseArg, shouldEqualMsg, Workspace} from './Workspace';
import {expect} from 'chai';
import {Matrix, translation} from '../../src/matrix';
import {test_shape} from '../../src/shape';

@binding([Workspace])
class ShapeSteps {

    constructor(protected workspace: Workspace) {
    }

    @given(/^([\w\d_]+) ← test_shape\(\)$/)
    public givenTestShape(shapeId: string) {
        this.workspace.shapes[shapeId] = test_shape();
    }

    @then(/^([\w\d_]+).transform = translation\(([^,]+), ([^,]+), ([^,]+)\)$/)
    public thenShapeTransformIs(shapeId: string, x: string, y: string, z: string) {
        const actual = this.workspace.shapes[shapeId].transform;
        const expected = translation(parseArg(x), parseArg(y), parseArg(z));

        expect(Matrix.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }

}

export = ShapeSteps;