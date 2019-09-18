import {binding, given} from 'cucumber-tsflow';
import {parseArg, Workspace} from './Workspace';
import {normal_at, Plane} from "../../src/plane";
import {when} from "cucumber-tsflow/dist";
import {point} from "../../src/tuple";

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
        this.workspace.tuples[normalId] = normal_at(
            this.workspace.shapes[planeId],
            point(parseArg(x), parseArg(y), parseArg(z))
        );
    }
}

export = PlaneSteps;