import { Component, ArmTemplate } from "./Component";
import ComponentStore from "./ComponentStore";

interface PropertyData {
	tag: string;
	template: ArmTemplate;
	classes?: string[];
}

export { PropertyData };

function Properties(data: PropertyData): ClassDecorator {
	return (target: typeof Component) => {
		target.prototype.$template = data.template;
		target.$tagName = data.tag;

		if (data.classes) {
			target.$classNames = [...target.$classNames, ...data.classes];
		}

		ComponentStore.register(target);
	};
}

export { Properties };