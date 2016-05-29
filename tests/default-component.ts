import { Component } from "../";
import { expect } from "chai";

declare var global;

const isBrowser = !!global.document;

describe("The default component", () => {
	it("should be instantiable", () => {
		const inst = new Component({});
	});

	it("should store the given state", () => {
		const inst = new Component({ x: 5 });

		expect(inst.$state.x).to.equal(5);
	});

	it("should produce HTML when asked", () => {
		const inst = new Component({});

		const body = inst.toString();
		expect(body).to.contain(Component.$tagName);
	});

	it("should properly serialize state", () => {
		const inst = new Component({ x: 5 });
		const serialized = inst.$serializeState();

		expect(serialized.x).to.equal(inst.$state.x);
		expect(serialized).to.not.equal(inst.$state);
	});

	it("should be deflatable", () => {
		const inst = new Component({ x: 5 });

		const deflated = inst.$deflate();

		expect(deflated.state.x).to.equal(5);
	});

	it("should be inflatable", () => {
		const inst = new Component({ x: 5 });

		const deflated = inst.$deflate();
		const reinst = Component.$inflate(deflated);

		expect(reinst.$state.x).to.equal(5);
	});

	it("should expose a consistent identifier", () => {
		const inst = new Component({});

		expect(inst.$getIdentifier()).to.equal(Component.$getIdentifier(inst.$label));
	});

	it("should properly nest", () => {
		const parent = new Component({});
		const child = Component.$for(parent, "", {});

		expect(parent.$children).to.contain(child);
	});

	if (isBrowser) {
		it("should have an element after being ensured", () => {
			const inst = new Component({});
			inst.$ensureElement();

			expect(inst.$element).to.be.instanceof(Element);
		});

		it("should created an element when reified", () => {
			const inst = new Component({});
			inst.$reify();

			expect(inst.$element).to.be.instanceof(Element);
		});

		it("should attach to existing elements", () => {
			const inst = new Component({});

			const el = document.createElement("arm-component");
			inst.$attachTo(el);

			expect(inst.$element).to.equal(el);
		});
	}
});