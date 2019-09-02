import {before, binding, given, then, when} from 'cucumber-tsflow';
import {parseArg, shouldEqualMsg, Workspace} from './Workspace';
import {expect} from 'chai';
import {intersect, normal_at, set_transform, Sphere} from '../../src/sphere';
import {Matrix, rotation_z, scaling, translation} from '../../src/matrix';
import {point, Tuple} from '../../src/tuple';
import {Material} from '../../src/material';

@binding([Workspace])
class SpheresSteps {

    constructor(protected workspace: Workspace) {
    }

    @before()
    public beforeAllScenarios(): void {
        this.workspace.matrices['identity_matrix'] = Matrix.identity(4);
    }

    @given(/^(\w+) ← sphere\(\)$/)
    public givenASphere(sphereId: string) {
        this.workspace.spheres[sphereId] = new Sphere();
    }

    @when(/^(\w+) ← intersect\((\w+), (\w+)\)$/)
    public whenRayIntersectsSphere(interactionId: string, sphereId: string, rayId: string) {
        this.workspace.intersections[interactionId] = intersect(
            this.workspace.spheres[sphereId],
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
        const expected = this.workspace.spheres[objectId];

        expect(actual).to.be.equal(expected);
    }

    @then(/^(\w+).transform = ([^,]+)$/)
    public thenSphereTransform(sphereId: string, mId: string) {
        const actual = this.workspace.spheres[sphereId].transform;
        const expected = this.workspace.matrices[mId];

        expect(Matrix.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }

    @then(/^set_transform\((\w+), (\w+)\)$/)
    public whenSetTransform(sphereId: string, matrixId: string) {
        const t = this.workspace.matrices[matrixId];
        this.workspace.spheres[sphereId] = new Sphere(t);
    }

    @then(/^set_transform\((\w+), scaling\(([^,]+), ([^,]+), ([^,]+)\)\)$/)
    public whenSetTransformScaling(sphereId: string, x: string, y: string, z: string) {
        const s = this.workspace.spheres[sphereId];
        const t = scaling(parseArg(x), parseArg(y), parseArg(z));
        this.workspace.spheres[sphereId] = set_transform(s, t);
    }

    @then(/^(\w+)\[(\d+)].t = ([^,]+)$/)
    public thenIntersectionT(intersectionsId: string, intersectionIndex: string, value: string) {
        const actual = this.workspace.intersections[intersectionsId][parseInt(intersectionIndex)].t;
        const expected = parseArg(value);
        expect(actual).to.be.closeTo(expected, 0.0001);
    }

    @then(/^set_transform\((\w+), translation\(([^,]+), ([^,]+), ([^,]+)\)\)$/)
    public whenSetTransformTranslation(sphereId: string, x: string, y: string, z: string) {
        const s = this.workspace.spheres[sphereId];
        const t = translation(parseArg(x), parseArg(y), parseArg(z));
        this.workspace.spheres[sphereId] = set_transform(s, t);
    }

    @when(/^(\w+) ← normal_at\((\w+), point\(([^,]+), ([^,]+), ([^,]+)\)\)$/)
    public whenNormalAt(normalId: string, sphereId: string, x: string, y: string, z: string) {
        this.workspace.tuples[normalId] = normal_at(
            this.workspace.spheres[sphereId],
            point(parseArg(x), parseArg(y), parseArg(z))
        );
    }

    @then(/^([^,]+) = normalize\((\w+)\)$/)
    public givensRotationX(lhsId: string, nId: string) {
        const actual = this.workspace.tuples[lhsId];
        const expected = this.workspace.tuples[nId].normalize;
        expect(Tuple.equals(actual, expected)).to.be.true;
    }

    @given(/^(\w+) ← scaling\(([^,]+), ([^,]+), ([^,]+)\) \* rotation_z\(([^,]+)\)$/)
    public givensScaling(tId: string, x: string, y: string, z: string, rot: string) {
        this.workspace.matrices[tId] = Matrix.multiply(
            scaling(parseArg(x), parseArg(y), parseArg(z)),
            rotation_z(parseArg(rot)));
    }

    @when(/^(\w+) ← (\w+).material$/)
    public materialIs(mId: string, sphereId: string) {
        this.workspace.materials[mId] = this.workspace.spheres[sphereId].material;
    }

    @then(/^(\w+) = material\(\)$/)
    public thenSphereMaterial(mId: string) {
        const actual = this.workspace.materials[mId];
        const expected = new Material();

        expect(Material.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }

    @given(/^(\w+).ambient ← ([^,]+)$/)
    public givenAmbient(mId: string, value: string) {
        this.workspace.materials[mId] = {
            ...this.workspace.materials[mId],
            ambient: parseArg(value)
        };
    }

    @when(/^(\w+).material ← (\w+)$/)
    public sphereMaterialSet(sphereId: string, mId: string) {
        this.workspace.spheres[sphereId] = {
            ...this.workspace.spheres[sphereId],
            material: this.workspace.materials[mId]
        };
    }

    @then(/^(\w+).material = (\w+)$/)
    public sphereMaterialIs(sphereId: string, mId: string) {
        const actual = this.workspace.spheres[sphereId].material;
        const expected = this.workspace.materials[mId];

        expect(Material.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }

}

export = SpheresSteps;