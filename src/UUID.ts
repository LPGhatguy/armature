const randomBuffer = new Uint16Array(1);

/**
 * Returns a random number on [0, 1)
 * Uses window.crypto if available
 */
function rand() {
	if (typeof(crypto) !== "undefined") {
		crypto.getRandomValues(randomBuffer);
		return randomBuffer[0] / 2**16;
	} else {
		return Math.random();
	}
}

const UUID = {
	/**
	 * Generates a v4 UUID.
	 */
	get() {
		const template = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
		const value = template.replace(/[xy]/g, c => {
			let v = Math.floor(rand() * 16);

			if (c !== "x") {
				v = v & 0x3 | 0x8;
			}

			return v.toString(16);
		});

		return value;
	}
};

export default UUID;