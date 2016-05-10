import UUID from "./UUID";
import { Template, TagName, ClassNames } from "./Decorators";

export type ArmTemplate = (component: Component) => string;

@TagName("arm-component")
@Template(() => "")
export default class Component {
	static $classNames: string[] = [];
	static $tagName: string;
	$template: ArmTemplate;

	$data: any;
	$id: number;
	$label: string;

	$element: HTMLElement;
	$children: Component[] = [];
	$parent: Component;

	constructor(data: any) {
		this.$data = data;
		this.$id = UUID();
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

	$bind() {
		this.$ensureElement();
		this.$render();
		this.$hydrate();
	}
}