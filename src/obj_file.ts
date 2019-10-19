import {Ray} from './ray';
import {Shape} from './shape';

export class Parser {
    constructor(public readonly lines: string[]) {
    }

    get ingnoredCount(): number {
        return this.lines.length;
    }


}

export class ObjFile {
    constructor(public readonly data: String) {
    }

    public get parser(): Parser {
        return new Parser(this.data.split('\n'));
    }


}
