import {binding, when} from 'cucumber-tsflow';
import {parseArg, shouldEqualMsg, Workspace} from './Workspace';
import {Triangle} from '../../src/triangle';
import {then} from 'cucumber-tsflow/dist';
import {Tuple, vector} from '../../src/tuple';
import {expect} from 'chai';
import {fail} from 'assert';

@binding([Workspace])
class TrianglesSteps {

    constructor(protected workspace: Workspace) {
    }

    @when(/^([\w\d_]+) ← triangle\(([^,]+), ([^,]+), ([^,]+)\)$/)
    public whenLightCreated(lightId: string, p1Id: string, p2Id: string, p3Id: string) {
        this.workspace.shapes[lightId] = new Triangle(
            this.workspace.tuples[p1Id],
            this.workspace.tuples[p2Id],
            this.workspace.tuples[p3Id]
        );
    }


    @then(/^([\w\d_]+).(p[123]) = \2$/)
    public thenVertexIs(triangleId: string, vertexId: string) {
        let actual: Tuple;
        switch (vertexId) {
            case 'p1':
                actual = (this.workspace.shapes[triangleId] as Triangle).p1;
                break;
            case 'p2':
                actual = (this.workspace.shapes[triangleId] as Triangle).p2;
                break;
            case 'p3':
                actual = (this.workspace.shapes[triangleId] as Triangle).p3;
                break;
            default:
                fail('Unexpected vertex id');
                actual = vector(0, 0, 0);
        }
        const expected = this.workspace.tuples[vertexId];
        expect(Tuple.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }

    @then(/^([\w\d_]+).(e[123]) = vector\(([^,]+), ([^,]+), ([^,]+)\)$/)
    public thenEdgeIs(triangleId: string, edgeId: string, x: string, y: string, z: string) {
        let actual: Tuple;
        switch (edgeId) {
            case 'e1':
                actual = (this.workspace.shapes[triangleId] as Triangle).e1;
                break;
            case 'e2':
                actual = (this.workspace.shapes[triangleId] as Triangle).e2;
                break;
            default:
                fail('Unexpected edge id');
                actual = vector(0, 0, 0);
        }
        const expected = vector(parseArg(x), parseArg(y), parseArg(z));
        expect(Tuple.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }

    @then(/^([\w\d_]+).(normal) = vector\(([^,]+), ([^,]+), ([^,]+)\)$/)
    public thenNormaldgeIs(triangleId: string, edgeId: string, x: string, y: string, z: string) {
        const actual = (this.workspace.shapes[triangleId] as Triangle).normal;
        const expected = vector(parseArg(x), parseArg(y), parseArg(z));
        expect(Tuple.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }
}

export = TrianglesSteps;