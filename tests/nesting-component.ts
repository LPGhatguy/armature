import * as Armature from "../";
import { expect } from "chai";

declare var global;

const isBrowser = !!global.document;

describe("A nesting component", () => {
	const template: Armature.Template<Parent> = (component) => `
		This is a child: ${ component.getChild(Child, "") }
	`;

	@Armature.Attributes({
		tag: "parent-component",
		template: template
	})
	class Parent extends Armature.Component<{}> {
		constructor(data: any) {
			super(data);

			new Child({})
				.setLabel("")
				.setParent(this);
		}
	}

	@Armature.Attributes({
		tag: "child-component",
		template: () => ""
	})
	class Child extends Armature.Component<{}> {
	}

	it("should recall children correctly", () => {
		const parent = new Parent({});
		const child = parent.getChild(Child, "");

		expect(parent.children[0]).to.equal(child);
	});

	if (isBrowser) {
		it("should reify without creating a new child component", () => {
			const parent = new Parent({});
			parent.reify();

			expect(parent.children).to.have.length(1);
		});

		it("should be able to locate itself in the parent", () => {
			const parent = new Parent({});
			parent.reify();

			const child = parent.getChild(Child, "");
			expect(child.element).to.be.instanceof(Element);
		});
	}
});