import Component, { ArmTemplate } from "./Component";

/**
 * Attaches a template to a Component
 * @param template The template to attach
 */
function Template(template: ArmTemplate): ClassDecorator {
	return (target: typeof Component) => {
		target.prototype.$template = template;
	};
};

export { Template };

/**
 * Sets the HTML tag name of a Component
 * @param name The tag name to attach
 */
function TagName(name: string): ClassDecorator {
	return (target: typeof Component) => {
		target.$tagName = name;
	};
};

export { TagName };

/**
 * Attaches HTML class names to a Component's element
 * @param names The names to attach
 */
function ClassNames (...names: string[]): ClassDecorator {
	return (target: typeof Component) => {
		target.$classNames.push(...names);
	};
};

export { ClassNames };