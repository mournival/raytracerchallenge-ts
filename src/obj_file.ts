import {point, Tuple} from './tuple';
import {parseArg} from './util';
import {Triangle} from './triangle';
import {Shape} from './shape';
import {Group} from './group';
import {Material} from './material';
import {Matrix} from './matrix';

export class Parser {

    public readonly vertices: Tuple[];
    public readonly faces: Shape[];
    public readonly ingnoredCount: number;
    public readonly default_group: Group;
    constructor(public readonly lines: string[]) {
        let skipped = 0;
        let verts: Tuple[] = [];
        let triangles: Triangle[] = [];
        lines.map(l => l.toString()).forEach(l => {
            if (l.startsWith('v ')) {
                let tokens: string[] = l.split(' ');
                if (tokens.length != 4) {
                    skipped++;
                } else {
                    verts.push(point(parseArg(tokens[1]), parseArg(tokens[2]), parseArg(tokens[3])));
                }
            } if (l.startsWith('f ')) {
                let tokens: string[] = l.split(' ');
                if (tokens.length < 4) {
                    skipped++;
                } else {
                    for (let j = 2; j < tokens.length - 1; ++j) {
                        triangles.push(new Triangle(
                            verts[parseArg(tokens[1]) -1],
                            verts[parseArg(tokens[j]) -1],
                            verts[parseArg(tokens[j + 1]) -1])
                        );
                    }
                }
            }
            else
             {
                skipped++;
            }
        });

        this.ingnoredCount = skipped;
        this.vertices = verts;
        this.default_group = new Group(Matrix.identity(), new  Material(), triangles);
        this.faces = this.default_group.children;
    }


}

export class ObjFile {
    constructor(public readonly data: String) {
    }

    public get parser(): Parser {
        return new Parser(this.data.split('\n'));
    }


}
