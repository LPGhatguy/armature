import { Component } from "./Component";

const ComponentStore = {
	store: new Map<string, typeof Component>(),

	register(componentType: typeof Component) {
		this.store.set(componentType.$getTypeName(), componentType);
	},

	get(typeName: string) {
		return this.store.get(typeName);
	}
};

export default ComponentStore;