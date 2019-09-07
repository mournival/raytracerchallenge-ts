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

    @when(/^([^,]+) ← intersection\(([^,]+), ([^,]+)\)$/)
    public whenIntersectionCreated(intersectionId: string, t: string, objId: string) {
        this.workspace.intersection[intersectionId] = new Intersection(
            this.workspace.spheres[objId],
            parseArg(t)
        );
    }

    @then(/^([^,[]+)\.t = ([^t]+)$/)
    public thenDistanceEqualsV(intersectionId: string, t: string) {
        const actual = this.workspace.intersection[intersectionId].t;
        const expected = parseArg(t);
        expect(actual).to.be.closeTo(expected, 0.0001);
    }

    @then(/^([^,[]+)\.t = ([^,]+).t$/)
    public thenDistanceEqualsIt(pcId: string, intersectId: string) {
        const actual = this.workspace.intersection[pcId].t;
        const expected = this.workspace.intersection[intersectId].t;
        expect(actual).to.be.closeTo(expected, 0.0001);
    }


    @then(/^([^,[]+)\.object = ([^,.]+)$/)
    public thenObjectEquals(intersectionId: string, objId: string) {
        const actual = this.workspace.intersection[intersectionId].obj;
        const expected = this.workspace.spheres[objId];
        expect(Sphere.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }

    @then(/^([^,[]+)\.object = ([^,]+).object$/)
    public thenObjectEqualsIobj(pcId: string, intersectId: string) {
        const actual = this.workspace.intersection[pcId].obj;
        const expected = this.workspace.intersection[intersectId].obj;
        expect(Sphere.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }


    @given(/^([^,]+) ← prepare_computations\(([^,]+), ([^,]+)\)$/)
    public givenPreComps(pcId: string, intersectId: string, rayId: string) {
        this.workspace.intersection[pcId] = prepare_computations(
            this.workspace.intersection[intersectId],
            this.workspace.rays[rayId],
        );
    }

    @then(/^([^,[]+)\.point = point\(([^,]+), ([^,]+), ([^,]+)\)/)
    public thenPCPointEqualsIpoint(pcId: string, x: string, y: string, z: string) {
        const actual = (this.workspace.intersection[pcId] as PreComputations).point;
        const expected = point(parseArg(x), parseArg(y), parseArg(z));
        expect(Tuple.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }

    @then(/^([^,[]+)\.eyev = vector\(([^,]+), ([^,]+), ([^,]+)\)$/)
    public thenPCEyevEqualsIeyev(pcId: string, x: string, y: string, z: string) {
        const actual = (this.workspace.intersection[pcId] as PreComputations).eyev;
        const expected = vector(parseArg(x), parseArg(y), parseArg(z));
        expect(Tuple.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }

    @then(/^([^,[]+)\.normalv = vector\(([^,]+), ([^,]+), ([^,]+)\)$/)
    public thenPCNormalvEqualsInormalv(pcId: string, x: string, y: string, z: string) {
        const actual = (this.workspace.intersection[pcId] as PreComputations).normalv;
        const expected = vector(parseArg(x), parseArg(y), parseArg(z));
        expect(Tuple.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }

    @then(/^([^,[]+)\.inside = ([^,]+)$/)
    public thenPCInsideEquals(pcId: string, inside: string) {
        const actual = (this.workspace.intersection[pcId] as PreComputations).inside;
        const expected = inside === 'true';
        expect(actual).to.be.equal(expected);
    }
}

export = IntersectionsSteps;