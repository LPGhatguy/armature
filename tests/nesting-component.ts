import { Component, TagName, Template } from "../";
import { expect } from "chai";

declare var global;

const isBrowser = !!global.document;

describe("A nesting component", () => {
	const template = (component: Parent) => `
		This is a child: ${ Child.$for(component, "", null) }
	`;

	@TagName("parent-component")
	@Template(template)
	class Parent extends Component {
		constructor(data: any) {
			super(data);

			Child.$for(this, "", {});
		}
	}

	@TagName("child-component")
	class Child extends Component {
	}

	it("should recall children correctly", () => {
		const parent = new Parent({});
		const child = Child.$for(parent, "", null);

		expect(parent.$children[0]).to.equal(child);
	});

	if (isBrowser) {
		it("should reify without creating a new child component", () => {
			const parent = new Parent({});
			parent.$reify();

			expect(parent.$children).to.have.length(1);
		});

		it("should be able to locate itself in the parent", () => {
			const parent = new Parent({});
			parent.$reify();

			const child = Child.$for(parent, "", null);
			expect(child.$element).to.be.instanceof(Element);
		});
	}
});