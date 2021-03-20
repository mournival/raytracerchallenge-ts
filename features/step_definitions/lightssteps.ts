import {binding, then, when} from 'cucumber-tsflow';
import {shouldEqualMsg, Workspace} from './Workspace';
import {Light} from '../../src/light';
import {expect} from 'chai';
import {Tuple} from '../../src/tuple';
import {Color} from '../../src/color';

@binding([Workspace])
class LightsSteps {

    constructor(protected workspace: Workspace) {
    }

    @when(/^([\w\d_]+) ← point_light\(([^,]+), ([^,]+)\)$/)
    public whenLightCreated(lightId: string, posId: string, intensityId: string) {
        this.workspace.lights[lightId] = new Light(
            this.workspace.tuples[posId],
            this.workspace.colors[intensityId]
        );
    }

    @then(/^([\w\d_]+).position = ([^,]+)$/)
    public thenPositionEquals(lightId: string, posId: string) {
        const actual = this.workspace.lights[lightId].position;
        const expected = this.workspace.tuples[posId];
        expect(Tuple.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }

    @then(/^([\w\d_]+).intensity = ([^,]+)$/)
    public thenIntensityEquals(lightId: string, intensityId: string) {
        const actual = this.workspace.lights[lightId].intensity;
        const expected = this.workspace.colors[intensityId];
        expect(Color.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }

    @then(/^([\w\d_]+) does not light.equals ([\w\d_]+)$/)
    public thenLightNotEquals(lhs: string, rhs: string) {
        expect(Light.equals(this.workspace.lights[lhs], this.workspace.lights[rhs])
        ).to.be.false;
    }

}

export = LightsSteps;