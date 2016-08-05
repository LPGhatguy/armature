# Armature Change Log

## 1.0.0-alpha4
- Deprecated `Component.for`, now prints a warning
- Added `Component#getChild`, which functions similarly to `Component.for` when retrieving an existing component
- Added `Component#setParent`, which sets the component's parent.
- Added `Component#setLabel`, a convenience method to set the component's label and return it.

### Example Code Changes

Code to create a new child component used to look like this:

```ts
const parent = new Component({});
const child = child.for(parent, "label", {});
```

It now looks like this:

```ts
const parent = new Component({});
const child = new Child()
	.setLabel("label")
	.setParent(parent);
```

Additionally, code that used to retrieve an existing child component looked like this:

```ts
const child = Child.for(parent, "label", null);
```

Passing `null` caused an exception to be raised if the child didn't exist, which was kind of strange.

Now, with the new split methods, the above looks like this:

```ts
const child = parent.getChild(Child, "label");
```

No errors are thrown if the child doesn't exist, the returned value will simply be falsy.

## 1.0.0-alpha3
**This is a major, breaking release. Upgrade with care.**

### Breaking
- Members no longer have `$` preceding them!
- Components now require a `StateType` type parameter
	- Old `Component` is now `Component<any>`
	- This sets the type of the `$state` property and the default constructor
- Removed deprecated decorators (`@Template`, `@TagName`, `@ClassNames`)
- Renamed `$tagName` to `htmlTagName`
- Renamed `$classNames` to `htmlClassNames`
- Renamed `@Properties` to `@Attributes`
- Renamed `ArmTemplate` interface to `Armature.Template`
- Renamed `$data` to `state`
	- Type is now dynamic instead of always `any`
- Renamed `$serializeData` to `serializeState`
- Renamed `$hydrate` to `install`
- Global bundle is now exposed as `Armature` instead of `armature`

### Major
- Added `uninstall` method to complement `install`
- Added `installed` and `uninstalled` to be used instead of overriding `install` and `uninstall`
- Added `getDefaultState` method
	- If `null` or `undefined` are passed as a state, this will be used instead
	- If this function returns `null`, then a `null` or `undefined` state will be considered an error by both the default constructor and `Component.for`

### Minor
- Components now throw errors with instructions to guide developers in the correct direction and correct common mistakes
- Components now behave as expected when calling `Component.inflate` to inflate data instead of using the data's expected class.
- `getTypeName` no longer returns a string that looks like a CSS selector, to prevent misuse.
- Recommended Armature import is now `import * as Armature from "armature"`
- Added experimental automatic event hooking support in `Armature.AutoEvents`: this is a test and a work in progress!

## 1.0.0-alpha2
- Updated README to point to the correct npm package

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