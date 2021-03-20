import {binding, given, then} from 'cucumber-tsflow';
import {Workspace} from './Workspace';
import {expect} from 'chai';
import {Color} from '../../src/color';
import {parseArg} from '../../src/util';
import {when} from "cucumber-tsflow/dist";

@binding([Workspace])
class ColorSteps {

    constructor(protected workspace: Workspace) {
    }

    @given(/^color value of ([\w]+) ← (.+)$/)
    public givenColorValueOf(numberId: string, n: string) {
        this.workspace.numbers[numberId] = parseArg(n)
    }

    @then(/^mapColor\(([\w]+)\) = (.+)$/)
    public thenMapColorIs(numberId: string, expectedValue: string) {
        const expected = parseArg(expectedValue);
        const actual = Color.mapColor(this.workspace.numbers[numberId])
        expect(actual).to.be.closeTo(expected, 0.00001);
    }

    @when(/^color (\w+) = (\w+) \* (\w+)$/)
    public whenColorsMultiplied(product: string, lhs: string, rhs: string) {
        this.workspace.colors[product] = Color.multiply(this.workspace.colors[lhs], this.workspace.colors[rhs])
    }

    @then(/^color (\w+) does not equal color (\w+)$/)
    public thenColorsAreNotEqual(lhs: string, rhs: string) {
        expect(Color.equals(this.workspace.colors[lhs], this.workspace.colors[rhs])).to.not.be.true;
    }

    @then(/^color (\w+) = color\(([^,]+), ([^,]+), ([^,]+)\)$/)
    public thenColorsAreEqual(lhs: string, r: string, g: string, b: string) {
        const expected = new Color(parseArg(r), parseArg(g), parseArg(b))
        const actual = this.workspace.colors[lhs];
        expect(Color.equals(actual, expected)).to.be.true;
    }

    @then(/^color (\w+) as string is '(.*)'$/)
    public thenColorAsString(colorId: string, expected: string) {
        const actual = this.workspace.colors[colorId].asString();
        expect(actual).to.equal(expected);
    }
}

export = ColorSteps;