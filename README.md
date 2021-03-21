# KHolvoet's TypeScript Ray Tracer

This is a TypeScript implementation of a Ray Trace as described in [The Ray Tracer Challenge](http://raytracerchallenge.com/). 
The principal objective is personal development (in particular mine), with an emphasis on:
* Learning Cucumber testing framework
* Improving my TypeScript
* Practicing fairly pure  aspects of TDD 
* (Finally) revisiting topics from a favorite graduate CS graphics class

Constraints
* Do **NOT** change / rewrite any of the given tests. 
* If adding tests to doc my discovered bugs / 'Putting it all together' implementations, they will be identified as added and separated from the original tests. 

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Assumed already installed:
- Node.js Ver 12+ (w/ npm)  
- Git
- <TBD>

Clone this repo

```
git clone https://github.com/kholvoet/raytracerchallenge.git
```

### Installing

To install the dependencies:
```
npm install
```

To run the demo code, run any of:
```
npm run particle
npm run clock
npm run ray-tracer1
npm run sphere-shadow
```
or 
```
npm run clock
```

## Running the tests

To run cucumber tests
```
npm test
```

## Built With

* [Typescript](https://www.typescriptlang.org/) - Principal development language
* [Cucumber](https://cucumber.io/) - Test framework
* [Node.js](https://nodejs.org/en/) - Run time
* [Stryker Mutator](https://stryker-mutator.io/) - Mutation test framework

## Contributing
*TBD*

## Versioning
*TBD*

## Authors

* **Kristian Holvoet** - *Initial work* - [kholvoet](https://github.com/kholvoet)

See also the list of [contributors](https://github.com/kholvoet/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc

## Developer Log

### TODO

- ✓ Figure TypeScript method / function overloading (if possible) [Probably figured this out]
- Create file utils to save canvas either as global or Canvas static or Canvas method.
- Fix mutable Matrix
- Fix mutable Canvas(?). Not entirely sure if this is the correct decision for the global model that may have 1M+ pixels.
- Refactor worldsteps.ts wrt inner/outer/world mutability
- Add stryker test scripts to package.json

### 20210321
- Updated libraries versions
- Added Stryker Mutation Testing<br>This was big. Learned a bit about this at work. It takes a wile to run the full test (~30 mins on my dev machine), but it can point to some real problem spots.
I did find non-trivial areas for fixing: the parseArgs() helper, and the Matrix class. 
- Learned some guideline
  - Test equality is commutative
  - Test the inequality one field at a time for classe (e.g., two of the same class that diffes in only one respect)
  - Fixing some mutations appears to allow more to surface (or styrker isn't deterministic)
  - In some cases, limiting stryker to specific file can speed dev cycle up, BUT you lose the 'extra' testing of class use in other tests (using the class in other tests provides more cases to ill mutants), so it can appear tessting it degenrating. OTOH, for components, this may be a good thing to know ...

### 20190929
Chapter 11: Reflection
Halting problem test. Nope, didn't solve it. However, cucumber / chai / node handle stack overflow as failed test without terminating test suite, so that test is simply invoke possibly infinite recursion and it either terminates or fails.

Re: Immutability. I came peace with an approach borrowed from strings: .replace(something, withThis) returns a new object, while leaving the original unchanged. Works particularly will with shapes and transforms, and ends the frustration with cloning and other stuff.
E.g., for Pattern:
```
export class Pattern {

    private readonly transformInv: Matrix;
    constructor(public readonly a: Color, public readonly b: Color, private patternFunction: PatternFunction, public readonly transform = Matrix.identity()) {
        this.transformInv = transform.inverse;
    }
...
    replace(transformation: Matrix): Pattern {
        return new Pattern(this.a, this.b, this.patternFunction, transformation);
    }

}-
```

So to updated a pattern in the tests:
```
   this.workspace.patterns[patternId] = this.workspace.patterns[patternId].replace(scaling(parseArg(x), parseArg(y), parseArg(z)));
```

It also lets me do this pretty messy bit to update both a class member and a reference to the class member (necessary for testing, accessing different parts of the world hierarchy):
```
    @given(/^([\w\d_]+).material.ambient ← ([^,]+)$/)
    public giveMaterialAmbient(shapeId: string, value: string) {
        const w = this.workspace.worlds['w'];
        const s = this.workspace.shapes[shapeId];

        this.workspace.shapes[shapeId] = s.replace(s.material.replace('ambient', parseArg(value)));
        this.workspace.worlds['w'] = w.replace(s, this.workspace.shapes[shapeId]);
    }
```
So, for non-Canvas class, I have arrived at a decisions. 
### 20190916
Chapter 9: Panes / Refactoring Shapes

I think this is major departure from the book. I am not going to use a class hierarchy of shapes, with an abstract base class to handle shapes. I am going to use interfaces. I may have free functions that can be reused in multiple class implementation of interfaces, though. In typescript interfaces have no implementation, but classes do. As far as I can tell, that is the only difference. 

I am having some difficulties with cloning / copy with mod (e.g, updating a translation matrix a material, or saved_ray ray properties. In point of fact, it more a diffuclty with the test as written, and not the actual ray tracer. THAT seems fine and straight foreward. I still have mutable matrices, as a set element method is much more straight forward than an copy methods I can figure out. Similar with the canvas (copying a 1920x1080 canvas to updat 1 cell seem excessive). Ultimately, I do need to cache the results to persist them (save a .pmm file), so that is a trade off I can accept.

### 20190914
More immutability: 
```
Scenario: Assigning a transformation
  Given s ← test_shape()
  When set_transform(s, translation(2, 3, 4))
  Then s.transform = translation(2, 3, 4)
```

Have to update s in workspace. But maybe I am getting used to this.

### 20190908 
Back to issues with mutability. Scenario in world.feature:
```
  Scenario: The color with an intersection behind the ray
    Given w ← default_world()
     And outer ← the first object in w
     And outer.material.ambient ← 1
     And inner ← the second object in w
     And inner.material.ambient ← 1
     And r ← ray(point(0, 0, 0.75), vector(0, 0, -1))
    When c ← color_at(w, r)
    Then c = inner.material.color

```

This is painful in the worldsteps.ts because I actually have to update both the world w and the helper objects inner|outer. Need to rethink this.
### 20190905
Re: **20190830** 
Decision: Except for Matrix (for now, at any rate), I am doing this with immutable data. 

### 20190830
I have reached what feels like a major decision. While implementing spheres.feature, I got to:
```
Scenario: Changing a sphere's transformation
  Given s ← sphere()
    And t ← translation(2, 3, 4)
  When set_transform(s, t)
  Then s.transform = t
```

The crisis is 
```
  When set_transform(s, t)
```

To this point I have been predominantly pursued a immutable / functional approach. (The primary exception has been the Matrices, but that was more a test expediency, rather than a commitment to mutable state. In fact, I have had a big ole, 'Go back and fix that m.set(r, c, v) nonsense.' in my mental backlog since I did it)

I have an intuition that a functional implementation may be less error prone / more scalable. I am just not sure what to do with the set_transform(). My first thought is that set_transform returns an new sphere, and in the test step, I need  replace the given s, i,e, 
```
s ← set_transform(s, t)
```
 for the rest of the test to work, but I really with test was written that way ...
