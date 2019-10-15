import {binding, given, then} from 'cucumber-tsflow';
import {parseArg, shouldEqualMsg, Workspace} from './Workspace';
import {expect} from 'chai';
import {Matrix, translation} from '../../src/matrix';
import {isShape} from '../../src/shape';
import {test_shape} from '../../src/sphere';

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

    @then(/^([\w\d_]+).material.transparency = ([^,]+)$/)
    public thenShapeMaterialTransparencyIs(objectId: string, value: string) {
        const actual = this.workspace.shapes[objectId].material.transparency;
        const expected = parseArg(value);

        expect(actual, shouldEqualMsg(actual, expected)).to.be.closeTo(expected, 0.001);
    }

    @then(/^([\w\d_]+).material.refractive_index = ([^,]+)$/)
    public thenShapeMaterialRefractiveIndexIs(objectId: string, value: string) {
        const actual = this.workspace.shapes[objectId].material.refractive_index;
        const expected = parseArg(value);

        expect(actual, shouldEqualMsg(actual, expected)).to.be.closeTo(expected, 0.001);
    }

    @then(/^([\w\d_]+).parent is nothing$/)
    public thenTestShapeHasNoParent(shapeId: string) {
        expect(this.workspace.shapes[shapeId].parent).to.be.null;
    }
}

export = ShapeSteps;