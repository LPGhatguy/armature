export function DeprecatedMethod(msg: string): MethodDecorator {
	return (target: any, key: string, descriptor: PropertyDescriptor) => {
		const original: Function = descriptor.value;

		descriptor.value = function(...args) {
			console.warn(msg);
			return original.apply(this, args);
		};

		return descriptor;
	};
}