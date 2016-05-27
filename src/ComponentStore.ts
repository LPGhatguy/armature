import { Component } from "./Component";

const ComponentStore = {
	store: new Map<string, typeof Component>(),

	register(componentType: typeof Component) {
		this.store.set(componentType.$getTypeName(), componentType);

		console.log("Registered", componentType.name, "as", componentType.$getTypeName());
	},

	get(typeName: string) {
		return this.store.get(typeName);
	}
};

export default ComponentStore;