import {StepDefinitions} from 'jest-cucumber';
import {ObjFileArray, ParserArray} from "./types";
import {Group, Shape, SmoothTriangle, Triangle} from "../../src/shapes";
import {ObjFile} from "../../src/obj_file";
import * as fs from "fs";
import {point, Tuple, vector} from "../../src/tuple";
import {parseArg} from "../../src/util";
import {shapes} from "./steps";

export const objFileSteps: StepDefinitions = ({given, when, then}) => {
    let objFiles: ObjFileArray;
    let parsers: ParserArray;
    
    beforeAll(() => {
        objFiles = {}
        parsers = {}
    })
    
 given(/^([\w\d_]+) ← a file containing:$/, (objFileId: string, docString: any) => {
        objFiles[objFileId] = new ObjFile(docString);
    })

    when(/^([\w\d_]+) ← parse_obj_file\(([\w\d_]+)\)$/, (parserId: string, objFileId: string) => {
        parsers[parserId] = objFiles[objFileId].parser;
    })

    then(/^([\w\d_]+) should have ignored ([\d]+) lines$/, (parserId: string, count: string) => {
        const actual = parsers[parserId].ignoredCount;
        const expected = parseArg(count);

        expect(actual).toEqual(expected);
    })

    then(/^([\w\d_]+).vertices\[([\d]+)] = point\(([^,]+), ([^,]+), ([^,]+)\)$/, (parserId: string, vertexId: string, x: string, y: string, z: string) => {
        const actual = parsers[parserId].vertices[parseArg(vertexId) - 1];
        const expected = point(parseArg(x), parseArg(y), parseArg(z));

        expect(Tuple.equals(actual, expected)).toBeTruthy()
    })

    given(/^([\w\d_]+) ← ([\w\d_]+).default_group$/, (groupId: string, parserId: string) => {
        shapes[groupId] = parsers[parserId].getGroup('default_group');
    })

    given(/^([\w\d_]+) ← first child of ([\w\d_]+)$/, (shapeId: string, groupdId: string) => {
        shapes[shapeId] = (shapes[groupdId] as Group).children[0];
    })

    given(/^([\w\d_]+) ← second child of ([\w\d_]+)$/, (shapeId: string, groupdId: string) => {
        shapes[shapeId] = (shapes[groupdId] as Group).children[1];
    })

    then(/^([\w\d_]+)\.([\w\d_]+) = ([\w\d_]+).vertices\[([\d]+)]$/,
        (traingleId: string, pointField: string, parserId: string, vertexId: string) => {
        const t = shapes[traingleId] as Triangle;
        let actual: Tuple;
        switch (pointField) {
            case 'p1':
                actual = t.p1;
                break;
            case 'p2':
                actual = t.p2;
                break;
            case 'p3':
                actual = t.p3;
                break;
            default:
                fail('Unexpected vertex');
                actual = point(0, 0, 0);
        }
        const expected = parsers[parserId].vertices[parseArg(vertexId) - 1];

        expect(Tuple.equals(actual, expected)).toBeTruthy()
    })

    given(/^([\w\d_]+) ← third child of ([\w\d_]+)$/, (shapeId: string, groupdId: string) => {
        shapes[shapeId] = (shapes[groupdId] as Group).children[2];
    })

    given(/^([\w\d_]+) ← the file "(.+)"$/, (objFileId: string, fileName: string) => {
        objFiles[objFileId] = new ObjFile(fs.readFileSync('./files/' + fileName, 'utf8'));
    })

    when(/^([\w\d_]+) ← "([\w\d_]+)" from ([\w\d_]+)/, (groupId: string, groupName: string, parserId: string) => {
        shapes[groupId] = parsers[parserId].getGroup(groupName);
    })

    when(/^([\w\d_]+) ← obj_to_group\(([\w\d_]+)\)$/, (groupId: string, parserId: string) => {
        shapes[groupId] = parsers[parserId].getGroup();
    })

    then(/^([\w\d_]+) includes "([\w\d_]+)" from ([\w\d_]+)$/, (groupId: string, groupName: string, parserId: string) => {
        const value = parsers[parserId].getGroup(groupName);

        const group = shapes[groupId] as Group;
        expect(group.includes(value)).toBeTruthy()
    })

    then(/^([\w\d_]+)\.normals\[(\d+)] = vector\(([^,]+), ([^,]+), ([^,]+)\)$/, (parserId: string, normalIndex: string, x: string, y: string, z: string) => {
        const actual = parsers[parserId].normals[parseArg(normalIndex) - 1];
        const expected = vector(parseArg(x), parseArg(y), parseArg(z));

        expect(Tuple.equals(actual, expected)).toBeTruthy()
    })

    then(/^([\w\d_]+)\.([\w\d_]+) = ([\w\d_]+).normals\[([\d]+)]$/, (traingleId: string, normalField: string, parserId: string, normalId: string) => {
        const t = shapes[traingleId] as SmoothTriangle;
        let actual: Tuple;
        switch (normalField) {
            case 'n1':
                actual = t.n1;
                break;
            case 'n2':
                actual = t.n2;
                break;
            case 'n3':
                actual = t.n3;
                break;
            default:
                fail('Unexpected vertex');
                actual = point(0, 0, 0);
        }
        const expected = parsers[parserId].normals[parseArg(normalId) - 1];

        expect(Tuple.equals(actual, expected)).toBeTruthy()
    })

    then(/^t2 = t1$/, () => {
        const actual = shapes['t2'];
        const expected = shapes['t1'];

        expect(Shape.equals(actual, expected)).toBeTruthy()
    })
}