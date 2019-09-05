import {binding, then, when} from 'cucumber-tsflow';
import {parseArg, shouldEqualMsg, Workspace} from './Workspace';
import {Intersection} from '../../src/intersection';
import {expect} from 'chai';
import {Tuple} from '../../src/tuple';
import {Color} from '../../src/color';
import {Sphere} from "../../src/sphere";

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

    @then(/^([^,[]+)\.t = ([^,]+)$/)
    public thenDistanceEquals(intersectionId: string, t: string) {
        const actual = this.workspace.intersection[intersectionId].t;
        const expected = parseArg(t);
        expect(actual).to.be.closeTo(expected, 0.0001);
    }

    @then(/^([^,[]+)\.object = ([^,]+)$/)
    public thenObjectEquals(intersectionId: string, objId: string) {
        const actual = this.workspace.intersection[intersectionId].obj;
        const expected = this.workspace.spheres[objId];
        expect(Sphere.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }

}

export = IntersectionsSteps;