let current = 0;

/**
 * Returns a new unique number, designed for identifying objects.
 */
function UUID() {
	return ++current;
}

export default UUID;