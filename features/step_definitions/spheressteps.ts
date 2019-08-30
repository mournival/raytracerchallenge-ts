import {before, binding, given, then, when} from 'cucumber-tsflow';
import {Workspace} from './Workspace';
import {expect} from 'chai';
import {intersect, Sphere} from "../../src/sphere";
import {Matrix} from "../../src/matrix";

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
        const actual = this.workspace.intersections[intersectionsId][parseInt(intersectionIndex)].value;
        const expected = parseFloat(value);

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

        expect(Matrix.equals(actual, expected), JSON.stringify(actual) + ' should equal ' + JSON.stringify(expected)).to.be.true;
    }
}

export = SpheresSteps;