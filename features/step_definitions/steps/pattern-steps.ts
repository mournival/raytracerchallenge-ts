import {StepDefinitions} from 'jest-cucumber';
import {checkers_pattern, gradient_pattern, ring_pattern, stripe_pattern, test_pattern} from "../../../src/pattern";
import {PatternArray} from "../types";
import {colors, shapes} from "../steps";
import {point} from "../../../src/tuple";
import {parseArg} from "../../../src/util";
import {Color} from "../../../src/color";
import {scaling, translation} from "../../../src/matrix";

export let patterns: PatternArray;

export const patternSteps: StepDefinitions = ({given, and, when, then}) => {

    beforeAll(() => {
        patterns = {}
    })

    given(/^([\w\d_]+) ← stripe_pattern\((.*), (.*)\)$/, (id: string, colorAId: string, colorBId: string) => {
        patterns[id] = stripe_pattern(colors[colorAId], colors[colorBId]);
    })

    given(/^([\w\d_]+) ← test_pattern\(\)$/, (patternId: string) => {
        patterns[patternId] = test_pattern();
    })

    given(/^([\w\d_]+) ← gradient_pattern\(([\w\d_]+), ([\w\d_]+)\)$/,
        (patternId: string, aColorId: string, bColorId: string) => {
            patterns[patternId] = gradient_pattern(
                colors[aColorId],
                colors[bColorId]);
        })

    given(/^([\w\d_]+) ← ring_pattern\(([\w\d_]+), ([\w\d_]+)\)$/,
        (patternId: string, aColorId: string, bColorId: string) => {
            patterns[patternId] = ring_pattern(colors[aColorId], colors[bColorId]);
        })

    given(/^([\w\d_]+) ← checkers_pattern\(([\w\d_]+), ([\w\d_]+)\)$/,
        (patternId: string, aColorId: string, bColorId: string) => {
            patterns[patternId] = checkers_pattern(colors[aColorId], colors[bColorId]);
        })

    and(/^set_pattern_transform\(([\w\d_]+), scaling\(([^,]+), ([^,]+), ([^,]+)\)\)$/,
        (patternId: string, x: string, y: string, z: string) => {
            patterns[patternId] = patterns[patternId].replace(scaling(parseArg(x), parseArg(y), parseArg(z)));
        })

    and(/^set_pattern_transform\(([\w\d_]+), translation\(([^,]+), ([^,]+), ([^,]+)\)\)$/,
        (patternId: string, x: string, y: string, z: string) => {
            patterns[patternId] = patterns[patternId].replace(translation(parseArg(x), parseArg(y), parseArg(z)));
        })

    when(/^([\w\d_]+) ← stripe_at_object\(([\w\d_]+), ([\w\d_]+), point\(([^,]+), ([^,]+), ([^,]+)\)\)$/,
        (colorId: string, patternId: string, shapeId: string, x: string, y: string, z: string) => {
            colors[colorId] = patterns[patternId].pattern_at(point(parseArg(x), parseArg(y), parseArg(z)), shapes[shapeId]);
        })

    when(/^([\w\d_]+) ← pattern_at_shape\(([\w\d_]+), ([\w\d_]+), point\(([^,]+), ([^,]+), ([^,]+)\)\)$/,
        (colorId: string, patternId: string, shapeId: string, x: string, y: string, z: string) => {
            colors[colorId] = patterns[patternId].pattern_at(point(parseArg(x), parseArg(y), parseArg(z)), shapes[shapeId]);
        })

    // then(/(.*).a = (.*)/, (id: string, colorId: string) => {
    //   expect(patterns[id].a).toEqual(colors[colorId])
    // })

    then(/^stripe_at\(([\w\d_]+), point\(([^,]+), ([^,]+), ([^,]+)\)\) = ([\w\d_]+)$/,
        (patternId: string, x: string, y: string, z: string, expectedColorId: string) => {
            const actual = patterns[patternId].pattern_at(point(parseArg(x), parseArg(y), parseArg(z)));
            expect(Color.equals(actual, colors[expectedColorId])).toBeTruthy();
        })

    then(/^([\w\d_]+) = white$/, (colorId: string) => {
        expect(Color.equals(colors[colorId], Color.WHITE)).toBeTruthy()
    })

    then(/^pattern_at\(([\w\d_]+), point\(([^,]+), ([^,]+), ([^,]+)\)\) = ([\w\d_]+)$/,
        (patternId: string, x: string, y: string, z: string, expectedColorId: string) => {
            const actual = patterns[patternId].pattern_at(point(parseArg(x), parseArg(y), parseArg(z)));
            expect(Color.equals(actual, colors[expectedColorId])).toBeTruthy()
        })

    then(/^pattern_at\(([\w\d_]+), point\(([^,]+), ([^,]+), ([^,]+)\)\) = color\(([^,]+), ([^,]+), ([^,]+)\)$/,
        (patternId: string, x: string, y: string, z: string, r: string, g: string, b: string) => {
            const actual = patterns[patternId].pattern_at(point(parseArg(x), parseArg(y), parseArg(z)));
            const expected = new Color(parseArg(r), parseArg(g), parseArg(b));
            expect(Color.equals(actual, expected)).toBeTruthy();
        })

}