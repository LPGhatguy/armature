# Armature
```sh
npm install armature --save
```

**No longer maintained! I've transitioned to using React in projects where I would previously use Armature. State updates are simpler and less explicit, and lots of companies back it!**

Armature is a modern component model targeted at TypeScript and ES2015+ workflows. It runs in browsers and servers alike, allowing for a full-featured isomorphic view system without the complexity of larger frameworks.

Armature leverages the power of classes, decorators, and template strings to reduce API surface and improve interoperability.

## Requirements
Armature releases are compiled to ES5 and should run on any compliant ES5 runtime.

## Usage

### ES6 and TypeScript
```js
import * as Armature from "armature";

console.log(Armature.Component) // yay
```

### CommonJS (Node and Browserify)
```js
const Armature = require("armature");

console.log(Armature.Component) // yay
```

### Global
Armature is exposed as `Armature` when no module system is detected.

```js
console.log(Armature.Component); // yay
```

## Examples
**All examples are written in ES2015 plus decorators, which is also valid TypeScript**

Components start with classes that extend Armature's base `Component`. They're decorated to include data about the component.

```ts
import { Component, Properties } from "armature";

const template = (component) => `
	We have this name: ${ component.$data.name }
	<button class="alert">Alert!</button>
`;

@Properties({
	tag: "hello-world",
	template: template
})
class HelloWorld extends Component {
	$hydrate() {
		super.$hydrate();

		const button = this.$element.querySelector("button.alert");
		button.addEventListener("click", e => {
			alert("The alert button was pressed!");
		});
	}
}
```

We can then instantiate and use the component:

```ts
const hello = new HelloWorld({
	name: "Hello, world!"
});

// reify: manifest this component as an HTML element
hello.$reify();
document.body.appendChild(hello.$element);
```

## Building
Download the source, and then install dependencies and their typings using [typings](https://www.npmjs.com/package/typings):

```sh
npm install
typings install
```

Use `npm run build` to build the source once, or use `npm run dev` to continuously rebuild the source as it changes.

Tests can be run on both Node.js and via Karma using `npm test`.
