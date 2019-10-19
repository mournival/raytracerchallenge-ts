import {before, binding, given, then, when} from 'cucumber-tsflow';
import {shouldEqualMsg, Workspace} from './Workspace';
import {expect} from 'chai';
import {glass_sphere, Sphere} from '../../src/sphere';
import {Matrix, rotation_z, scaling, translation} from '../../src/matrix';
import {point, Tuple} from '../../src/tuple';
import {Material} from '../../src/material';
import {parseArg} from '../../src/util';

@binding([Workspace])
class SpheresSteps {

    constructor(protected workspace: Workspace) {
    }

    @before()
    public beforeAllScenarios(): void {
        this.workspace.matrices['identity_matrix'] = Matrix.identity(4);
    }

    @given(/^([\w\d_]+) ← sphere\(\)$/)
    public givenASphere(shapeId: string) {
        this.workspace.shapes[shapeId] = new Sphere();
    }

    @when(/^([\w\d_]+) ← intersect\((\w+), (\w+)\)$/)
    public whenRayIntersectsSphere(interactionId: string, shapeId: string, rayId: string) {
        this.workspace.intersections[interactionId] =
            this.workspace.shapes[shapeId].intersect(
                this.workspace.rays[rayId]
            );
    }

    @then(/^(\w+).count = (\d+)$/)
    public thenIntersectionSize(intersectionsId: string, count: string) {
        const actual = this.workspace.intersections[intersectionsId].length;
        const expected = parseInt(count);
        expect(actual).to.be.equal(expected);
    }

    @then(/^(\w+)\[(\d+)] = ([^,]+)$/)
    public thenIntersectionValue(intersectionsId: string, intersectionIndex: string, value: string) {
        const actual = this.workspace.intersections[intersectionsId][parseInt(intersectionIndex)].t;
        const expected = parseArg(value);

        expect(actual).to.be.closeTo(expected, 0.0001);
    }

    @then(/^(\w+)\[(\d+)].object = ([^,]+)$/)
    public thenIntersectionObject(intersectionsId: string, intersectionIndex: string, objectId: string) {
        const actual = this.workspace.intersections[intersectionsId][parseInt(intersectionIndex)].obj;
        const expected = this.workspace.shapes[objectId];

        expect(actual).to.be.equal(expected);
    }

    @then(/^(\w+).transform = ([^,]+)$/)
    public thenSphereTransform(objectId: string, mId: string) {
        const actual = this.workspace.getTransform(objectId);
        const expected = this.workspace.matrices[mId];

        expect(Matrix.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }

    @then(/^set_transform\((\w+), (\w+)\)$/)
    public whenSetTransform(shapeId: string, matrixId: string) {
        const t = this.workspace.matrices[matrixId];
        this.workspace.shapes[shapeId] = new Sphere(t);
    }

    @then(/^set_transform\((\w+), scaling\(([^,]+), ([^,]+), ([^,]+)\)\)$/)
    public whenSetTransformScaling(shapeId: string, x: string, y: string, z: string) {
        const s = this.workspace.shapes[shapeId];
        const t = scaling(parseArg(x), parseArg(y), parseArg(z));
        this.workspace.shapes[shapeId] = s.replace(t);
    }

    @then(/^(\w+)\[(\d+)].t = ([^,]+)$/)
    public thenIntersectionT(intersectionsId: string, intersectionIndex: string, value: string) {
        const actual = this.workspace.intersections[intersectionsId][parseInt(intersectionIndex)].t;
        const expected = parseArg(value);
        expect(actual).to.be.closeTo(expected, 0.0001);
    }

    @then(/^set_transform\((\w+), translation\(([^,]+), ([^,]+), ([^,]+)\)\)$/)
    public whenSetTransformTranslation(shapeId: string, x: string, y: string, z: string) {
        const s = this.workspace.shapes[shapeId];
        const t = translation(parseArg(x), parseArg(y), parseArg(z));
        this.workspace.shapes[shapeId] = s.replace(t);
    }

    @when(/^([\w\d_]+) ← normal_at\((\w+), point\(([^,]+), ([^,]+), ([^,]+)\)\)$/)
    public whenNormalAt(normalId: string, shapeId: string, x: string, y: string, z: string) {
        this.workspace.tuples[normalId] = this.workspace.shapes[shapeId].normal_at(
            point(parseArg(x), parseArg(y), parseArg(z))
        );
    }

    @then(/^([^,]+) = normalize\((\w+)\)$/)
    public givensRotationX(lhsId: string, nId: string) {
        const actual = this.workspace.tuples[lhsId];
        const expected = this.workspace.tuples[nId].normalize;
        expect(Tuple.equals(actual, expected)).to.be.true;
    }

    @given(/^([\w\d_]+) ← scaling\(([^,]+), ([^,]+), ([^,]+)\) \* rotation_z\(([^,]+)\)$/)
    public givensScaling(tId: string, x: string, y: string, z: string, rot: string) {
        this.workspace.matrices[tId] = Matrix.multiply(
            scaling(parseArg(x), parseArg(y), parseArg(z)),
            rotation_z(parseArg(rot)));
    }

    @when(/^([\w\d_]+) ← (\w+).material$/)
    public materialIs(mId: string, shapeId: string) {
        this.workspace.materials[mId] = this.workspace.shapes[shapeId].material;
    }

    @then(/^([\w\d_]+) = material\(\)$/)
    public thenSphereMaterial(mId: string) {
        const actual = this.workspace.materials[mId];
        const expected = new Material();

        expect(Material.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }

    @given(/^(\w+).ambient ← ([^,]+)$/)
    public givenAmbient(mId: string, value: string) {
        const m = this.workspace.materials[mId].replace('ambient', parseArg(value));
        this.workspace.materials[mId] = m;
    }

    @when(/^(\w+).material ← (\w+)$/)
    public sphereMaterialSet(shapeId: string, mId: string) {
        this.workspace.shapes[shapeId] =
            this.workspace.shapes[shapeId].replace(
                this.workspace.materials[mId]
            );
    }

    @then(/^(\w+).material = (\w+)$/)
    public sphereMaterialIs(shapeId: string, mId: string) {
        const actual = this.workspace.shapes[shapeId].material;
        const expected = this.workspace.materials[mId];

        expect(Material.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }

    @given(/^(\w+) ← glass_sphere\(\)$/)
    public givenGlassSphere(shapeId: string) {
        this.workspace.shapes[shapeId] = glass_sphere();
    }
}

export = SpheresSteps;