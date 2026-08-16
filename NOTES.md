# Accessible Component Fundamentals — Notes

## shadcn/ui Comparison

I built the Dialog, Tabs, and Disclosure components manually first so that I could understand their accessibility requirements before using a component library.

After reading the generated shadcn/ui `dialog.tsx` and `tabs.tsx` components, I found several important differences between my implementation and the shadcn/Base UI approach.

### 1. Dialog focus management

The shadcn Dialog is built on `@base-ui/react/dialog`, which provides built-in focus management. When the dialog opens, focus is managed within the dialog, and when it closes, focus can be restored to the element that triggered it.

In my manually implemented modal, focus management had to be handled explicitly with React refs and effects.

This means the library reduces the amount of custom focus-management code that I need to maintain.

### 2. Dialog focus trapping

An accessible modal dialog must prevent keyboard focus from escaping the dialog while it is open.

The shadcn/Base UI Dialog primitive handles this behavior as part of the dialog primitive. My manual implementation required explicit focus-trap logic to keep Tab navigation inside the modal.

This is an important accessibility responsibility because keyboard users should not accidentally move focus to content behind an open modal.

### 3. Tabs keyboard navigation

The shadcn Tabs component is built on `@base-ui/react/tabs`. The primitive handles the keyboard interaction required by the tabs pattern, including navigation between tabs with arrow keys.

For horizontal tabs, users can navigate between tabs with Left and Right Arrow keys. For vertical tabs, the corresponding Up and Down Arrow keys can be used.

In my manually implemented Tabs component, this keyboard behavior had to be implemented explicitly.

### 4. ARIA semantics and relationships

The shadcn/Base UI Tabs primitives provide the semantic structure required by the tabs pattern through components such as `TabsPrimitive.List`, `TabsPrimitive.Tab`, and `TabsPrimitive.Panel`.

The primitive can manage relationships and states such as the selected tab and its associated tab panel.

In a manual implementation, I need to explicitly maintain the correct ARIA roles, states, and relationships such as the tablist, tab, tabpanel, `aria-selected`, and `aria-controls`.

### 5. Focus-visible states

The shadcn Tabs trigger includes explicit `focus-visible` styles. This makes the currently focused tab visually identifiable when navigating with a keyboard.

My implementation also needs a clear focus indicator because keyboard users must be able to see where focus is located.

## Main Takeaway

The main lesson is that shadcn/ui is not simply providing styled components. Its generated components are thin wrappers around accessibility-focused primitives.

The biggest gaps I identified in my manual implementation are focus management and focus trapping for the Dialog, and complete keyboard navigation and ARIA state management for Tabs.

Building the components manually first helped me understand why these behaviors are necessary instead of treating accessibility as something that a component library automatically provides.
