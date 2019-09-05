import {binding, given, then, when} from 'cucumber-tsflow';
import {parseArg, Workspace} from './Workspace';
import {lighting, Material} from '../../src/material';
import {expect} from 'chai';
import {Color} from '../../src/color';
import {Light} from '../../src/light';
import {point} from '../../src/tuple';

@binding([Workspace])
class MaterialsSteps {
    constructor(protected workspace: Workspace) {
    }

    @given(/^(\w+) ← material\(\)$/)
    public givenMaterial(matId: string) {
        this.workspace.materials[matId] = new Material();
    }

    @then(/^(\w+).color = color\(([^,]+), ([^,]+), ([^,]+)\)$/)
    public thenColorEquals(matId: string, r: string, g: string, b: string) {
        const actual = this.workspace.materials[matId].color;
        const expected = new Color(parseArg(r), parseArg(g), parseArg(b));
        expect(Color.equals(actual, expected)).to.be.true;
    }

    @then(/^(\w+).ambient = ([^,]+)$/)
    public thenAmbientEquals(matId: string, value: string) {
        const actual = this.workspace.materials[matId].ambient;
        const expected = parseArg(value);
        expect(actual).to.be.closeTo(expected, 0.0001);
    }

    @then(/^(\w+).diffuse = ([^,]+)$/)
    public thenDiffuseEquals(matId: string, value: string) {
        const actual = this.workspace.materials[matId].diffuse;
        const expected = parseArg(value);
        expect(actual).to.be.closeTo(expected, 0.0001);
    }

    @then(/^(\w+).specular = ([^,]+)$/)
    public thenSpecularEquals(matId: string, value: string) {
        const actual = this.workspace.materials[matId].specular;
        const expected = parseArg(value);
        expect(actual).to.be.closeTo(expected, 0.0001);
    }

    @then(/^(\w+).shininess = ([^,]+)$/)
    public thenShininessEquals(matId: string, value: string) {
        const actual = this.workspace.materials[matId].shininess;
        const expected = parseArg(value);
        expect(actual).to.be.closeTo(expected, 0.0001);
    }

    @given(/^([^,]+) ← point_light\(point\(([^,]+), ([^,]+), ([^,]+)\), color\(([^,]+), ([^,]+), ([^,]+)\)\)$/)
    public whenLightCreatedFromPointColor(lightId: string, x: string, y: string, z: string, r: string, g: string, b: string) {
        this.workspace.lights[lightId] = new Light(
            point(parseFloat(x), parseFloat(y), parseFloat(z)),
            new Color(parseArg(r), parseArg(g), parseArg(b))
        );
    }

    @when(/^([^,]+) ← lighting\(([^,]+), ([^,]+), ([^,]+), ([^,]+), ([^,]+)\)$/)
    public lightingResult(resColorId: string, matId: string, lightId: string, positionId: string, eyeVectorId: string, normalVectorId: string) {
        this.workspace.colors[resColorId] = lighting(
            this.workspace.materials[matId],
            this.workspace.lights[lightId],
            this.workspace.tuples[positionId],
            this.workspace.tuples[eyeVectorId],
            this.workspace.tuples[normalVectorId]
        );
    }
}

export = MaterialsSteps;