import {point, Tuple} from './tuple';
import {parseArg} from './util';
import {Group, Triangle} from './shapes';
import {Material} from './material';
import {Matrix} from './matrix';


interface GroupArray {
    [index: string]: Group;
}

export class Parser {

    groups: GroupArray = {};

    public readonly vertices: Tuple[];
    public readonly ingnoredCount: number;

    constructor(public readonly lines: string[]) {
        let skipped = 0;
        let verts: Tuple[] = [];
        let triangles: Triangle[] = [];
        let group_name = 'default_group';
        lines.map(l => l.toString()).forEach(l => {
            if (l.startsWith('v ')) {
                let tokens: string[] = l.split(' ');
                if (tokens.length != 4) {
                    skipped++;
                } else {
                    verts.push(point(parseArg(tokens[1]), parseArg(tokens[2]), parseArg(tokens[3])));
                }
            } else if (l.startsWith('f ')) {
                let tokens: string[] = l.split(' ');
                if (tokens.length < 4) {
                    skipped++;
                } else {
                    for (let j = 2; j < tokens.length - 1; ++j) {
                        triangles.push(new Triangle(
                            verts[parseArg(tokens[1]) - 1],
                            verts[parseArg(tokens[j]) - 1],
                            verts[parseArg(tokens[j + 1]) - 1])
                        );
                    }
                }
            } else if (l.startsWith('g ')) {
                this.groups[group_name] = new Group(Matrix.identity(), new Material(), triangles);
                triangles = [];
                group_name = l.slice(2);
            } else {
                skipped++;
            }
        });

        this.ingnoredCount = skipped;
        this.vertices = verts;
        this.groups[group_name] = new Group(Matrix.identity(), new Material(), triangles);
    }

    public getGroup(name?: string): Group {
        if (name) {
            return this.groups[name];
        }
        let grps: Group[] = [];
        for(let g in this.groups) {
            if (this.groups[g].children.length > 0) {
                grps = [...grps, this.groups[g]];
            }
        }
        return new Group(Matrix.identity(), new Material(), grps);
    }

}

export class ObjFile {
    constructor(public readonly data: String) {
    }

    public get parser(): Parser {
        return new Parser(this.data.split('\n'));
    }

}
