import { Component, TagName, Template } from "../";
import { expect } from "chai";

declare var global;

const isBrowser = !!global.document;

describe("A simple component", () => {
	const template = (component: Simple) => `
		We have this: ${ component.$data.x }
	`;

	interface SimpleData {
		x: number;
	}

	@TagName("simple-component")
	@Template(template)
	class Simple extends Component {
		$data: SimpleData;

		constructor(params: SimpleData) {
			super(params);
		}
	}

	if (isBrowser) {
		it("should render with the correct markup", () => {
			const inst = new Simple({ x: 5 });
			inst.$reify();

			expect(inst.$element.innerHTML).to.equal(inst.$template(inst));
		});
	}
});