import {binding, given, then} from 'cucumber-tsflow';
import {parseArg, shouldEqualMsg, Workspace} from './Workspace';
import {expect} from 'chai';
import {Matrix, translation} from '../../src/matrix';
import {isShape, test_shape} from '../../src/shape';

@binding([Workspace])
class ShapeSteps {

    constructor(protected workspace: Workspace) {
    }

    @given(/^([\w\d_]+) ← test_shape\(\)$/)
    public givenTestShape(shapeId: string) {
        this.workspace.shapes[shapeId] = test_shape();
    }

    @then(/^([\w\d_]+).transform = translation\(([^,]+), ([^,]+), ([^,]+)\)$/)
    public thenShapeTransformIs(objectId: string, x: string, y: string, z: string) {
        const actual = this.workspace.getTransform(objectId);
        const expected = translation(parseArg(x), parseArg(y), parseArg(z));

        expect(Matrix.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }

    @then(/^([\w\d_]+) is a shape$/)
    public thenIsAShape(shapeId: string) {
        // This is trivially true since to be in the store, it need to be a shape
        expect(isShape(this.workspace.shapes[shapeId])).to.be.true;
    }

}

export = ShapeSteps;