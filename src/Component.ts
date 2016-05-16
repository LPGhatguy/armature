import UUID from "./UUID";
import { Template, TagName, ClassNames } from "./Decorators";

export type ArmTemplate = (component: Component) => string;

export interface DeflatedComponent {
	type: string;
	data: any;
	id: string;
	label: string;
	children?: DeflatedComponent[];
}

@TagName("arm-component")
@Template(() => "")
export default class Component {
	static $classNames: string[] = [];
	static $tagName: string;
	$template: ArmTemplate;

	$data: any;
	$id: string;
	$label: string;

	$element: HTMLElement;
	$children: Component[] = [];
	$parent: Component;

	constructor(data: any) {
		this.$data = data;
		this.$id = UUID.get();
	}

	static $for(parent: Component, label: string, data: any) {
		const identifier = this.$getIdentifier(label);

		const existing = parent.$children.find(v => v.$getIdentifier() === identifier);

		if (existing) {
			return existing;
		}

		const inst = new this(data);
		inst.$label = label;
		inst.$parent = parent;

		parent.$children.push(inst);

		return inst;
	}

	$deflate(): DeflatedComponent {
		const thisClass = <typeof Component>this.constructor;

		return {
			type: thisClass.$tagName, // TODO: change?
			data: this.$data,
			id: this.$id,
			label: this.$label,
			children: this.$children.map(v => v.$deflate())
		};
	}

	static $inflate(deflated: DeflatedComponent, inst?: Component) {
		if (!inst) {
			inst = new this(deflated.data);
		}

		inst.$id = deflated.id;
		inst.$label = deflated.label;

		if (deflated.children) {
			for (let child of deflated.children) {
				const thatClass = this; // TODO

				const childInst = thatClass.$for(inst, child.label, child.data);
				thatClass.$inflate(child, childInst);
			}
		}

		return inst;
	}

	static $getIdentifier(label: string) {
		return this.$tagName + "__" + label;
	}

	$getIdentifier() {
		const thisClass = <typeof Component>this.constructor;

		return thisClass.$tagName + "__" + this.$label;
	}

	$getHTML() {
		const thisClass = <typeof Component>this.constructor;

		return `<${ thisClass.$tagName }
			class="${ thisClass.$classNames.join(" ") }"
			data-id="${ this.$id }"
			${ this.$label ? `data-label="${ this.$label }"` : "" }
			>${ this.$template(this) }</${ thisClass.$tagName }>`;
	}

	$ensureElement() {
		if (!this.$element) {
			const thisClass = <typeof Component>this.constructor;
			const el = document.createElement(thisClass.$tagName);

			this.$attachTo(el);
		}
	}

	$attachTo(element: HTMLElement) {
		this.$element = element;
		element.setAttribute("data-id", this.$id.toString());

		if (this.$label) {
			element.setAttribute("data-label", this.$label);
		}
	}

	$locate(parent: HTMLElement = document.body) {
		const thisClass = <typeof Component>this.constructor;

		const el = <HTMLElement>parent.querySelector(`${ thisClass.$tagName }[data-id="${ this.$id }"]`);

		if (el) {
			this.$element = el;

			return el;
		}
	}

	$render() {
		this.$element.innerHTML = this.$template(this);
	}

	$hydrate() {
		for (let child of this.$children) {
			if (child.$locate(this.$element)) {
				child.$hydrate();
			}
		}
	}

	$reify() {
		this.$ensureElement();
		this.$render();
		this.$hydrate();
	}
}