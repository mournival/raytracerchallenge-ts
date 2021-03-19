import {binding, given, then, when} from 'cucumber-tsflow';
import {shouldEqualMsg, Workspace} from './Workspace';
import {expect} from 'chai';
import {checkers_pattern, gradient_pattern, ring_pattern, stripe_pattern, test_pattern} from '../../src/pattern';
import {Color} from '../../src/color';
import {point} from '../../src/tuple';
import {scaling, translation} from '../../src/matrix';
import {parseArg} from '../../src/util';

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

    // @then(/^([\w\d_]+).a = ([\w\d_]+)$/)
    // public thenPattenAIs(patternId: string, aColorId: string) {
    //     const actual = this.workspace.patterns[patternId].a;
    //     const expected = this.workspace.colors[aColorId];
    //
    //     expect(Color.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    // }
    //
    // @then(/^([\w\d_]+).b = ([\w\d_]+)$/)
    // public thenPattenBIs(patternId: string, bColorId: string) {
    //     const actual = this.workspace.patterns[patternId].b;
    //     const expected = this.workspace.colors[bColorId];
    //
    //     expect(Color.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    // }

    @then(/^stripe_at\(([\w\d_]+), point\(([^,]+), ([^,]+), ([^,]+)\)\) = ([\w\d_]+)$/)
    public thenStripeAtIs(patternId: string, x: string, y: string, z: string, colorId: string) {
        const actual = this.workspace.patterns[patternId].pattern_at(point(parseArg(x), parseArg(y), parseArg(z)));
        const expected = this.workspace.colors[colorId];

        expect(Color.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }

    @when(/^([\w\d_]+) ← stripe_at_object\(([\w\d_]+), ([\w\d_]+), point\(([^,]+), ([^,]+), ([^,]+)\)\)$/)
    public stripeAtObjectIs(colorId: string, patternId: string, shapeId: string, x: string, y: string, z: string) {
        this.workspace.colors[colorId] = this.workspace.patterns[patternId].pattern_at(point(parseArg(x), parseArg(y), parseArg(z)), this.workspace.shapes[shapeId]);
    }

    @then(/^([\w\d_]+) = white$/)
    public thenColorIsWhite(colorId: string) {
        this.workspace.colors[colorId] = Color.WHITE;
    }

    @given(/^set_pattern_transform\(([\w\d_]+), scaling\(([^,]+), ([^,]+), ([^,]+)\)\)$/)
    public givenSetPatternScalingTransform(patternId: string, x: string, y: string, z: string) {
        const p = this.workspace.patterns[patternId];
        this.workspace.patterns[patternId] = this.workspace.patterns[patternId].replace(scaling(parseArg(x), parseArg(y), parseArg(z)));
    }

    @given(/^set_pattern_transform\(([\w\d_]+), translation\(([^,]+), ([^,]+), ([^,]+)\)\)$/)
    public givenSetPatterntrTanslationTransform(patternId: string, x: string, y: string, z: string) {
        const p = this.workspace.patterns[patternId];
        this.workspace.patterns[patternId] = this.workspace.patterns[patternId].replace(translation(parseArg(x), parseArg(y), parseArg(z)));
    }

    @given(/^([\w\d_]+) ← test_pattern\(\)$/)
    public givenTestPattern(patternId: string) {
        const p = test_pattern();
        if (p) {
            this.workspace.patterns[patternId] = p;
        }
    }

    @when(/^([\w\d_]+) ← pattern_at_shape\(([\w\d_]+), ([\w\d_]+), point\(([^,]+), ([^,]+), ([^,]+)\)\)$/)
    public patternColorAtShapeis(colorId: string, patternId: string, shapeId: string, x: string, y: string, z: string) {
        this.workspace.colors[colorId] = this.workspace.patterns[patternId].pattern_at(point(parseArg(x), parseArg(y), parseArg(z)), this.workspace.shapes[shapeId]);
    }

    @given(/^([\w\d_]+) ← gradient_pattern\(([\w\d_]+), ([\w\d_]+)\)$/)
    public givenGradientPattern(patternId: string, aColorId: string, bColorId: string) {
        this.workspace.patterns[patternId] = gradient_pattern(
            this.workspace.colors[aColorId],
            this.workspace.colors[bColorId]);
    }

    @then(/^pattern_at\(([\w\d_]+), point\(([^,]+), ([^,]+), ([^,]+)\)\) = ([\w\d_]+)$/)
    public thenPatternAtIsColorName(patternId: string, x: string, y: string, z: string, colorId: string) {
        const actual = this.workspace.patterns[patternId].pattern_at(point(parseArg(x), parseArg(y), parseArg(z)));
        const expected = this.workspace.colors[colorId];

        expect(Color.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }

    @then(/^pattern_at\(([\w\d_]+), point\(([^,]+), ([^,]+), ([^,]+)\)\) = color\(([^,]+), ([^,]+), ([^,]+)\)$/)
    public thenPatternAtIs(patternId: string, x: string, y: string, z: string, r: string, g: string, b: string) {
        const actual = this.workspace.patterns[patternId].pattern_at(point(parseArg(x), parseArg(y), parseArg(z)));
        const expected = new Color(parseArg(r), parseArg(g), parseArg(b));

        expect(Color.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }

    @given(/^([\w\d_]+) ← ring_pattern\(([\w\d_]+), ([\w\d_]+)\)$/)
    public givenRingPattern(patternId: string, aColorId: string, bColorId: string) {
        const p = ring_pattern(this.workspace.colors[aColorId], this.workspace.colors[bColorId]);
        if (p) {
            this.workspace.patterns[patternId] = p;
        }
    }

    @given(/^([\w\d_]+) ← checkers_pattern\(([\w\d_]+), ([\w\d_]+)\)$/)
    public givenCheckerPattern(patternId: string, aColorId: string, bColorId: string) {
        const p = checkers_pattern(this.workspace.colors[aColorId], this.workspace.colors[bColorId]);
        if (p) {
            this.workspace.patterns[patternId] = p;
        }
    }
}

export = PatternSteps;