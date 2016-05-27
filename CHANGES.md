# Armature Change Log

## 1.0.0-alpha1
- Deprecated old decorators, added `@Properties`
- Changed `data-id` attribute to `data-armid` like React's `data-reactid`
- `$inflate` and `$deflate` now properly behave with nested components
- Added `ComponentStore`, which is added to when `@Properties` is used
- `Component#$locate` is now recursive
- Classes are now properly added in `Component#$ensureElement`
- Removed `Object.assign` requirements, now using `object-assign`

## 0.1.4
- Reformatted Karma configuration
- Expanded test suite
- Removed default export on `armature/Component`
- Browserify bundle is now standalone, which allows for better consumption

## 0.1.3
- Added `Component#$getTypeName()`
- Updated `Component#getIdentifier` to use `getTypeName`
- Added documentation to most methods
- Added test suite (Mocha, Chai, and Karma)
	- Test coverage is incomplete
- Removed 'debug' build path

## 0.1.1, 0.1.2
- Fixed typos and build regressions

## 0.1.0
- Initial release
- Based on internal prototype