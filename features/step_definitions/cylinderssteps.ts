import {binding, given} from 'cucumber-tsflow';
import {parseArg, Workspace} from './Workspace';
import {Cylinder} from '../../src/cylinder';
import {point, vector} from '../../src/tuple';
import {Ray} from '../../src/ray';
import {then} from "cucumber-tsflow/dist";
import {expect} from "chai";

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

    @then(/^([\w\d_]+).minimum = -infinity$/)
    public thenMinimumIs(cylId: string) {
        const actual = (this.workspace.shapes[cylId] as Cylinder).minimum;

        expect(actual).to.be.equal(Number.NEGATIVE_INFINITY);
    }

    @then(/^([\w\d_]+).maximum = infinity$/)
    public thenMaximumIs(cylId: string) {
        const actual = (this.workspace.shapes[cylId] as Cylinder).maximum;

        expect(actual).to.be.equal(Number.POSITIVE_INFINITY);
    }

    @given(/^([\w\d_]+).minimum ← ([^,]+)$/)
    public givenCylinderMin(cylId: string, value: string) {
        const c = this.workspace.shapes[cylId] as Cylinder;
        this.workspace.shapes[cylId] = new Cylinder(c.transform, c.material, parseArg(value), c.maximum);
    }

    @given(/^([\w\d_]+).maximum ← ([^,]+)$/)
    public givenCylinderMax(cylId: string, value: string) {
        const c = this.workspace.shapes[cylId] as Cylinder;
        this.workspace.shapes[cylId] = new Cylinder(c.transform, c.material, c.minimum, parseArg(value));
    }

    @then(/^([\w\d_]+).closed = ([^,]+)/)
    public thenCloseIs(cylId: string, value: string) {
        const actual = (this.workspace.shapes[cylId] as Cylinder).closed;
        const expected = value === 'true';

        expect(actual).to.be.equal(expected);
    }

    @given(/^([\w\d_]+).closed ← ([^,]+)$/)
    public givenCylinderClosed(cylId: string, value: string) {
        const c = this.workspace.shapes[cylId] as Cylinder;
        this.workspace.shapes[cylId] = new Cylinder(c.transform, c.material, c.minimum, c.maximum, !!value);
    }
}

export = CylinderSteps;