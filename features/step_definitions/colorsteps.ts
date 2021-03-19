import {binding, given, then} from 'cucumber-tsflow';
import {Workspace} from './Workspace';
import {expect} from 'chai';
import {Color} from '../../src/color';
import {parseArg} from '../../src/util';

@binding([Workspace])
class ColorSteps {

    constructor(protected workspace: Workspace) {
    }

    @given(/^color value of ([\w]+) ← (.+)$/)
    public givenColorValueOf(numberId: string, n: string) {
        const value = parseArg(n);
        this.workspace.numbers[numberId] = value
    }

    @then(/^mapColor\(([\w]+)\) = (.+)$/)
    public thenMapColorIs(numberId: string, expectedValue: string) {
        const expected = parseArg(expectedValue);
        const actual = Color.mapColor(this.workspace.numbers[numberId])
        expect(actual).to.be.closeTo(expected, 0.00001);
    }
}

export = ColorSteps;