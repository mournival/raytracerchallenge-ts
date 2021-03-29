import {Workspace} from "./Workspace";
import {binding, given, then} from "cucumber-tsflow/dist";
import {parseArg, Util} from "../../src/util";
import {expect} from 'chai';
import {fail} from "assert";

@binding([Workspace])
export class UtilsSteps {
    constructor(protected workspace: Workspace) {
    }

    @given(/^number ([\w]+) ← (.+)$/)
    public givenArgValueOf(numberId: string, n: string) {
        if (n === 'inf') {
            this.workspace.numbers[numberId] = Number.POSITIVE_INFINITY
        } else if (n === '-inf') {
            this.workspace.numbers[numberId] = Number.NEGATIVE_INFINITY
        } else {
            this.workspace.numbers[numberId] = parseArg(n)
        }
    }

    @then(/^parseArg\(([\w]+)\) = ([+-]?[0-9]+.[0-9]+)$/)
    public thenParsedArgIsFloatVal(numberId: string, value: string) {
        expect(this.workspace.numbers[numberId]).to.be.closeTo(Number.parseFloat(value), 0.0001)
    }

    @then(/^parseArg\(([\w]+)\) = ([+-]?[0-9]+)$/)
    public thenParsedArgIsIntValue(numberId: string, value: string) {
        expect(this.workspace.numbers[numberId]).to.be.closeTo(Number.parseInt(value), 0.0001)
    }

    @then(/^Compare (.+) (..) (.+)$/)
    public thenLhsOpRhs(lhs: string, op: string, rhs: string) {
        switch (op) {
            case '==':
                expect(Util.closeTo(
                    this.workspace.numbers[lhs],
                    this.workspace.numbers[rhs]
                )).to.be.true
                break
            case '!=':
                expect(Util.closeTo(
                    this.workspace.numbers[lhs],
                    this.workspace.numbers[rhs]
                )).to.be.false
                break
            default:
                throw new Error()
        }
    }
}

