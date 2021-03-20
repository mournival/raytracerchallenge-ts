export class Util {
    public static readonly EPSILON = 0.0001;

    static closeTo(lhs: number, rhs: number) {
        return (lhs === Number.NEGATIVE_INFINITY && rhs === Number.NEGATIVE_INFINITY) ||
            (lhs === Number.POSITIVE_INFINITY && rhs === Number.POSITIVE_INFINITY) ||
            Math.abs(lhs - rhs) < Util.EPSILON;
    }
}

export function parseArg(s: string): number {
    if (typeof s === 'number')
        return s;

    s = s.replace(/\s/g, '').trim();

    // int
    if (s.match(/^-?\d+$/))
        return parseInt(s);

    // rational
    if (s.match(/^-?\d+\/\d+/)) {
        const matchArray = s.split('/');
        return parseInt(matchArray[0]) / parseInt(matchArray[1]);
    }

    // simple float
    if (s.match(/^-?[0-9]+.[0-9]+/))
        return parseFloat(s);

    // √
    if (s.match(/^√\d+$/)) {
        return Math.sqrt(parseInt(s.slice(1)));
    }

    if (s.match(/^√\d+\/\d+/)) {
        const matchArray = s.split('/');
        return Math.sqrt(parseInt(matchArray[0].slice(1))) / parseInt(matchArray[1]);
    }
    if (s.match(/^-√\d+$/)) {
        return -Math.sqrt(parseInt(s.slice(2)));
    }
    if (s.match(/^-√\d+\/\d+/)) {
        const matchArray = s.split('/');
        return -Math.sqrt(parseInt(matchArray[0].slice(2))) / parseInt(matchArray[1]);
    }

    // π
    if (s.match(/^π\/\d+/)) {
        const matchArray = s.split('/');
        return Math.PI / parseInt(matchArray[1]);
    }

    // irrational ratio
    throw 'Parse error: ' + s;

}