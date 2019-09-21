import {binding, given} from 'cucumber-tsflow';
import {parseArg, Workspace} from './Workspace';
import {Plane} from '../../src/plane';
import {then, when} from 'cucumber-tsflow/dist';
import {point} from '../../src/tuple';
import {expect} from 'chai';

@binding([Workspace])
class PlaneSteps {

    constructor(protected workspace: Workspace) {
    }

    @given(/^([\w\d_]+) ← plane\(\)$/)
    public givenTestPlane(planeId: string) {
        this.workspace.shapes[planeId] = new Plane();
    }

    @when(/^([\w\d_]+) ← local_normal_at\(([\w\d_]+), point\(([^,]+), ([^,]+), ([^,]+)\)\)$/)
    public whenNormalAt(normalId: string, planeId: string, x: string, y: string, z: string) {
        const n = this.workspace.shapes[planeId].normal_at(
            point(parseArg(x), parseArg(y), parseArg(z))
        );
        this.workspace.tuples[normalId] = n;
    }

    @when(/^([\w\d_]+) ← local_intersect\(([\w\d_]+), ([\w\d_]+)\)$/)
    public whenIntersect(intersectionsId: string, planeId: string, rayId: string) {
        this.workspace.intersections[intersectionsId] = this.workspace.shapes[planeId].intersect(this.workspace.rays[rayId]);
    }

    @then(/^([\w\d_]+) is empty$/)
    public thenIntersectionsIsEmpty(intersectionsId: string) {
        expect(this.workspace.intersections[intersectionsId].length).to.be.equal(0);
    }
}

export = PlaneSteps;