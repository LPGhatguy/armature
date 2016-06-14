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
		target.prototype.template = data.template;
		target.htmlTagName = data.tag;

		if (data.classes) {
			target.htmlClassNames = [...target.htmlClassNames, ...data.classes];
		}

		ComponentStore.register(target);
	};
}

export default Attributes;