import {binding, given} from 'cucumber-tsflow';
import {Workspace} from './Workspace';
import {Cube} from '../../src/cube';
import {when} from 'cucumber-tsflow/dist';

@binding([Workspace])
class CubeSteps {

    constructor(protected workspace: Workspace) {
    }

    @given(/^([\w\d_]+) ← cube\(\)$/)
    public givenTestCube(cubeId: string) {
        this.workspace.shapes[cubeId] = new Cube();
    }

    @when(/^([\w\d_]+) ← local_normal_at\(([\w\d_]+), ([\w\d_]+)\)$/)
    public whenLocalNormalAt(normalId: string, shapeId: string, point: string) {
        this.workspace.tuples[normalId] = this.workspace.shapes[shapeId].local_normal_at(
            this.workspace.tuples[point]
        );
    }

    // @when(/^([\w\d_]+) ← local_normal_at\(([\w\d_]+), point\(([^,]+), ([^,]+), ([^,]+)\)\)$/)
    // public whenNormalAt(normalId: string, cubeId: string, x: string, y: string, z: string) {
    //     const n = this.workspace.shapes[cubeId].normal_at(
    //         point(parseArg(x), parseArg(y), parseArg(z))
    //     );
    //     this.workspace.tuples[normalId] = n;
    // }
    //
    // @when(/^([\w\d_]+) ← local_intersect\(([\w\d_]+), ([\w\d_]+)\)$/)
    // public whenIntersect(intersectionsId: string, cubeId: string, rayId: string) {
    //     this.workspace.intersections[intersectionsId] = this.workspace.shapes[cubeId].intersect(this.workspace.rays[rayId]);
    // }
    //
    // @then(/^([\w\d_]+) is empty$/)
    // public thenIntersectionsIsEmpty(intersectionsId: string) {
    //     expect(this.workspace.intersections[intersectionsId].length).to.be.equal(0);
    // }
}

export = CubeSteps;