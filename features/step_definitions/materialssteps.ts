import {binding, given, then, when} from 'cucumber-tsflow';
import {Workspace} from './Workspace';
import {Material} from '../../src/material';
import {expect} from 'chai';
import {Color} from '../../src/color';
import {Light} from '../../src/light';
import {point} from '../../src/tuple';
import {stripe_pattern} from '../../src/pattern';
import {parseArg} from '../../src/util';

@binding([Workspace])
class MaterialsSteps {
    constructor(protected workspace: Workspace) {
    }

    @given(/^([\w\d_]+) ← material\(\)$/)
    public givenMaterial(matId: string) {
        this.workspace.materials[matId] = new Material();
    }

    @then(/^([\w\d_]+).color = color\(([^,]+), ([^,]+), ([^,]+)\)$/)
    public thenColorEquals(matId: string, r: string, g: string, b: string) {
        const actual = this.workspace.materials[matId].color;
        const expected = new Color(parseArg(r), parseArg(g), parseArg(b));
        expect(Color.equals(actual, expected)).to.be.true;
    }

    @then(/^([\w\d_]+).ambient = ([^,]+)$/)
    public thenAmbientEquals(matId: string, value: string) {
        const actual = this.workspace.materials[matId].ambient;
        const expected = parseArg(value);
        expect(actual).to.be.closeTo(expected, 0.0001);
    }

    @then(/^([\w\d_]+).diffuse = ([^,]+)$/)
    public thenDiffuseEquals(matId: string, value: string) {
        const actual = this.workspace.materials[matId].diffuse;
        const expected = parseArg(value);
        expect(actual).to.be.closeTo(expected, 0.0001);
    }

    @then(/^([\w\d_]+).specular = ([^,]+)$/)
    public thenSpecularEquals(matId: string, value: string) {
        const actual = this.workspace.materials[matId].specular;
        const expected = parseArg(value);
        expect(actual).to.be.closeTo(expected, 0.0001);
    }

    @then(/^([\w\d_]+).shininess = ([^,]+)$/)
    public thenShininessEquals(matId: string, value: string) {
        const actual = this.workspace.materials[matId].shininess;
        const expected = parseArg(value);
        expect(actual).to.be.closeTo(expected, 0.0001);
    }

    @given(/^([\w\d_]+) ← point_light\(point\(([^,]+), ([^,]+), ([^,]+)\), color\(([^,]+), ([^,]+), ([^,]+)\)\)$/)
    public whenLightCreatedFromPointColor(lightId: string, x: string, y: string, z: string, r: string, g: string, b: string) {
        this.workspace.lights[lightId] = new Light(
            point(parseArg(x), parseArg(y), parseArg(z)),
            new Color(parseArg(r), parseArg(g), parseArg(b))
        );
    }

    @when(/^([\w\d_]+) ← lighting\(([^,]+), ([^,]+), ([^,]+), ([^,]+), ([^,]+)\)$/)
    public lightingResult(resColorId: string, matId: string, lightId: string, positionId: string, eyeVectorId: string, normalVectorId: string) {
        this.workspace.colors[resColorId] = this.workspace.materials[matId].lighting(this.workspace.tuples[positionId], this.workspace.tuples[eyeVectorId], this.workspace.tuples[normalVectorId], this.workspace.lights[lightId], false);
    }

    @given(/^([\w\d_]+) ← true$/)
    public givenInShadow(testVar: string) {
        this.workspace.tests[testVar] = true;
    }

    @when(/^([\w\d_]+) ← lighting\(([^,]+), ([^,]+), ([^,]+), ([^,]+), ([^,]+), ([^,]+)\)$/)
    public lightingResultWShadow(resColorId: string, matId: string, lightId: string, positionId: string,
                                 eyeVectorId: string, normalVectorId: string, shadowTestId: string) {
        this.workspace.colors[resColorId] = this.workspace.materials[matId].lighting(this.workspace.tuples[positionId], this.workspace.tuples[eyeVectorId], this.workspace.tuples[normalVectorId], this.workspace.lights[lightId], this.workspace.tests[shadowTestId]);
    }

    @given(/^([\w\d_]+).pattern ← stripe_pattern\(color\(([\w\d_]+), ([\w\d_]+), ([\w\d_]+)\), color\(([\w\d_]+), ([\w\d_]+), ([\w\d_]+)\)\)$/)
    public givenPattern(matId: string, ar: string, ag: string, ab: string, br: string, bg: string, bb: string) {
        const m = this.workspace.materials[matId].replace('pattern',
            stripe_pattern(
                new Color(parseArg(ar), parseArg(ag), parseArg(ab)),
                new Color(parseArg(br), parseArg(bg), parseArg(bb)
                )
            )
        );

        this.workspace.materials[matId] = m;
    }

    @given(/^([\w\d_]+).diffuse ← ([^,]+)$/)
    public givenDiffuse(matId: string, value: string) {
        const m = this.workspace.materials[matId].replace('diffuse', parseArg(value));
        this.workspace.materials[matId] = m;
    }

    @given(/^([\w\d_]+).specular ← ([^,]+)$/)
    public givenSpecular(matId: string, value: string) {
        const m = this.workspace.materials[matId].replace('specular', parseArg(value));
        this.workspace.materials[matId] = m;
    }

    @when(/^([\w\d_]+) ← lighting\(([^,]+), ([^,]+), point\(([^,]+), ([^,]+), ([^,]+)\), ([^,]+), ([^,]+), ([^,]+)\)$/)
    public lightingByPointResultWShadow(resColorId: string, matId: string, lightId: string, x: string, y: string, z: string,
                                        eyeVectorId: string, normalVectorId: string, shadowTestId: string) {
        this.workspace.colors[resColorId] = this.workspace.materials[matId].lighting(point(parseArg(x), parseArg(y), parseArg(z)), this.workspace.tuples[eyeVectorId], this.workspace.tuples[normalVectorId], this.workspace.lights[lightId], this.workspace.tests[shadowTestId]);
    }

    @then(/^([\w\d_]+).reflective = ([^,]+)$/)
    public thenReflectivesEquals(matId: string, value: string) {
        const actual = this.workspace.materials[matId].reflective;
        const expected = parseArg(value);
        expect(actual).to.be.closeTo(expected, 0.0001);
    }

    @then(/^([\w\d_]+).transparency = ([^,]+)$/)
    public thenTransparencyEquals(matId: string, value: string) {
        const actual = this.workspace.materials[matId].transparency;
        const expected = parseArg(value);
        expect(actual).to.be.closeTo(expected, 0.0001);
    }

    @then(/^([\w\d_]+).refractive_index = ([^,]+)$/)
    public thenRefractiveIndexEquals(matId: string, value: string) {
        const actual = this.workspace.materials[matId].refractive_index;
        const expected = parseArg(value);
        expect(actual).to.be.closeTo(expected, 0.0001);
    }
}

export = MaterialsSteps;