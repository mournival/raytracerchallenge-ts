import {binding, given} from 'cucumber-tsflow';
import {parseArg, Workspace} from './Workspace';
import {Cylinder} from '../../src/cylinder';
import {point, vector} from '../../src/tuple';
import {Ray} from '../../src/ray';

@binding([Workspace])
class CylinderSteps {

    constructor(protected workspace: Workspace) {
    }

    @given(/^([\w\d_]+) ← cylinder\(\)$/)
    public givenTestCylinder(cylinderId: string) {
        this.workspace.shapes[cylinderId] = new Cylinder();
    }

    @given(/^([\w\d_]+) ← normalize\(vector\(([^,]+), ([^,]+), ([^,]+)\)\)$/)
    public givenNormalizedDirection(normalizedId: string, x: string, y: string, z: string) {
        this.workspace.tuples[normalizedId] = vector(parseArg(x), parseArg(y), parseArg(z)).normalize;
    }

    @given(/^([\w\d_]+) ← ray\(point\(([^,]+), ([^,]+), ([^,]+)\), ([\w\d_]+)\)$/)
    public givenRayWithNormalizedDirection(rayId: string, x: string, y: string, z: string, directionId: string) {
        this.workspace.rays[rayId] = new Ray(
            point(parseArg(x), parseArg(y), parseArg(z)),
            this.workspace.tuples[directionId]
        );
    }

}

export = CylinderSteps;