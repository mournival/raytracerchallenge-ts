import {binding, given, then, when} from 'cucumber-tsflow';
import {parseArg, shouldEqualMsg, Workspace} from './Workspace';
import {default_world, World} from '../../src/world';
import {expect} from 'chai';
import {Color} from "../../src/color";
import {Sphere} from "../../src/sphere";
import {fail} from "assert";
import {Matrix, scaling} from "../../src/matrix";
import {Material} from "../../src/material";

@binding([Workspace])
class WorldsSteps {

    constructor(protected workspace: Workspace) {
    }

    @when(/^([^,]+) ← world\(\)$/)
    public whenWorldCreated(worldId: string) {
        this.workspace.worlds[worldId] = new World();
    }

    @then(/^([^,]+) contains no objects$/)
    public thenEmptyObjects(worldId: string) {
        const actual = this.workspace.worlds[worldId].objects.length;
        const expected = 0;
        expect(actual, shouldEqualMsg(actual, expected)).to.equal(expected);
    }

    @then(/^([^,]+) has no light source$/)
    public thenEmptyLisghts(worldId: string) {
        const actual = this.workspace.worlds[worldId].lights.length;
        const expected = 0;
        expect(actual, shouldEqualMsg(actual, expected)).to.equal(expected);
    }

    @given(/^([^,]+) ← sphere\(\) with:$/)
    public givenSphereByProperties(sphereId: string, dataTable: { rawTable: [][] }) {
        this.workspace.spheres[sphereId] = parseRawTable(dataTable.rawTable);
    }

    @when(/^([^,]+) ← default_world\(\)$/)
    public whenDefaultWorld(worldId: string) {
        this.workspace.worlds[worldId] = default_world();
    }

    @then(/^([^,]+).light = ([^,]+)$/)
    public thenWorldLightEquals(worldId: string, lightId: string) {
        const actual = this.workspace.worlds[worldId].contains(this.workspace.lights[lightId]);
        return expect(actual,
            'world: ' + JSON.stringify(this.workspace.worlds[worldId]) + ' should have '
            + JSON.stringify(this.workspace.lights[lightId])
        ).to.be.true;
    }

    @then(/^([^,]+) contains ([^, ]+)$/)
    public thenWorldContainsSphere(worldId: string, objectId: string) {
        const actual = this.workspace.worlds[worldId].contains(this.workspace.spheres[objectId]);
        return expect(actual,
            'world: ' + JSON.stringify(this.workspace.worlds[worldId]) + ' should have '
            + JSON.stringify(this.workspace.spheres[objectId])).to.be.true;
    }
}

function parseRawTable(data: string[][]): Sphere {

    const rows = data.length;
    const cold = data[0].length;
    let color: Color = new Color(1, 1, 1);
    const ambient = 0.1;
    let diffuse = 0.9;
    let specular = 0.9;
    const shininess = 200.0;
    let t = Matrix.identity(4);
    for (let r = 0; r < rows; ++r) {
        switch (data[r][0]) {
            case 'material.color':
                color = new Color(0.8, 1.0, 0.6);
                break;
            case 'material.diffuse':
                diffuse = parseArg(data[r][1]);
                break;
            case 'material.specular':
                specular = parseArg(data[r][1]);
                break;
            case 'transform':
                t = scaling(0.5, 0.5, 0.5);
                break;
            default:
                fail('Unexpected field');
        }
    }
    const m = new Material(color, ambient, diffuse, specular, shininess);

    return new Sphere(t, m);
}

export = WorldsSteps;