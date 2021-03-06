import UUID from "./UUID";
import Attributes from "./Attributes";
import ComponentStore from "./ComponentStore";
import { DeprecatedMethod } from "./Deprecated";

import assign = require("object-assign");

export interface Stringable {
	toString(): string;
}

export type Template<componentType extends Component<any>> = (component: componentType) => Stringable;

/**
 * A data structure representing one or more components.
 */
export interface DeflatedComponent {
	type: string;
	state: any;
	id: string;
	label: string;
	children?: DeflatedComponent[];
}

export interface ComponentClass<ComponentType extends Component<StateType>, StateType extends {}> {
	new(state: StateType): ComponentType;
	getIdentifier(label: string): string;
}

/**
 * The base for all Armature components.
 */
@Attributes({
	tag: "arm-template",
	template: () => ""
})
export class Component<StateType extends {}> {
	/**
	 * A list of class names to apply to the component's root element.
	 */
	static htmlClassNames: string[] = [];

	/**
	 * The HTML tag this component type will be using when reified.
	 */
	static htmlTagName: string;

	/**
	 * The template used to render this component.
	 * Use @Template to specify the template for a component type.
	 */
	template: Template<this>;

	/**
	 * The state backing this component.
	 */
	state: StateType;

	/**
	 * The generated globally unique identifier for this component.
	 */
	id: string;

	/**
	 * The given label identifying this component.
	 * This should be unique among all siblings of this component.
	 */
	label: string;

	/**
	 * The element representing this component, if one exists.
	 */
	element: HTMLElement;

	/**
	 * The components this component contains.
	 */
	children: Component<any>[] = [];

	/**
	 * The component containing this component, if one exists.
	 */
	parent: Component<any>;

	/**
	 * A flag telling ekma that this object yields HTML
	 */
	private safeInHTML = true;

	/**
	 * Creates a new component with the given data.
	 *
	 * @param data The data to initialize the component with
	 */
	constructor(state: StateType) {
		if (state == null) {
			state = this.getDefaultState();

			if (state == null) {
				throw new Error(
					`Component "${ this.constructor.name }" was created with no data specified!\n` +
					`Additionally, the component's $getDefaultState method returned null.\n` +
					`If this was intentional, override $getDefaultState to return a non-null object to use.`
				);
			}
		}

		this.id = UUID.get();
		this.state = state;
	}

	/**
	 * Deprecated: use Parent#getChild and Child#setParent instead.
	 *
	 * Creates or retrieves a component that is attached to another component.
	 * Using the same parent and 'label' parameters will retrieve the same object.
	 * The third parameter is passed directly to the constructor of a created component.
	 *
	 * @param parent The component to attach to
	 * @param label The label to use when creating or retrieving the component
	 * @param state The state to construct the component with if it hasn't been created.
	 */
	@DeprecatedMethod("Armature: Component.for was deprecated in favor of Parent.getChild and Child.setParent in 1.0.0-alpha4")
	static for(parent: Component<any>, label: string, state: any) {
		const identifier = this.getIdentifier(label);

		const existing = parent.children.find(v => v.getIdentifier() === identifier);

		if (existing) {
			return existing;
		}

		const inst = new this(state);
		inst.label = label;
		inst.parent = parent;

		parent.children.push(inst);

		return inst;
	}

	/**
	 * Returns the child component of the given type and label, if it exists.
	 * Returns a Component<any>, requires casting to the type passed to the function.
	 *
	 * @param childClass The child's type to search for.
	 * @param label The child's label to search for.
	 */
	getChild(childClass: typeof Component, label: string): Component<any> {
		const id = childClass.getIdentifier(label);
		return this.children.find(v => v.getIdentifier() === id);
	}

	/**
	 * Sets the label of the component and returns it.
	 *
	 * @param label The label to set.
	 */
	setLabel(label: string) {
		this.label = label;

		return this;
	}

	/**
	 * Sets this component to be a child of the given component.
	 * A component can only be the child of one component.
	 * This method unsets an existing parent if one was set.
	 *
	 * @param parent The component to contain this one.
	 */
	setParent(parent: Component<any>) {
		if (this.parent) {
			this.parent.children = this.parent.children.filter(v => v !== this);
		}

		this.parent = parent;
		parent.children.push(this);

		return this;
	}

	/**
	 * Returns the default state of the component if none is given at construction time.
	 * Returning null from this function signifies that state must be specified.
	 */
	getDefaultState(): StateType {
		return null;
	}

	setState(state: StateType) {
		assign(this.state, state);
		this.$onChange.forEach(f => f());
	}

	private $onChange: Function[] = [];
	onChange(method: Function) {
		this.$onChange.push(method);
	}

	/**
	 * Serializes the component's data for potential recreation.
	 */
	packState(): any {
		return assign({}, this.state);
	}

	static unpackState(state: Object): any {
		return state;
	}

	/**
	 * Returns a way to uniquely identify this component type.
	 */
	static getTypeName() {
		const classString = this.htmlClassNames.join("+");

		return this.htmlTagName + ";" + classString;
	}

	/**
	 * Creates an object that can be used to recreate this component.
	 */
	deflate(): DeflatedComponent {
		const thisClass = <typeof Component>this.constructor;

		return {
			type: thisClass.getTypeName(),
			state: this.packState(),
			id: this.id,
			label: this.label,
			children: this.children.map(v => v.deflate())
		};
	}

	/**
	 * Creates an instance of a component from state generated by $deflate.
	 *
	 * @param deflated The deflated component state to use
	 * @param inst An optional existing object to inflate
	 */
	static inflate(deflated: DeflatedComponent, inst?: Component<any>) {
		const thisClass = ComponentStore.get(deflated.type);

		if (inst == null) {
			inst = new thisClass(this.unpackState(deflated.state));
		}

		inst.id = deflated.id;
		inst.label = deflated.label;

		if (deflated.children) {
			for (const child of deflated.children) {
				const thatClass = ComponentStore.get(child.type);

				const childInst = thatClass.for(inst, child.label, thatClass.unpackState(child.state));
				thatClass.inflate(child, childInst);
			}
		}

		return inst;
	}

	/**
	 * Returns an identifier that should be unique among a component's siblings.
	 *
	 * @param label The label of the component to create the label for
	 */
	static getIdentifier(label: string) {
		return this.getTypeName() + "__" + label;
	}

	/**
	 * Returns an identifier that should be unique among a component's siblings.
	 */
	getIdentifier() {
		const thisClass = <typeof Component>this.constructor;

		return thisClass.getIdentifier(this.label);
	}

	toString() {
		return this.getHTML();
	}

	/**
	 * Returns the complete HTML used to render this component.
	 */
	getHTML() {
		const thisClass = <typeof Component>this.constructor;

		const attributes = [
			`class="${ thisClass.htmlClassNames.join(" ") }"`,
			`data-arm-id="${ this.id }"`
		];

		if (this.label) {
			attributes.push(`data-label="${ this.label }"`);
		}

		return `<${ thisClass.htmlTagName } ${ attributes.join(" ") }>${ this.template(this) }</${ thisClass.htmlTagName }>`;
	}

	/**
	 * Creates an HTML element for this component if one does not exist.
	 */
	ensureElement() {
		if (this.element == null) {
			const thisClass = <typeof Component>this.constructor;

			const el = document.createElement(thisClass.htmlTagName);
			el.classList.add(...thisClass.htmlClassNames);

			this.attachTo(el);
		}
	}

	/**
	 * Attaches this component to an existing HTML element.
	 *
	 * @param element The element to attach to
	 */
	attachTo(element: HTMLElement) {
		this.element = element;
		element.setAttribute("data-arm-id", this.id.toString());

		if (this.label) {
			element.setAttribute("data-label", this.label);
		}
	}

	/**
	 * Attempts to locate this component's element from a parent element.
	 *
	 * @param parent The element to search in
	 */
	locate(parent: HTMLElement = document.body) {
		const thisClass = <typeof Component>this.constructor;

		const el = <HTMLElement>parent.querySelector(`${ thisClass.htmlTagName }[data-arm-id="${ this.id }"]`);

		if (el && el !== this.element) {
			this.element = el;

			for (const child of this.children) {
				child.locate(el);
			}
		}
	}

	/**
	 * Evaluates the component's template and sets the component's element's HTML to the result.
	 */
	render() {
		if (this.element == null) {
			throw new Error(
				`Component "${ this.constructor.name }" was rendered before it had an HTML element attached to it!\n` +
				`When running on the server, use $getHTML() or toString() instead of calling render().\n` +
				`On the client, use reify(). Use attachTo() beforehand to render into an existing HTML element.`
			);
		}

		this.element.removeAttribute("data-arm-installed");
		this.element.innerHTML = this.template(this).toString();
	}

	shouldInstall() {
		return this.element.getAttribute("data-arm-installed") == null;
	}

	/**
	 * Attaches event handlers for the component and its children.
	 * Often used after render, or as part of reify.
	 */
	install() {
		for (const child of this.children) {
			if (child.element == null || !this.element.contains(child.element)) {
				child.locate(this.element);
			}

			if (child.element != null) {
				child.install();
			}
		}

		if (this.shouldInstall()) {
			this.element.setAttribute("data-arm-installed", "");

			this.installed();
		}
	}

	installed() {
	}

	shouldUninstall() {
		return this.element.getAttribute("data-arm-installed") != null;
	}

	/**
	 * Detaches event handlers for the component and its children.
	 */
	uninstall() {
		for (const child of this.children) {
			child.uninstall();
		}

		if (this.shouldUninstall()) {
			this.element.removeAttribute("data-arm-installed");

			this.uninstalled();
		}
	}

	uninstalled() {
	}

	/**
	 * Ensures this component's element exists, then renders and installs it.
	 */
	reify() {
		this.ensureElement();
		this.render();
		this.install();
	}
}