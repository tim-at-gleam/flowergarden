// Local no-op shim for the `framer` package.
//
// Why this exists: the real `framer` package is only available inside
// Framer's runtime. When we run the Vite playground locally, imports of
// `framer` need to resolve to *something*. This file is aliased in
// vite.config.ts so that local builds get harmless stubs, while the
// exact same component source — pasted into a Framer code file —
// resolves to the real package and wires up property controls.

export type ControlDescriptor = Record<string, unknown>

export const ControlType = {
  Color: "color",
  Number: "number",
  Boolean: "boolean",
  Enum: "enum",
  String: "string",
} as const

export function addPropertyControls(
  _component: unknown,
  _controls: Record<string, ControlDescriptor>,
): void {
  // no-op in the playground
}
