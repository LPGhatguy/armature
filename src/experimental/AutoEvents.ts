/**
 * Automatic event attachment experiment
 * Use data-events="onClick: component.method" to test
 * Method with the given name must be annotated with Armature.AutoEvents.Event
 */

import * as Armature from "../Component";

const Event = (target: any, key: string) => {
	target[key].toString = () => key;
};

export { Event };

function wireEvents(eventMap: Map<string, string>, component: Component<any>) {
	const container = component.$element;
	const els = <HTMLElement[]>Array.from(component.$element.querySelectorAll("[data-events]"));

	if (component.$element.getAttribute("data-events")) {
		els.push(component.$element);
	}

	els.forEach(el => {
		const eventString = el.getAttribute("data-events");
		const events = eventString.split(",").map(v => v.trim());

		events.forEach(event => {
			const [eventName, methodName] = event.split(":").map(v => v.trim());
			const method = component[methodName];
			const domEventName = eventMap.get(eventName);

			if (!domEventName || !method) {
				return;
			}

			el.addEventListener(domEventName, e => method.call(component, e));
		});
	});
}

const eventMap = new Map<string, string>();
eventMap.set("onClick", "click");
eventMap.set("onChange", "change");
eventMap.set("onSubmit", "submit");

export class Component<T> extends Armature.Component<T> {
	$installed() {
		super.$installed();

		wireEvents(eventMap, this);
	}
}