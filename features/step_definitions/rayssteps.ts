import {before, binding, given, then, when} from 'cucumber-tsflow';
import {Workspace} from './Workspace';
import {expect} from 'chai';
import {Matrix} from '../../src/matrix';
import {point, Tuple, vector} from '../../src/tuple';
import TupleSteps = require('./tuplesteps');
import {fail} from 'assert';
import {position, Ray} from '../../src/ray';


@binding([Workspace])
class RaysSteps {

    constructor(protected workspace: Workspace) {
    }

    @when(/^(\w+) ← ray\((\w+), (\w+)\)$/)
    public whenRay(rayId: string, originId: string, directionId: string) {
        this.workspace.rays[rayId] = new Ray(
            this.workspace.tuples[originId],
            this.workspace.tuples[directionId]
        );
    }

    @then(/^(\w+).origin = (\w+)$/)
    public thenRayOrigin(rayId: string, originId: string) {
        const actual = this.workspace.rays[rayId].origin;
        const expected = this.workspace.tuples[originId];
        expect(Tuple.equals(actual, expected)).to.be.true;
    }

    @then(/^(\w+).direction = (\w+)$/)
    public thenRayDirection(rayId: string, directionId: string) {
        const actual = this.workspace.rays[rayId].direction;
        const expected = this.workspace.tuples[directionId];
        expect(Tuple.equals(actual, expected)).to.be.true;
    }

    @when(/^(\w+) ← ray\(point\(([^,]+), ([^,]+), ([^,]+)\), vector\(([^,]+), ([^,]+), ([^,]+)\)\)$/)
    public whenRayFromPointVector(rayId: string, px: string, py: string, pz: string, vx: string, vy: string, vz: string,) {
        this.workspace.rays[rayId] = new Ray(
            point(parseFloat(px), parseFloat(py), parseFloat(pz)),
            vector(parseFloat(vx), parseFloat(vy), parseFloat(vz))
        );
    }

    @then(/^position\((\w+), ([^,]+)\) = point\(([^,]+), ([^,]+), ([^,]+)\)$/)
    public thenPosition(rayId: string, distance: string, px: string, py: string, pz: string) {
        const actual = position(this.workspace.rays[rayId],parseFloat(distance));
        const expected = point(parseFloat(px), parseFloat(py), parseFloat(pz));
        expect(Tuple.equals(actual, expected)).to.be.true;
    }

}

export = RaysSteps;