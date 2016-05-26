import UUID from "./UUID";
import { Template, TagName, ClassNames } from "./Decorators";

import assign = require("object-assign");

export type ArmTemplate = (component: Component) => string;

/**
 * A data structure representing one or more components.
 */
export interface DeflatedComponent {
	type: string;
	data: any;
	id: string;
	label: string;
	children?: DeflatedComponent[];
}

/**
 * The base for all Armature components.
 */
@TagName("arm-component")
@Template(() => "")
export default class Component {
	/**
	 * A list of class names to apply to the component's root element.
	 */
	static $classNames: string[] = [];

	/**
	 * The HTML tag this component type will be using when reified.
	 */
	static $tagName: string;

	/**
	 * The template used to render this component.
	 * Use @Template to specify the template for a component type.
	 */
	$template: ArmTemplate;

	/**
	 * The state backing this component.
	 */
	$data: any;

	/**
	 * The globally unique identifier for this component.
	 */
	$id: string;

	/**
	 * The label identifying this component.
	 * This is unique among all siblings of this component.
	 */
	$label: string;

	/**
	 * The element representing this component, if one exists.
	 */
	$element: HTMLElement;

	/**
	 * The components this component contains.
	 */
	$children: Component[] = [];

	/**
	 * The component containing this component, if one exists.
	 */
	$parent: Component;

	/**
	 * Creates a new component with the given data.
	 *
	 * @param data The data to initialize the component with
	 */
	constructor(data: any) {
		this.$data = data;
		this.$id = UUID.get();
	}

	/**
	 * Creates or retrieves a component that is attached to another component.
	 * Using the same parent and 'label' parameters will retrieve the same object.
	 * Pass null to the data attribute to throw if a new component is created.
	 *
	 * @param parent The component to attach to
	 * @param label The label to use when creating or retrieving the component
	 * @param data The data to initialize the component with if it hasn't been created
	 */
	static $for(parent: Component, label: string, data: any) {
		const identifier = this.$getIdentifier(label);

		const existing = parent.$children.find(v => v.$getIdentifier() === identifier);

		if (existing) {
			return existing;
		}

		if (data === null) {
			throw new Error("Subcomponent was created with no data!");
		}

		const inst = new this(data);
		inst.$label = label;
		inst.$parent = parent;

		parent.$children.push(inst);

		return inst;
	}

	/**
	 * Serializes the component's data for potential recreation.
	 */
	$serializeData() {
		return assign({}, this.$data);
	}

	/**
	 * Returns a way to uniquely identify this component type.
	 */
	static $getTypeName() {
		const classString = this.$classNames.map(v => "." + v).join("");

		return this.$tagName + classString;
	}

	/**
	 * Creates an object that can be used to recreate this component.
	 */
	$deflate(): DeflatedComponent {
		const thisClass = <typeof Component>this.constructor;

		return {
			type: thisClass.$getTypeName(),
			data: this.$serializeData(),
			id: this.$id,
			label: this.$label,
			children: this.$children.map(v => v.$deflate())
		};
	}

	/**
	 * Creates an instance of a component from data generated by $deflate.
	 *
	 * @param deflated The deflated component data to use
	 * @param inst An optional existing object to inflate
	 */
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

	/**
	 * Returns an identifier that should be unique among a component's siblings.
	 *
	 * @param label The label of the component to create the label for
	 */
	static $getIdentifier(label: string) {
		return this.$getTypeName() + "__" + label;
	}

	/**
	 * Returns an identifier that should be unique among a component's siblings.
	 */
	$getIdentifier() {
		const thisClass = <typeof Component>this.constructor;

		return thisClass.$getIdentifier(this.$label);
	}

	toString() {
		return this.$getHTML();
	}

	/**
	 * Builds the HTML associated with this component.
	 */
	$getHTML() {
		const thisClass = <typeof Component>this.constructor;

		return `<${ thisClass.$tagName }
			class="${ thisClass.$classNames.join(" ") }"
			data-id="${ this.$id }"
			${ this.$label ? `data-label="${ this.$label }"` : "" }
			>${ this.$template(this) }</${ thisClass.$tagName }>`;
	}

	/**
	 * Creates an HTML element for this component if one does not exist.
	 */
	$ensureElement() {
		if (!this.$element) {
			const thisClass = <typeof Component>this.constructor;
			const el = document.createElement(thisClass.$tagName);

			this.$attachTo(el);
		}
	}

	/**
	 * Attaches this component to an existing HTML element.
	 *
	 * @param element The element to attach to
	 */
	$attachTo(element: HTMLElement) {
		this.$element = element;
		element.setAttribute("data-id", this.$id.toString());

		if (this.$label) {
			element.setAttribute("data-label", this.$label);
		}
	}

	/**
	 * Attempts to locate this component's element from a parent element.
	 *
	 * @param parent The element to search in
	 */
	$locate(parent: HTMLElement = document.body) {
		const thisClass = <typeof Component>this.constructor;

		const el = <HTMLElement>parent.querySelector(`${ thisClass.$tagName }[data-id="${ this.$id }"]`);

		if (el) {
			this.$element = el;

			return el;
		}
	}

	/**
	 * Evaluates the component's template and puts the result into the component's element
	 */
	$render() {
		this.$element.innerHTML = this.$template(this);
	}

	/**
	 * Attaches event handlers for the component and its children.
	 * Often used after $render, or as part of $reify.
	 */
	$hydrate() {
		for (let child of this.$children) {
			if (child.$locate(this.$element)) {
				child.$hydrate();
			}
		}
	}

	/**
	 * Ensures this component's element exists, then renders and hydrates it.
	 */
	$reify() {
		this.$ensureElement();
		this.$render();
		this.$hydrate();
	}
}