import * as Armature from "../";
import { expect } from "chai";

declare var global;

const isBrowser = !!global.document;

describe("A simple component", () => {
	const template: Armature.Template<Simple> = (component) => `
		We have this: ${ component.state.x }
	`;

	interface SimpleData {
		x: number;
	}

	@Armature.Attributes({
		tag: "simple-component",
		template: template
	})
	class Simple extends Armature.Component<SimpleData> {
	}

	if (isBrowser) {
		it("should render with the correct markup", () => {
			const inst = new Simple({ x: 5 });
			inst.reify();

			expect(inst.element.innerHTML).to.equal(inst.template(inst));
		});
	}
});