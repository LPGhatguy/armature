# Armature
Armature is a modern component model targeted at TypeScript and ES2015+ workflows. It runs in browsers and servers alike, allowing for a full-featured isomorphic view system without the complexity of larger frameworks.

Armature leverages the power of classes, decorators, and template strings to reduce API surface and improve interoperability.

## Requirements
Armature releases are compiled to ES5 and should run on any compliant ES5 runtime.

Additionally, Armature requires the following ES2015 APIs:
- `Object.assign`

To use Armature in environments older than ES2015, a polyfill like `core-js` is recommended.

## Examples
** All examples are written in ES2015 plus decorators, which is also valid TypeScript**

Components start with classes that extend Armature's base `Component`. They're decorated to include data about the component.

```ts
import { Component, TagName, Template } from "@lpghatguy/armature";

const template = (component) => `
	We have this name: ${ component.$data.name }
	<button class="alert">Alert!</button>
`;

@TagName("hello-world")
@Template(template)
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