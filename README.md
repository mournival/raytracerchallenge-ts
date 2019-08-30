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
- Node.js w/ npm
- Git
- ...

Clone this repo

```
git clone https://github.com/kholvoet/raytracerchallenge.git
```

### Installing

To install the dependencies:
```
npm install
```

To run the demo code:
```
npm run particle
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

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc

## Developer Log

### TODO

- Create file utils to save canvas either as global or Canvas static or Canvas method.
- Fix mutable Matrix
- Fix mutable Canvas(?). Not entirely sure if this is the correct decision for the global model that may have 1M+ pixels.
 

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