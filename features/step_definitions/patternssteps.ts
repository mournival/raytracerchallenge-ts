import {binding, given} from 'cucumber-tsflow';
import {parseArg, shouldEqualMsg, Workspace} from './Workspace';
import {Plane} from '../../src/plane';
import {then, when} from 'cucumber-tsflow/dist';
import {point} from '../../src/tuple';
import {expect} from 'chai';
import {stripe_pattern} from "../../src/pattern";
import {Color} from "../../src/color";

@binding([Workspace])
class PatternSteps {

    constructor(protected workspace: Workspace) {
    }

    @given(/^([\w\d_]+) ← stripe_pattern\(([\w\d_]+), ([\w\d_]+)\)$/)
    public givenStripePattern(patternId: string, aColorId: string, bColorId: string) {
        this.workspace.patterns[patternId] = stripe_pattern(
            this.workspace.colors[aColorId],
            this.workspace.colors[bColorId]);
    }

    @then(/^([\w\d_]+).a = ([\w\d_]+)$/)
    public thenPattenAIs(patternId: string, aColorId: string) {
        const actual = this.workspace.patterns[patternId].a;
        const expected = this.workspace.colors[aColorId];

        expect(Color.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }

    @then(/^([\w\d_]+).b = ([\w\d_]+)$/)
    public thenPattenBIs(patternId: string, bColorId: string) {
        const actual = this.workspace.patterns[patternId].b;
        const expected = this.workspace.colors[bColorId];

        expect(Color.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }

}

export = PatternSteps;