import {binding, given, then, when} from 'cucumber-tsflow';
import {parseArg, Workspace} from './Workspace';
import {ObjFile} from '../../src/obj_file';
import {expect} from 'chai';

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

}

export = ObjFileSteps;