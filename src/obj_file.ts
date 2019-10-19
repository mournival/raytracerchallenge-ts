import {point, Tuple} from './tuple';
import {parseArg} from './util';

export class Parser {

    public readonly vertices: Tuple[];
    public readonly ingnoredCount: number;

    constructor(public readonly lines: string[]) {
        let skipped = 0;
        let verts: Tuple[] = [];
        lines.map(l => l.toString()).forEach(l => {
            if (l.startsWith('v ')) {
                let tokens: string[] = l.split(' ');
                if (tokens.length != 4) {
                    skipped++;
                } else {
                    verts.push(point(parseArg(tokens[1]), parseArg(tokens[2]), parseArg(tokens[3])));
                }
            } else {
                skipped++;
            }
        });

        this.ingnoredCount = skipped;
        this.vertices = verts;
    }


}

export class ObjFile {
    constructor(public readonly data: String) {
    }

    public get parser(): Parser {
        return new Parser(this.data.split('\n'));
    }


}
