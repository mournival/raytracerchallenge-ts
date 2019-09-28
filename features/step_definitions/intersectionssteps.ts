import {binding, given, then, when} from 'cucumber-tsflow';
import {parseArg, shouldEqualMsg, Workspace} from './Workspace';
import {Intersection} from '../../src/intersection';
import {expect} from 'chai';
import {Sphere} from '../../src/sphere';
import {PreComputations, prepare_computations} from '../../src/pre-computations';
import {point, Tuple, vector} from '../../src/tuple';

@binding([Workspace])
class IntersectionsSteps {

    constructor(protected workspace: Workspace) {
    }

    @when(/^([\w\d_]+) ← intersection\(([^,]+), ([^,]+)\)$/)
    public whenIntersectionCreated(intersectionId: string, t: string, objId: string) {
        this.workspace.intersection[intersectionId] = new Intersection(
            this.workspace.shapes[objId],
            parseArg(t)
        );
    }

    @then(/^([\w\d_]+)\.t = ([^t]+)$/)
    public thenDistanceEqualsV(intersectionId: string, t: string) {
        const actual = this.workspace.intersection[intersectionId].t;
        const expected = parseArg(t);
        expect(actual).to.be.closeTo(expected, 0.0001);
    }

    @then(/^([\w\d_]+)\.t = ([\w\d_]+).t$/)
    public thenDistanceEqualsIt(pcId: string, intersectId: string) {
        const actual = this.workspace.intersection[pcId].t;
        const expected = this.workspace.intersection[intersectId].t;
        expect(actual).to.be.closeTo(expected, 0.0001);
    }


    @then(/^([\w\d_]+)\.object = ([^,.]+)$/)
    public thenObjectEquals(intersectionId: string, objId: string) {
        const actual = this.workspace.intersection[intersectionId].obj;
        const expected = this.workspace.shapes[objId];
        expect(Sphere.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }

    @then(/^([\w\d_]+)\.object = ([^,]+).object$/)
    public thenObjectEqualsIobj(pcId: string, intersectId: string) {
        const actual = this.workspace.intersection[pcId].obj;
        const expected = this.workspace.intersection[intersectId].obj;
        expect(Sphere.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }


    @given(/^([\w\d_]+) ← prepare_computations\(([^,]+), ([^,]+)\)$/)
    public givenPreComps(pcId: string, intersectId: string, rayId: string) {
        this.workspace.intersection[pcId] = prepare_computations(
            this.workspace.intersection[intersectId],
            this.workspace.rays[rayId],
        );
    }

    @then(/^([\w\d_]+)\.point = point\(([^,]+), ([^,]+), ([^,]+)\)/)
    public thenPCPointEqualsIpoint(pcId: string, x: string, y: string, z: string) {
        const actual = (this.workspace.intersection[pcId] as PreComputations).point;
        const expected = point(parseArg(x), parseArg(y), parseArg(z));
        expect(Tuple.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }

    @then(/^([\w\d_]+)\.eyev = vector\(([^,]+), ([^,]+), ([^,]+)\)$/)
    public thenPCEyevEqualsIeyev(pcId: string, x: string, y: string, z: string) {
        const actual = (this.workspace.intersection[pcId] as PreComputations).eyev;
        const expected = vector(parseArg(x), parseArg(y), parseArg(z));
        expect(Tuple.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }

    @then(/^([\w\d_]+)\.normalv = vector\(([^,]+), ([^,]+), ([^,]+)\)$/)
    public thenPCNormalvEqualsInormalv(pcId: string, x: string, y: string, z: string) {
        const actual = (this.workspace.intersection[pcId] as PreComputations).normalv;
        const expected = vector(parseArg(x), parseArg(y), parseArg(z));
        expect(Tuple.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }

    @then(/^([\w\d_]+)\.inside = ([^,]+)$/)
    public thenPCInsideEquals(pcId: string, inside: string) {
        const actual = (this.workspace.intersection[pcId] as PreComputations).inside;
        const expected = inside === 'true';
        expect(actual).to.be.equal(expected);
    }

    @then(/^([\w\d_]+)\.over_point\.z < -EPSILON\/2$/)
    public thenCompsOverPointLess(pcId: string) {
        const actual = (this.workspace.intersection[pcId] as PreComputations).over_point.z;

        expect(actual).to.be.lessThan(-Tuple.EPSILON / 2);
    }

    @then(/^([\w\d_]+)\.point\.z > [^.]+\.over_point\.z$/)
    public thenCompsOverPointGreater(pcId: string) {
        const actual = (this.workspace.intersection[pcId] as PreComputations).point.z;
        const expected = (this.workspace.intersection[pcId] as PreComputations).over_point.z;

        expect(actual).to.be.greaterThan(expected);
    }

    @then(/^([\w\d_]+)\.reflectv = vector\(([^,]+), ([^,]+), ([^,]+)\)/)
    public thenPCReflectVEqualsIpoint(pcId: string, x: string, y: string, z: string) {
        const actual = (this.workspace.intersection[pcId] as PreComputations).reflectv;
        const expected = vector(parseArg(x), parseArg(y), parseArg(z));
        expect(Tuple.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }
}

export = IntersectionsSteps;