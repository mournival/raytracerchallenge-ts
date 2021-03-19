import {binding, given, then, when} from 'cucumber-tsflow';
import {Workspace} from './Workspace';
import {Plane} from '../../src/shapes/plane';
import {point} from '../../src/tuple';
import {expect} from 'chai';
import {Group} from '../../src/shapes/group';
import {parseArg} from '../../src/util';

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
        this.workspace.tuples[normalId] = this.workspace.shapes[planeId].local_normal_at(
            point(parseArg(x), parseArg(y), parseArg(z))
        );
    }

    @when(/^([\w\d_]+) ← local_intersect\(([\w\d_]+), ([\w\d_]+)\)$/)
    public whenIntersect(intersectionsId: string, shapeId: string, rayId: string) {
        this.workspace.intersections[intersectionsId] = this.workspace.shapes[shapeId].intersect(this.workspace.rays[rayId]);
    }

    @then(/^([\w\d_]+) is empty$/)
    public thenIntersectionsIsEmpty(intersectionsId: string) {
        if (this.workspace.intersections[intersectionsId] != null) {
            expect(this.workspace.intersections[intersectionsId].length).to.be.equal(0);
        } else if (this.workspace.shapes[intersectionsId] != null) {
            expect((this.workspace.shapes[intersectionsId] as Group).empty).to.be.true;
        }
    }
}

export = PlaneSteps;