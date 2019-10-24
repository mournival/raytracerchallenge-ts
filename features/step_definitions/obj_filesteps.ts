import {binding, given, then, when} from 'cucumber-tsflow';
import {shouldEqualMsg, Workspace} from './Workspace';
import {ObjFile} from '../../src/obj_file';
import {expect} from 'chai';
import {parseArg} from '../../src/util';
import {point, Tuple} from '../../src/tuple';
import {Group} from '../../src/shapes/group';
import {Triangle} from '../../src/shapes/triangle';
import {fail} from 'assert';

const fs = require('fs');

@binding([Workspace])
class ObjFileSteps {

    constructor(protected workspace: Workspace) {
    }

    @given(/^([\w\d_]+) ← a file containing:$/)
    public givenObjFileData(objFileId: string, docString: any) {
        this.workspace.objFiles[objFileId] = new ObjFile(docString);
    }

    @when(/^([\w\d_]+) ← parse_obj_file\(([\w\d_]+)\)$/)
    public whenObjParserIs(parserId: string, objFileId: string) {
        this.workspace.parsers[parserId] = this.workspace.objFiles[objFileId].parser;
    }

    @then(/^([\w\d_]+) should have ignored ([\d]+) lines$/)
    public thenIgnoredLineEquals(parserId: string, count: string) {
        const actual = this.workspace.parsers[parserId].ingnoredCount;
        const expected = parseArg(count);

        expect(actual).to.be.equal(expected);
    }

    @then(/^([\w\d_]+).vertices\[([\d]+)] = point\(([^,]+), ([^,]+), ([^,]+)\)$/)
    public thenVertixNIs(parserId: string, vertexId: string, x: string, y: string, z: string) {
        const actual = this.workspace.parsers[parserId].vertices[parseArg(vertexId) - 1];
        const expected = point(parseArg(x), parseArg(y), parseArg(z));

        expect(Tuple.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }

    @given(/^([\w\d_]+) ← ([\w\d_]+).default_group$/)
    public givenParserGroup(groupId: string, parserId: string) {
        this.workspace.shapes[groupId] = this.workspace.parsers[parserId].getGroup('default_group');
    }

    @given(/^([\w\d_]+) ← first child of ([\w\d_]+)$/)
    public givenFirstChildOfGroup(shapeId: string, groupdId: string) {
        this.workspace.shapes[shapeId] = (this.workspace.shapes[groupdId] as Group).children[0];
    }

    @given(/^([\w\d_]+) ← second child of ([\w\d_]+)$/)
    public givenSecondChildOfGroup(shapeId: string, groupdId: string) {
        this.workspace.shapes[shapeId] = (this.workspace.shapes[groupdId] as Group).children[1];
    }

    @then(/^([\w\d_]+)\.([\w\d_]+) = ([\w\d_]+).vertices\[([\d]+)]$/)
    public thenTrianglePointEquals(traingleId: string, pointField: string, parserId: string, vertexId: string) {
        const t = this.workspace.shapes[traingleId] as Triangle;
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
        const expected = this.workspace.parsers[parserId].vertices[parseArg(vertexId) - 1];

        expect(Tuple.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }

    @given(/^([\w\d_]+) ← third child of ([\w\d_]+)$/)
    public givenThirdChildOfGroup(shapeId: string, groupdId: string) {
        this.workspace.shapes[shapeId] = (this.workspace.shapes[groupdId] as Group).children[2];
    }

    @given(/^([\w\d_]+) ← the file "(.+)"$/)
    public givenObjFile(objFileId: string, fileName: string) {
        this.workspace.objFiles[objFileId] = new ObjFile(fs.readFileSync('./files/' + fileName, 'utf8'));
    }

    @when(/^([\w\d_]+) ← "([\w\d_]+)" from ([\w\d_]+)/)
    public whenNamedGroupIs(groupId: string, groupName: string, parserId: string) {
        this.workspace.shapes[groupId] = this.workspace.parsers[parserId].getGroup(groupName);
    }

    @when(/^([\w\d_]+) ← obj_to_group\(([\w\d_]+)\)$/)
    public whenGroupFromParser(groupId: string, parserId: string) {
        this.workspace.shapes[groupId] = this.workspace.parsers[parserId].getGroup();
    }

    @then(/^([\w\d_]+) includes "([\w\d_]+)" from ([\w\d_]+)$/)
    public thenGroupIncludesNamedGroup(groupId: string, groupName: string, parserId: string) {
        const value = this.workspace.parsers[parserId].getGroup(groupName);

        const group = this.workspace.shapes[groupId] as Group;
        expect(group.includes(value)).to.be.true;
    }
}

export = ObjFileSteps;