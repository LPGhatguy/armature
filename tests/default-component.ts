import { Component, TagName } from "../";
import { expect } from "chai";

declare var global;

const isBrowser = global.window;

describe("A default component", () => {
	class ND extends Component {
	}

	it("should be instantiable", () => {
		const inst = new ND({});
	});

	it("should store the given data", () => {
		const inst = new ND({x: 5});

		expect(inst.$data.x).to.equal(5);
	});

	it("should produce HTML when asked", () => {
		const inst = new ND({});

		const body = inst.toString();
		expect(body).to.contain(ND.$tagName);
	});

	it("should be deflatable", () => {
		const inst = new ND({x: 5});

		const deflated = inst.$deflate();

		expect(deflated.data.x).to.equal(5);
	});

	it("should be inflatable", () => {
		const inst = new ND({x: 5});

		const deflated = inst.$deflate();
		const reinst = ND.$inflate(deflated);

		expect(reinst.$data.x).to.equal(5);
	});

	it("should expose a consistent identifier", () => {
		const inst = new ND({});

		expect(inst.$getIdentifier()).to.equal(ND.$getIdentifier(inst.$label));
	});

	if (isBrowser) {
		it("should created an element when reified", () => {
			const inst = new ND({});
			inst.$reify();

			expect(inst.$element).to.be.instanceof(Element);
		});

		it("should attach to existing elements", () => {
			const inst = new ND({});

			const el = document.createElement("arm-component");
			inst.$attachTo(el);

			expect(inst.$element).to.equal(el);
		});
	}
});