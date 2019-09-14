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
 
### 20190914
More imutability: 
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