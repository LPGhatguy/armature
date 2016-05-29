import * as Armature from "./Component";
import ComponentStore from "./ComponentStore";

interface PropertyData {
	tag: string;
	template: Armature.Template<any>;
	classes?: string[];
}

export { PropertyData };

/**
 * Sets the Armature attributes of a given class.
 */
function Attributes(data: PropertyData): ClassDecorator {
	return (target: typeof Armature.Component) => {
		target.prototype.$template = data.template;
		target.$tagName = data.tag;

		if (data.classes) {
			target.$classNames = [...target.$classNames, ...data.classes];
		}

		ComponentStore.register(target);
	};
}

export default Attributes;