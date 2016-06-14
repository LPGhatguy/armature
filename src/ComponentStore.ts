import { Component } from "./Component";

const ComponentStore = {
	store: new Map<string, typeof Component>(),

	/**
	 * Registers a new component based on its generated type ID
	 * Automatically called by @Attributes
	 */
	register(componentType: typeof Component) {
		this.store.set(componentType.getTypeName(), componentType);
	},

	/**
	 * Retrieves the component for the given type name.
	 */
	get(typeName: string) {
		return this.store.get(typeName);
	}
};

export default ComponentStore;