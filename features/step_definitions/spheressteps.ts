import {before, binding, given, then, when} from 'cucumber-tsflow';
import {Workspace} from './Workspace';
import {expect} from 'chai';
import {Matrix} from '../../src/matrix';
import {point, Tuple, vector} from '../../src/tuple';
import {fail} from 'assert';
import {position, Ray} from '../../src/ray';
import {Sphere} from "../../src/sphere";


@binding([Workspace])
class SpheresSteps {

    constructor(protected workspace: Workspace) {
    }

    @given(/^(\w+) ← sphere\(\)$/)
    public givenASphere(sphereId: string) {
        this.workspace.spheres[sphereId] = new Sphere();
    }

    @when(/^(\w+) ← intersect\((\w+), (\w+)\)$/)
    public whenRayIntersectsSphere(intersctionId: string, sphereId: string, rayId: string) {
        return 'pending';
    }
}

export = SpheresSteps;