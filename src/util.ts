export class Util {
    public static readonly EPSILON = 0.0001;

    static closeTo(lhs: number, rhs: number) {
        return Math.abs(lhs - rhs) < Util.EPSILON;
    }
}

export function parseArg(s: string): number {
    if (typeof s === 'number')
        return s;

    s = s.trim();

    // int
    if (s.match(/^[+-]?\d+$/))
        return parseInt(s);

    // simple float
    if (s.match(/^([+-]?\d*?\.\d*)$/))
        return parseFloat(s);

    // √
    if (s.match(/^√\d+\s*\/\s*\d+$/)) {
        const matchArray = s.split('/');
        return Math.sqrt(parseInt(matchArray[0].slice(1))) / parseInt(matchArray[1]);
    }
    if (s.match(/^-√\d+$/)) {
        return -Math.sqrt(parseInt(s.slice(2)));
    }
    if (s.match(/^-√\d+\s*\/\s*\d+$/)) {
        const matchArray = s.split('/');
        return -Math.sqrt(parseInt(matchArray[0].slice(2))) / parseInt(matchArray[1]);
    }

    // π
    if (s.match(/^π\s*\/\s*\d+$/)) {
        const matchArray = s.split('/');
        return Math.PI / parseInt(matchArray[1]);
    }

    // rational
    if (s.match(/^[+-]?\d+\s*\/\s*\d+$/)) {
        const matchArray = s.split('/');
        return parseInt(matchArray[0]) / parseInt(matchArray[1]);
    }
    if (s.match(/^√\d+$/)) {
        return Math.sqrt(parseInt(s.slice(1)));
    }

    // irrational ratio
    throw 'Parse error: ' + s;

}