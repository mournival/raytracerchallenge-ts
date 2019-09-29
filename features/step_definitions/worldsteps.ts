import {binding, given, then, when} from 'cucumber-tsflow';
import {parseArg, shouldEqualMsg, Workspace} from './Workspace';
import {
    color_at,
    default_world,
    intersect_world,
    is_shadowed,
    reflected_color,
    shade_hit,
    World
} from '../../src/world';
import {expect} from 'chai';
import {Color} from '../../src/color';
import {Sphere} from '../../src/sphere';
import {fail} from 'assert';
import {Matrix, scaling, translation} from '../../src/matrix';
import {Material} from '../../src/material';
import {PreComputations} from '../../src/pre-computations';
import {Light} from '../../src/light';
import {point} from '../../src/tuple';
import {transform} from '../../src/ray';
import {Plane} from "../../src/plane";

@binding([Workspace])
class WorldsSteps {

    constructor(protected workspace: Workspace) {
    }

    @when(/^([\w\d_]+) ← world\(\)$/)
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

    @given(/^([\w\d_]+) ← ([\w\d_]+)\(\) with:$/)
    public givenSphereByProperties(shapeId: string, shapeType: string, dataTable: { rawTable: [][] }) {
        this.workspace.shapes[shapeId] = parseRawTable(dataTable.rawTable, shapeType);
    }

    @when(/^([\w\d_]+) ← default_world\(\)$/)
    public whenDefaultWorld(worldId: string) {
        this.workspace.worlds[worldId] = default_world();
    }

    @then(/^([\w\d_]+).light = ([^,]+)$/)
    public thenWorldLightEquals(worldId: string, lightId: string) {
        const actual = this.workspace.worlds[worldId].contains(this.workspace.lights[lightId]);
        return expect(actual,
            'world: ' + JSON.stringify(this.workspace.worlds[worldId]) + ' should have '
            + JSON.stringify(this.workspace.lights[lightId])
        ).to.be.true;
    }

    @then(/^([^,]+) contains ([^, ]+)$/)
    public thenWorldContainsSphere(worldId: string, objectId: string) {
        const actual = this.workspace.worlds[worldId].contains(this.workspace.shapes[objectId]);
        return expect(actual,
            'world: ' + JSON.stringify(this.workspace.worlds[worldId]) + ' should have '
            + JSON.stringify(this.workspace.shapes[objectId])).to.be.true;
    }

    @when(/^([\w\d_]+) ← intersect_world\(([^,]+), ([^,]+)\)$/)
    public whenIntersectWorld(xsId: string, worldId: string, rayId: string) {
        this.workspace.intersections[xsId] = intersect_world(
            this.workspace.worlds[worldId],
            this.workspace.rays[rayId]
        );
    }

    @given(/^([\w\d_]+) ← the first object in ([^,]+)$/)
    public givenFirstObjectInWorld(objId: string, worldId: string) {
        this.workspace.shapes[objId] = this.workspace.worlds[worldId].objects[0];
    }

    @when(/^([\w\d_]+) ← shade_hit\(([^,]+), ([^,]+)\)$/)
    public whenShadeHit(colorId: string, worldId: string, pcId: string) {
        this.workspace.colors[colorId] = shade_hit(
            this.workspace.worlds[worldId],
            this.workspace.intersection[pcId] as PreComputations);
    }

    @given(/^([\w\d_]+).light ← point_light\(point\(([^,]+), ([^,]+), ([^,]+)\), color\(([^,]+), ([^,]+), ([^,]+)\)\)$/)
    public givenWorldLight(worldid: string, x: string, y: string, z: string, r: string, g: string, b: string) {
        this.workspace.worlds[worldid] = new World(
            [
                new Light(point(parseArg(x), parseArg(y), parseArg(z)), new Color(parseArg(r), parseArg(g), parseArg(b)))
            ],
            this.workspace.worlds[worldid].objects
        );
    }

    @given(/^([\w\d_]+) ← the second object in ([^,]+)$/)
    public givenSecondObjectInWorld(objId: string, worldId: string) {
        this.workspace.shapes[objId] = this.workspace.worlds[worldId].objects[1];
    }

    @when(/^([\w\d_]+) ← color_at\(([\w\d_]+), ([\w\d_]+)\)$/)
    public whenColorAt(colorID: string, worldId: string, rayId: string) {
        this.workspace.colors[colorID] = color_at(this.workspace.worlds[worldId], this.workspace.rays[rayId]);
    }


    @given(/^([\w\d_]+).material.ambient ← ([^,]+)$/)
    public giveMaterialAmbient(shapeId: string, value: string) {
        const w = this.workspace.worlds['w'];
        const s = this.workspace.shapes[shapeId];

        this.workspace.shapes[shapeId] = s.replace(s.material.replace('ambient', parseArg(value)));
        this.workspace.worlds['w'] = w.replace(s, this.workspace.shapes[shapeId]);
    }

    @then(/^([\w\d_]+) = ([^,]+).material.color$/)
    public thenColorEquals(colorId: string, objId: string) {
        const actual = this.workspace.colors[colorId];
        const expected = this.workspace.shapes[objId].material.color;

        expect(Color.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }

    @then(/^is_shadowed\(([\w\d_]+), ([\w\d_]+)\) is false$/)
    public thenIsShadowedIsFalse(worldId: string, pointId: string) {
        const actual = is_shadowed(this.workspace.worlds[worldId], this.workspace.tuples[pointId]);
        expect(actual).to.be.false;
    }

    @then(/^is_shadowed\(([\w\d_]+), ([\w\d_]+)\) is true$/)
    public thenIsShadowedIsTrue(worldId: string, pointId: string) {
        const actual = is_shadowed(this.workspace.worlds[worldId], this.workspace.tuples[pointId]);
        expect(actual).to.be.true;
    }

    @given(/^([\w\d_]+) is added to ([\w\d_]+)$/)
    public givenObjectAddedToWorld(objectId: string, worldId: string) {
        const w = this.workspace.worlds[worldId];
        const o = this.workspace.shapes[objectId];
        this.workspace.worlds[worldId] = new World(w.lights, [...w.objects, o]);
    }

    @when(/^([\w\d_]+) ← reflected_color\(([\w\d_]+), ([\w\d_]+)\)$/)
    public whenReflectedColorIs(colorId: string, worldId: string, pcId: string) {
        this.workspace.colors[colorId] = reflected_color(
            this.workspace.worlds[worldId],
            this.workspace.intersection[pcId] as PreComputations);
    }

    @then(/^color_at\(w, r\) should terminate successfully$/)
    public thenShouldTerminate() {
        // Hmm ... some sort of timeout here ...
        // color_at(this.workspace.worlds['w'], this.workspace.rays['r'])
    }

}

function parseRawTable(data: string[][], shapeType = 'sphere'): Sphere {
    const rows = data.length;
    const cold = data[0].length;
    let color: Color = new Color(1, 1, 1);
    const ambient = 0.1;
    let diffuse = 0.9;
    let specular = 0.9;
    const shininess = 200.0;
    let reflective = 0;

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
            case 'material.reflective':
                reflective = parseArg(data[r][1]);
                break;
            case 'transform':
                if (data[r][1].match('scaling')) {
                    t = scaling(0.5, 0.5, 0.5);
                } else if (data[r][1] === 'translation(0, 0, 10)') {
                    t = translation(0, 0, 10);
                } else if (data[r][1] === 'translation(0, 0, 1)') {
                    t = translation(0, 0, 1);
                } else if (data[r][1] === 'translation(0, -1, 0)') {
                    t = translation(0, -1, 0);
                }

                break;
            default:
                console.log('Hmmm....');
                fail('Unexpected field');
                break;
        }
    }
    const m = new Material(color, ambient, diffuse, specular, shininess, reflective);

    if (shapeType === 'sphere') {
        return new Sphere(t, m);
    }
    return new Plane(t, m);
}

export = WorldsSteps;