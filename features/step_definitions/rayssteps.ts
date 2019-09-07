import {binding, then, when} from 'cucumber-tsflow';
import {Workspace} from './Workspace';
import {expect} from 'chai';
import {point, Tuple, vector} from '../../src/tuple';
import {position, Ray, transform} from '../../src/ray';

@binding([Workspace])
class RaysSteps {

    constructor(protected workspace: Workspace) {
    }

    @when(/^([\w\d_]+) ← ray\((\w+), (\w+)\)$/)
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

    @when(/^([\w\d_]+) ← ray\(point\(([^,]+), ([^,]+), ([^,]+)\), vector\(([^,]+), ([^,]+), ([^,]+)\)\)$/)
    public whenRayFromPointVector(rayId: string, px: string, py: string, pz: string, vx: string, vy: string, vz: string,) {
        this.workspace.rays[rayId] = new Ray(
            point(parseFloat(px), parseFloat(py), parseFloat(pz)),
            vector(parseFloat(vx), parseFloat(vy), parseFloat(vz))
        );
    }

    @then(/^position\((\w+), ([^,]+)\) = point\(([^,]+), ([^,]+), ([^,]+)\)$/)
    public thenPosition(rayId: string, distance: string, px: string, py: string, pz: string) {
        const actual = position(this.workspace.rays[rayId], parseFloat(distance));
        const expected = point(parseFloat(px), parseFloat(py), parseFloat(pz));
        expect(Tuple.equals(actual, expected)).to.be.true;
    }

    @when(/^([\w\d_]+) ← transform\(([^,]+), ([^,]+)\)$/)
    public whenTransformRay(r2Id: string, rId: string, tId: string,) {
        this.workspace.rays[r2Id] = transform(
            this.workspace.rays[rId],
            this.workspace.matrices[tId]
        );
    }

    @then(/^(\w+).origin = point\(([^,]+), ([^,]+), ([^,]+)\)$/)
    public thenRayOriginPoint(rayId: string, px: string, py: string, pz: string) {
        const actual = this.workspace.rays[rayId].origin;
        const expected = point(parseFloat(px), parseFloat(py), parseFloat(pz));
        expect(Tuple.equals(actual, expected)).to.be.true;
    }

    @then(/^(\w+).direction = vector\(([^,]+), ([^,]+), ([^,]+)$/)
    public thenRayDirectionVector(rayId: string, vx: string, vy: string, vz: string) {
        const actual = this.workspace.rays[rayId].direction;
        const expected = vector(parseFloat(vx), parseFloat(vy), parseFloat(vz));
        expect(Tuple.equals(actual, expected)).to.be.true;
    }
}

export = RaysSteps;