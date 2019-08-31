import {before, binding, given, then, when} from 'cucumber-tsflow';
import {shouldEqualMsg, Workspace} from './Workspace';
import {Light} from '../../src/light';
import {expect} from 'chai';
import {Tuple} from '../../src/tuple';
import {Color} from '../../src/color';

@binding([Workspace])
class LightsSteps {

    constructor(protected workspace: Workspace) {
    }

    @when(/^([^,]+) ← point_light\(([^,]+), ([^,]+)\)$/)
    public whenLightCreated(lightId: string, posId: string, intensityId: string) {
        this.workspace.lights[lightId] = new Light(
            this.workspace.tuples[posId],
            this.workspace.colors[intensityId]
        );
    }

    @then(/^([^,]+).position = ([^,]+)$/)
    public thenPositionEquals(lightId: string, posId: string) {
        const actual = this.workspace.lights[lightId].position;
        const expected = this.workspace.tuples[posId];
        expect(Tuple.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }

    @then(/^([^,]+).intensity = ([^,]+)$/)
    public thenIntensityEquals(lightId: string, intensityId: string) {
        const actual = this.workspace.lights[lightId].intensity;
        const expected = this.workspace.colors[intensityId];
        expect(Color.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }
}

export = LightsSteps;