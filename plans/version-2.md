# Designable 2.0: React 19 and Ant Design 6 Migration

## Summary

Release eight maintained packages as stable `2.0.0` under `@thienvu18`, supporting only React 19 and Ant Design 6. Use `@thienvu18/formily-antd-v6@2.0.0` in place of `@formily/antd`.

Preserve `formily/next` as legacy community source, but mark it private and exclude it from workspaces, builds, tests, lint, versioning, and publication. Its current `1.0.0-beta.45` source remains available for a future Fusion migration without blocking Designable 2.0.

Target runtime versions:

- React, React DOM, React Is: `19.2.8`
- React types: current compatible 19.x
- Ant Design: `6.6.3`
- Ant Design Icons: `6.3.4`
- Formily core packages: `2.3.7`
- Formily AntD adapter: `@thienvu18/formily-antd-v6@2.0.0`
- Node: `>=20 <25`
- Yarn: `4.6.0`

## Context Map

### Active migration surfaces

| Area | Purpose | Required changes |
|---|---|---|
| Root manifests, Lerna, TypeScript, CI | Workspace, dependency, build, release control | Explicitly exclude `formily/next`; modernize Node/Yarn/Lerna/TypeScript/Jest/Webpack; add complete verification command |
| `packages/{shared,core,react,react-sandbox,react-settings-form}` | Designable runtime and React UI | Rename packages/imports, adopt React 19 types and roots, migrate AntD APIs/styles |
| `formily/{transformer,setters,antd}` | Formily integration | Rename packages/imports, move to Formily 2.3.7 and the v6 adapter, migrate settings and preview components |
| Four examples and AntD playground | Behavioral and visual fixtures | React 19 roots, AntD 6 assets, current package names, production builds |
| Build/style scripts | CJS/ESM and Less processing | Remove UMD assumptions, deep AntD style rewriting, and obsolete Webpack 4 behavior |
| README, changelog, migration guide | Consumer upgrade instructions | Document renamed packages, dropped support, required peer dependencies, code and styling changes |
| `formily/next` | Retained legacy Fusion implementation | Keep source; add legacy status notice; prevent workspace linking and accidental publication |

No test files currently exist, and the principal CI workflow is disabled. New tests and active CI are mandatory release gates.

### Reference implementation

Reuse the already verified patterns from the `Community/antd` fork:

- React 19 `createRoot` ownership and `Root.unmount`.
- Warning-fatal test setup.
- Deprecated API audit.
- CJS/ESM package building without UMD.
- Clean packed-consumer verification.
- Corepack Yarn 4 immutable installation.

## Public package and API changes

### Stable 2.0 package mapping

| Old package | Stable 2.0 package |
|---|---|
| `@designable/shared` | `@thienvu18/designable-shared@2.0.0` |
| `@designable/core` | `@thienvu18/designable-core@2.0.0` |
| `@designable/react` | `@thienvu18/designable-react@2.0.0` |
| `@designable/react-sandbox` | `@thienvu18/designable-react-sandbox@2.0.0` |
| `@designable/react-settings-form` | `@thienvu18/designable-react-settings-form@2.0.0` |
| `@designable/formily-transformer` | `@thienvu18/designable-formily-transformer@2.0.0` |
| `@designable/formily-setters` | `@thienvu18/designable-formily-setters@2.0.0` |
| `@designable/formily-antd` | `@thienvu18/designable-formily-antd@2.0.0` |
| `@designable/formily-next` | No 2.0 replacement; retained legacy source only |

The proposed names are currently unoccupied in the npm registry.

### Dependency contracts

- Published React packages declare `react`, `react-dom`, and `react-is` as `>=19 <20` where directly used.
- Packages importing AntD declare `antd >=6 <7` and icons `>=6 <7` where applicable.
- Replace active `@formily/antd` imports and peers with `@thienvu18/formily-antd-v6 >=2 <3`.
- Use Formily `>=2.3.7 <3` consistently.
- Rename every internal `@designable/*` dependency and source import to its `@thienvu18/designable-*` equivalent.
- Keep `main`, `module`, and `types` entry points for CJS/ESM compatibility; remove UMD builds and globals.
- Treat package renaming, React support, AntD support, styling changes, and removed UMD output as breaking changes.

## Implementation Phases

### Phase 0 — Protect the baseline

- Record current branch, worktree state, tool versions, and all existing install/build failures.
- Add smoke fixtures for designer mount, workspace rendering, node selection, settings editing, Formily preview, and sandbox rendering.
- Make unexpected `console.error`, `console.warn`, `reportError`, and unhandled rejections fail tests.
- Add a static audit for removed React APIs, classic JSX output, `@formily/antd`, AntD deep imports, old Less imports, deprecated AntD props, and old package names.
- Scope all new audits to active packages and examples; explicitly exclude `formily/next`.

Exit gate: legacy behavior is represented by executable tests or fixtures before dependency changes.

### Phase 1 — Isolate Fusion Next

- Replace broad `formily/*` workspace discovery with explicit active entries: `formily/antd`, `formily/setters`, and `formily/transformer`.
- Keep `formily/next` at `1.0.0-beta.45`; set `"private": true`.
- Add a README banner stating:
  - it is the preserved Alibaba Fusion integration;
  - it is not part of Designable 2.0;
  - it is not verified with React 19;
  - it must not be published until separately migrated.
- Ensure Lerna, typecheck, lint, build, pack, release, and deprecated-API scripts consume the active workspace list instead of recursively scanning `formily`.
- Add a guard test asserting that `formily/next` remains private, is absent from active workspaces, and is absent from the publish list.
- Do not edit its Fusion components, schemas, styles, playground, dependencies, or imports.

Exit gate: immutable installation and active workspace enumeration do not resolve or build Fusion Next.

### Phase 2 — Modernize the toolchain

- Replace invalid `devEngines` with `engines.node: ">=20 <25"` and add `packageManager: "yarn@4.6.0"`.
- Upgrade to Lerna 8, TypeScript 5.2.2, Webpack 5, Dumi 2, Jest 30, current React Testing Library, and compatible TypeScript ESLint.
- Switch application and test TypeScript configurations to `jsx: "react-jsx"`.
- Replace mutating lint commands with check-only lint; provide a separate explicit formatting command.
- Activate CI with immutable install, lint, typecheck, build, tests, docs/examples, package audit, and packed-consumer jobs.
- Remove obsolete OpenSSL workarounds and Webpack 4 dev-server entry construction.
- Preserve CJS and ESM builds but remove `build:umd` and the React/AntD global mapping.

Exit gate: clean immutable installation succeeds and the toolchain reaches application source without obsolete-tool failures.

### Phase 3 — Rename and align packages

- Rename all eight active packages according to the mapping above and set each to exactly `2.0.0`.
- Update internal dependencies, imports, Rollup externals, TypeScript paths, example dependencies, scripts, documentation, and repository metadata.
- Replace active Formily adapter imports with `@thienvu18/formily-antd-v6`.
- Align all active Formily packages at 2.3.7.
- Remove React 16/17, AntD 4, old React types, and old `@designable/*` constraints.
- Keep examples private and point them at the renamed workspaces.
- Do not include `formily/next` in mass import replacement.

Exit gate: dependency inspection reports one React 19 line, one AntD 6 line, no active old package names, and no peer errors.

### Phase 4 — React 19 source migration

- Replace active `ReactDOM.render` entry points with `createRoot`.
- Rework sandbox rendering to retain one `Root` per sandbox document, support rerender, and call `root.unmount()` exactly once on unload.
- Replace all argument-less `useRef()` calls with accurately nullable initial values.
- Convert function-component `defaultProps` assignments to parameter defaults while preserving public defaults.
- Fix React 19 `ReactElement.props`, scoped JSX namespace, callback-ref cleanup, and children typing errors without broad `any` casts.
- Audit removed APIs: legacy context, string refs, `findDOMNode`, `react-dom/test-utils`, React internals, `createFactory`, and test renderer.
- Run designer and sandbox lifecycle tests under StrictMode.

Exit gate: no removed React API remains in active source or emitted code, and runtime tests produce no React warnings.

### Phase 5 — Ant Design 6 and Formily adapter migration

- Replace active `@formily/antd` usage with `@thienvu18/formily-antd-v6`.
- Replace AntD deep type imports with public type exports.
- Migrate owned APIs including:
  - `Modal.visible` → `open`
  - `bodyStyle` → `styles.body`
  - `destroyOnClose` → `destroyOnHidden`
  - dropdown width/style and popup APIs to current names
  - removed Collapse, Tabs, Tooltip, Popover, Card, Table, Transfer, Space, and size props where found
- Update public Designable schemas and locale metadata so they no longer advertise removed AntD props such as `dropdownMatchSelectWidth`.
- Remove imports from `antd/lib/style`, `antd/es/style`, and `antd/dist`.
- Replace the small set of consumed AntD Less variables with Designable-owned CSS variables/tokens.
- Audit internal `.ant-*` selectors against AntD 6 DOM. Retain only selectors proven by browser tests; prefer Designable wrapper classes and semantic AntD styling APIs.
- Replace sandbox CDN references to React UMD and `antd-with-locales` with locally bundled ESM-compatible assets.
- Run both v4→v5 and v5→v6 AntD audits because the repository jumps directly from AntD 4.

Exit gate: no active deep/style imports, deprecated props, or runtime deprecation warnings remain.

### Phase 6 — Verification coverage

Add tests for:

- Designer mount/unmount, workspace switching, selection, drag helpers, history, and settings panel rendering.
- Sandbox first render, rerender, iframe replacement, unload, repeated unmount, and resource cleanup.
- Every migrated default prop and React ref path.
- Settings modal open/submit/cancel/destroy behavior.
- Formily input, choice, date/time, layout, array, table, tabs, collapse, upload, and validation previews.
- `@thienvu18/formily-antd-v6` integration with representative schemas.
- Light/dark themes, CSS variables, popups, modal positioning, internal pointer-event protection, and designer overlays.
- Public exports and generated declarations for all eight packages.
- No unexpected React or AntD warnings.
- Fusion isolation guard.
- All four active example production builds.

Exit gate: a single `yarn verify` command passes all static, build, runtime, visual, and package checks.

### Phase 7 — Packed consumer and stable release

- Pack all eight packages into temporary tarballs.
- Install those tarballs—not workspace links—into a clean React 19.2.8/AntD 6.6.3 consumer.
- Verify CJS and ESM imports, strict TypeScript compilation, a representative designer render, settings interaction, Formily render, sandbox render, and clean unmount.
- Assert only one React, ReactDOM, AntD, icons, and Formily adapter version is installed.
- Verify tarballs contain JS, declarations, styles, README, license, and package metadata, but no source caches or secrets.
- Run the complete gate again from a clean checkout.
- Publish `2.0.0` directly with the normal `latest` tag; do not publish a prerelease.
- Create Git tag `v2.0.0` and a non-prerelease GitHub release.
- Confirm all eight versions with `npm view`; do not publish `formily/next`.

## Migration Documentation

Create `docs/migration-v2.md`, link it from the root README, and reference it prominently in the `2.0.0` changelog and GitHub release.

The guide must include:

- The complete old-to-new package table.
- Exact uninstall/install commands.
- React 19, AntD 6, icons 6, Formily 2.3.7, adapter, Node, and browser requirements.
- Before/after imports for every renamed package.
- Explicit removal of React 16/17, AntD 4, UMD, legacy browser, and old Less support.
- React `createRoot`, refs, JSX transform, error handling, and extension-author changes.
- AntD prop, schema, popup, DOM, styling, and token changes relevant to consumers.
- The role of `@thienvu18/formily-antd-v6`.
- A clear statement that `@designable/formily-next` has no 2.0 release and remains preserved but unsupported in this repository.
- Upgrade examples for a basic designer, settings form, Formily preview, and sandbox.
- Troubleshooting for duplicate React, peer conflicts, missing styles, stale old imports, popup styling, and runtime warnings.
- A final copyable verification checklist.

Acceptance requires a clean consumer to migrate successfully using only this document.

## Assumptions and fixed defaults

- `formily/next` is preserved in place but isolated and private.
- Fusion behavior is not changed or claimed compatible with React 19.
- All other public packages release together as stable `2.0.0`.
- The package namespace is `@thienvu18/designable-*`.
- The underlying Formily adapter is `@thienvu18/formily-antd-v6@2.0.0`.
- Only CJS and ESM outputs remain supported.
- No compatibility shims for React 16/17 or AntD 4 will be retained.
- No publication occurs until the clean packed-consumer gate passes.
