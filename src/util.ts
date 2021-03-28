export class Util {
    public static readonly EPSILON = 0.0001;

    static closeTo(lhs: number, rhs: number): boolean {
        return (lhs === Number.NEGATIVE_INFINITY && rhs === Number.NEGATIVE_INFINITY) ||
            (lhs === Number.POSITIVE_INFINITY && rhs === Number.POSITIVE_INFINITY) ||
            Math.abs(lhs - rhs) < Util.EPSILON;
    }
}

export function parseArg(s: string): number {
    const a = s.replace(/\s/g, '').trim();

    // int
    if (a.match(/^-?\d+$/)) {
        return parseInt(a);
    }

    // rational
    if (a.match(/^-?\d+\/\d+/)) {
        const matchArray = a.split('/');
        return parseInt(matchArray[0]) / parseInt(matchArray[1]);
    }

    // simple float
    if (a.match(/^-?[0-9]+.[0-9]+/))
        return parseFloat(s);

    // √
    if (a.match(/-√\d+$/)) {
        return -Math.sqrt(parseInt(s.slice(2)));
    }
    if (a.match(/-√\d+\/\d+/)) {
        const matchArray = s.split('/');
        return -Math.sqrt(parseInt(matchArray[0].slice(2))) / parseInt(matchArray[1]);
    }
    if (a.match(/√\d+$/)) {
        return Math.sqrt(parseInt(s.slice(1)));
    }
    if (a.match(/√\d+\/\d+/)) {
        const matchArray = s.split('/');
        return Math.sqrt(parseInt(matchArray[0].slice(1))) / parseInt(matchArray[1]);
    }

    // π
    if (a.match(/π\/\d+/)) {
        const matchArray = a.split('/');
        return Math.PI / parseInt(matchArray[1]);
    }

    // irrational ratio
    throw 'Parse error: ' + s;

}