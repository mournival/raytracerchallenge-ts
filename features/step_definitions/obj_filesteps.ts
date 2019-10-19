import {binding, given, then, when} from 'cucumber-tsflow';
import {shouldEqualMsg, Workspace} from './Workspace';
import {ObjFile} from '../../src/obj_file';
import {expect} from 'chai';
import {parseArg} from '../../src/util';
import {point, Tuple} from '../../src/tuple';

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
}

export = ObjFileSteps;