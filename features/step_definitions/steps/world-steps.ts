import {StepDefinitions} from 'jest-cucumber';
import {DataTableType, WorldArray} from "../types";
import {default_world, World} from "../../../src/world";
import {colors, intersection, intersections, lights, parseRawShapeTable, rays, shapes, tuples} from "../steps";
import {PreComputations} from "../../../src/pre-computations";
import {Light} from "../../../src/light";
import {Color} from "../../../src/color";
import {point} from "../../../src/tuple";
import {parseArg} from "../../../src/util";

export let worlds: WorldArray;

export const worldSteps: StepDefinitions = ({given, and, when, then}) => {
    beforeAll(() => {
        worlds = {}
    })

    given(/^([\w\d_]+) ← world\(\)$/, (worldId: string) => {
        worlds[worldId] = new World();
    })

    and(/^([\w\d_]+).light ← point_light\(point\(([^,]+), ([^,]+), ([^,]+)\), color\(([^,]+), ([^,]+), ([^,]+)\)\)$/,
        (worldid: string, x: string, y: string, z: string, r: string, g: string, b: string) => {
            worlds[worldid] = new World([
                    new Light(point(parseArg(x), parseArg(y), parseArg(z)), new Color(parseArg(r), parseArg(g), parseArg(b)))
                ],
                worlds[worldid].objects
            );
        })

    and(/^([\w\d_]+) ← the second object in ([^,]+)$/, (objId: string, worldId: string) => {
        shapes[objId] = worlds[worldId].objects[1];
    })

    and(/^([\w\d_]+).material.ambient ← ([^,]+)$/, (shapeId: string, value: string) => {
        const w = worlds['w'];
        const s = shapes[shapeId];

        shapes[shapeId] = s.replace(s.material.replace('ambient', parseArg(value)));
        worlds['w'] = w.replace(s, shapes[shapeId]);
    })

    and(/^([\w\d_]+) = ([\w\d_]+).material.color$/, (colorId: string, objId: string) => {
        expect(Color.equals(colors[colorId], shapes[objId].material.color)).toBeTruthy()
    })

    and(/^([\w\d_]+) ← reflected_color\(([\w\d_]+), ([\w\d_]+)\)$/, (colorId: string, worldId: string, pcId: string) => {
        colors[colorId] = worlds[worldId].reflected_color(intersection[pcId] as PreComputations, 1);
    })

    and(/^([\w\d_]+) ← reflected_color\(([\w\d_]+), ([\w\d_]+), ([^,]+)\)$/, (colorId: string, worldId: string, pcId: string, level: string) => {
        colors[colorId] = worlds[worldId].reflected_color(intersection[pcId] as PreComputations, parseArg(level));
    })

    and(/^([\w\d_]+) has:$/, (shapeId: string, dataTable: DataTableType) => {
        const orig = shapes[shapeId];
        const updated = parseRawShapeTable(dataTable, 'sphere');
        shapes[shapeId] = updated;
        worlds['w'] = worlds['w'].replace(orig, updated);
    })

    and(/^([\w\d_]+) ← shade_hit\(([^,]+), ([^,]+), ([^,]+)\)$/, (colorId: string, worldId: string, pcId: string, remaining: string) => {
        colors[colorId] = worlds[worldId].shade_hit(intersection[pcId] as PreComputations, parseArg(remaining));
    })

    when(/^([\w\d_]+) ← color_at\(([\w\d_]+), ([\w\d_]+)\)$/, (colorID: string, worldId: string, rayId: string) => {
        colors[colorID] = worlds[worldId].color_at(rays[rayId], 5);
    })

    when(/^([\w\d_]+) ← default_world\(\)$/, (worldId: string) => {
        worlds[worldId] = default_world();
    })

    then(/^([^,]+) contains no objects$/, (worldId: string) => {
        expect(worlds[worldId].objects.length).toEqual(0);
    })

    then(/^([^,]+) has no light source$/, (worldId: string) => {
        expect(worlds[worldId].lights.length).toEqual(0);
    })

    then(/^([\w\d_]+).light = ([^,]+)$/, (worldId: string, lightId: string) => {
        const actual = worlds[worldId].contains(lights[lightId]);
        return expect(actual).toBeTruthy()
    })

    then(/^([^,]+) contains ([^, ]+)$/, (worldId: string, objectId: string) => {
        const actual = worlds[worldId].contains(shapes[objectId]);
        return expect(actual).toBeTruthy()
    })

    then(/^([\w\d_]+) ← intersect_world\(([^,]+), ([^,]+)\)$/, (xsId: string, worldId: string, rayId: string) => {
        intersections[xsId] = worlds[worldId].intersect_world(rays[rayId]).sort((a, b) => a.t - b.t);
    })

    then(/^([\w\d_]+) ← the first object in ([^,]+)$/, (objId: string, worldId: string) => {
        shapes[objId] = worlds[worldId].objects[0];
    })

    then(/^([\w\d_]+) ← shade_hit\(([^,]+), ([^,]+)\)$/, (colorId: string, worldId: string, pcId: string) => {
        colors[colorId] = worlds[worldId].shade_hit(intersection[pcId] as PreComputations, 1);
    })

    then(/^is_shadowed\(([\w\d_]+), ([\w\d_]+)\) is false$/, (worldId: string, pointId: string) => {
        const actual = worlds[worldId].is_shadowed(tuples[pointId], worlds[worldId].lights[0]);
        expect(actual).toBeFalsy();
    })

    then(/^is_shadowed\(([\w\d_]+), ([\w\d_]+)\) is true$/, (worldId: string, pointId: string) => {
        const actual = worlds[worldId].is_shadowed(tuples[pointId], worlds[worldId].lights[0]);
        expect(actual).toBeTruthy()
    })

    then(/^([\w\d_]+) is added to ([\w\d_]+)$/, (objectId: string, worldId: string) => {
        const w = worlds[worldId];
        worlds[worldId] = new World(w.lights, [...w.objects, shapes[objectId]]);
    })

    then(/^color_at\(w, r\) should terminate successfully$/, () => {
        // not sure what the 'expect' should be
        worlds['w'].color_at(rays['r'], 5)
    })
}
