import {before, binding, given, then, when} from 'cucumber-tsflow';
import {parseArg, shouldEqualMsg, Workspace} from './Workspace';
import {World} from '../../src/world';
import {expect} from 'chai';
import {point, Tuple} from '../../src/tuple';
import {Color} from '../../src/color';

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

}

export = WorldsSteps;