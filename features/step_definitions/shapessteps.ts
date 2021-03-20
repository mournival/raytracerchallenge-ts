import {binding, given, then, when} from 'cucumber-tsflow';
import {shouldEqualMsg, Workspace} from './Workspace';
import {expect} from 'chai';
import {Matrix, rotation_y, translation} from '../../src/matrix';
import {isShape, test_shape} from '../../src/shapes';
import {point, vector} from '../../src/tuple';
import {parseArg} from '../../src/util';

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

    @then(/^set_transform\((\w+), rotation_y\(([^,]+)\)\)$/)
    public whenSetTransformTranslation(shapeId: string, y: string) {
        const s = this.workspace.shapes[shapeId];
        const t = rotation_y(parseArg(y));
        this.workspace.shapes[shapeId] = s.replace(t);
    }

    @when(/^([\w\d_]+) ← world_to_object\(([\w\d_]+), point\(([^,]+), ([^,]+), ([^,]+)\)\)$/)
    public whenWorldToObjectSpace(pointId: string, shapeId: string, x: string, y: string, z: string) {
        this.workspace.tuples[pointId] =
            this.workspace.shapes[shapeId].world_to_object(point(parseArg(x), parseArg(y), parseArg(z)));
    }

    @when(/^([\w\d_]+) ← normal_to_world\(([\w\d_]+), vector\(([^,]+), ([^,]+), ([^,]+)\)\)$/)
    public whenNormalToSpace(pointId: string, shapeId: string, x: string, y: string, z: string) {
        this.workspace.tuples[pointId] =
            this.workspace.shapes[shapeId].normal_to_world(vector(parseArg(x), parseArg(y), parseArg(z)));
    }

    @then(/^(\w+) shape.equals (\w+)$/)
    public thenShapeEquals(lhsName: string, rhsName: string) {
        const lhs = this.workspace.shapes[lhsName];
        const rhs = this.workspace.shapes[rhsName];
        expect(lhs.equals(rhs)).to.be.true;
    }

    @then(/^(\w+) does not shape.equals (\w+)$/)
    public thenColorsAreNotEqual(lhs: string, rhs: string) {
        expect(this.workspace.shapes[lhs].equals(this.workspace.shapes[rhs])).to.not.be.true;
    }
}

export = ShapeSteps;