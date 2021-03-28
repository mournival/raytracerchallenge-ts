import {StepDefinitions} from "jest-cucumber";
import {parseArg} from "../../../src/util";
import {point} from "../../../src/tuple";
import {colors, lights, tuples} from "../steps";
import {MaterialsArray} from "../types";
import {Material} from "../../../src/material";
import {Light} from "../../../src/light";
import {Color} from "../../../src/color";
import {stripe_pattern} from "../../../src/pattern";

export let materials: MaterialsArray
export const materialsSteps: StepDefinitions = ({given, when, then}) => {
    let tests: { [index: string]: boolean; } = {}
    beforeAll(() => {
        materials = {}
        tests = {}
    })

    given(/^([\w\d_]+) ← material\(\)$/, (matId: string) => {
        materials[matId] = new Material();
    })

    given(/^([\w\d_]+) ← point_light\(point\(([^,]+), ([^,]+), ([^,]+)\), color\(([^,]+), ([^,]+), ([^,]+)\)\)$/, (lightId: string, x: string, y: string, z: string, r: string, g: string, b: string) => {
        lights[lightId] = new Light(
            point(parseArg(x), parseArg(y), parseArg(z)),
            new Color(parseArg(r), parseArg(g), parseArg(b))
        );
    })

    given(/^([\w\d_]+) ← true$/, (testVar: string) => {
        tests[testVar] = true;
    })

    given(/^([\w\d_]+).pattern ← stripe_pattern\(color\(([\w\d_]+), ([\w\d_]+), ([\w\d_]+)\), color\(([\w\d_]+), ([\w\d_]+), ([\w\d_]+)\)\)$/, (matId: string, ar: string, ag: string, ab: string, br: string, bg: string, bb: string) => {
        materials[matId] = materials[matId].replace('pattern',
            stripe_pattern(
                new Color(parseArg(ar), parseArg(ag), parseArg(ab)),
                new Color(parseArg(br), parseArg(bg), parseArg(bb)
                )
            )
        );
    })

    given(/^([\w\d_]+).color ← color\(([^,]+), ([^,]+), ([^,]+)\)$/, (matId: string, r: string, g: string, b: string) => {
        materials[matId] = materials[matId].replace('color', new Color(parseArg(r), parseArg(g), parseArg(b)));
    })

    given(/^([\w\d_]+).ambient ← ([^,]+)$/, (matId: string, value: string) => {
        materials[matId] = materials[matId].replace('ambient', parseArg(value));
    })

    given(/^([\w\d_]+).diffuse ← ([^,]+)$/, (matId: string, value: string) => {
        materials[matId] = materials[matId].replace('diffuse', parseArg(value));
    })

    given(/^([\w\d_]+).specular ← ([^,]+)$/, (matId: string, value: string) => {
        materials[matId] = materials[matId].replace('specular', parseArg(value));
    })

    given(/^([\w\d_]+).shininess ← ([^,]+)$/, (matId: string, value: string) => {
        materials[matId] = materials[matId].replace('shininess', parseArg(value));
    })

    given(/^([\w\d_]+).reflective ← ([^,]+)$/, (matId: string, value: string) => {
        materials[matId] = materials[matId].replace('reflective', parseArg(value));
    })

    given(/^([\w\d_]+).transparency ← ([^,]+)$/, (matId: string, value: string) => {
        materials[matId] = materials[matId].replace('transparency', parseArg(value));
    })

    given(/^([\w\d_]+).refractive_index ← ([^,]+)$/, (matId: string, value: string) => {
        materials[matId] = materials[matId].replace('refractive_index', parseArg(value));
    })

    when(/^([\w\d_]+) ← lighting\(([^,]+), ([^,]+), ([^,]+), ([^,]+), ([^,]+)\)$/,
        (resColorId: string, matId: string, lightId: string, positionId: string, eyeVectorId: string, normalVectorId: string) => {
            colors[resColorId] = materials[matId].lighting(tuples[positionId], tuples[eyeVectorId], tuples[normalVectorId], lights[lightId], false);
        })

    when(/^([\w\d_]+) ← lighting\(([^,]+), ([^,]+), ([^,]+), ([^,]+), ([^,]+), ([^,]+)\)$/,
        (resColorId: string, matId: string, lightId: string, positionId: string,
         eyeVectorId: string, normalVectorId: string, shadowTestId: string) => {
            colors[resColorId] = materials[matId].lighting(tuples[positionId], tuples[eyeVectorId], tuples[normalVectorId], lights[lightId], tests[shadowTestId]);
        })

    when(/^([\w\d_]+) ← lighting\(([^,]+), ([^,]+), point\(([^,]+), ([^,]+), ([^,]+)\), ([^,]+), ([^,]+), ([^,]+)\)$/,
        (resColorId: string, matId: string, lightId: string, x: string, y: string, z: string,
         eyeVectorId: string, normalVectorId: string, shadowTestId: string) => {
            colors[resColorId] = materials[matId].lighting(point(parseArg(x), parseArg(y), parseArg(z)), tuples[eyeVectorId], tuples[normalVectorId], lights[lightId], tests[shadowTestId]);
        })

    then(/^([\w\d_]+)\.color = color\(([^,]+), ([^,]+), ([^,]+)\)$/, (matId: string, r: string, g: string, b: string) => {
        expect(Color.equals(materials[matId].color, new Color(parseArg(r), parseArg(g), parseArg(b)))).toBeTruthy()
    })

    then(/^([\w\d_]+)\.ambient = ([^,]+)$/, (matId: string, value: string) => {
        expect(materials[matId].ambient).toBeCloseTo(parseArg(value), 0.0001);
    })

    then(/^([\w\d_]+)\.diffuse = ([^,]+)$/, (matId: string, value: string) => {
        expect(materials[matId].diffuse).toBeCloseTo(parseArg(value), 0.0001);
    })

    then(/^([\w\d_]+)\.specular = ([^,]+)$/, (matId: string, value: string) => {
        expect(materials[matId].specular).toBeCloseTo(parseArg(value), 0.0001);
    })

    then(/^([\w\d_]+)\.shininess = ([^,]+)$/, (matId: string, value: string) => {
        expect(materials[matId].shininess).toBeCloseTo(parseArg(value), 0.0001);
    })

    then(/^([\w\d_]+).not_a_field ← ([^,]+) throws$/, (matId: string, value: string) => {
        try {
            materials[matId] = materials[matId].replace('not_a_field', parseArg(value));
        } catch (e) {
            expect(e).toEqual('Unexpected field: not_a_field')
        }
    })

    then(/^([\w\d_]+)\.reflective = ([^,]+)$/, (matId: string, value: string) => {
        expect(materials[matId].reflective).toBeCloseTo(parseArg(value), 0.0001);
    })

    then(/^([\w\d_]+)\.transparency = ([^,]+)$/, (matId: string, value: string) => {
        expect(materials[matId].transparency).toBeCloseTo(parseArg(value), 0.0001);
    })

    then(/^([\w\d_]+)\.refractive_index = ([^,]+)$/, (matId: string, value: string) => {
        expect(materials[matId].refractive_index).toBeCloseTo(parseArg(value), 0.0001);
    })

    then(/^(\w+) material.equals (\w+)$/, (lhsName: string, rhsName: string) => {
        expect(Material.equals(materials[lhsName], materials[rhsName])).toBeTruthy()
    })

    then(/^(\w+) does not material.equals (\w+)$/, (lhsName: string, rhsName: string) => {
        expect(Material.equals(materials[lhsName], materials[rhsName])).toBeFalsy()
    })
}