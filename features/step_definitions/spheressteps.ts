import {before, binding, given, then, when} from 'cucumber-tsflow';
import {Workspace} from './Workspace';
import {expect} from 'chai';
import {Matrix} from '../../src/matrix';
import {point, Tuple, vector} from '../../src/tuple';
import {fail} from 'assert';
import {position, Ray} from '../../src/ray';
import {intersect, Sphere} from "../../src/sphere";

@binding([Workspace])
class SpheresSteps {

    constructor(protected workspace: Workspace) {
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
        const actual = this.workspace.intersections[intersectionsId][parseInt(intersectionIndex)];
        const expected = parseFloat(value);

        expect(actual).to.be.closeTo(expected, 0.0001);
    }
}

export = SpheresSteps;