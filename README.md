# GarageHub

Static GarageHub workshop dashboard prototype.

## Structure

- `index.html` contains the app shell and view markup.
- `css/styles.css` contains design tokens, layout, components, page sections, and responsive rules.
- `js/app.js` owns navigation, search, quick-add modal behavior, toast messages, and sidebar state.
- `js/icons.js` adapts legacy `#icon-*` sprite references to Tabler icon classes.

## Adding A New Tab

1. Add a sidebar link with a unique `data-view` value.
2. Add a matching view section with `data-view-panel="<same-value>"`.
3. Add page-specific search text with `data-search` on cards, panels, or tables that should be searchable.
4. Add the tab label and search placeholder in `VIEW_CHROME` inside `js/app.js`.

## Adding An Icon

Use the existing SVG placeholder pattern in `index.html`:

```html
<svg aria-hidden="true"><use href="#icon-example"></use></svg>
```

Then add the matching Tabler icon name in `TABLER_ICON_MAP` inside `js/icons.js`.

## Local Checks

```bash
node --check js/app.js
node --check js/icons.js
git diff --check
```
