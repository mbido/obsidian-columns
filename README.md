# Advanced Columns for Obsidian

Create flexible, responsive, and beautifully styled columns directly in your Obsidian notes. This plugin provides a simple code block syntax to build complex layouts with fine-grained control over alignment, spacing, borders, shadows, and more.

![GIF Demo of the plugin in action](https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHdpd2ptZHQ1OXk0aHV0Nzg5NHFmbDMyanV3cWkydWg1YmphZGs3cyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ZasijBrfNA4QOThdIK/giphy.gif)

---

## Features

- **Simple Syntax**: Uses a clean `columns` code block that feels natural in Markdown.
- **Responsive Design**: Columns automatically stack into a single column on mobile devices for readability.
- **Highly Customizable**: Control widths, gaps, alignment, borders, shadows, padding, and corner radius.
- **Per-Column Styling**: Apply different alignments or gaps to individual columns.
- **Settings Panel**: Customize the default look and feel of your columns to match your theme perfectly.
- **Theme-Aware**: Default border colors adapt to Obsidian's light and dark modes.

---

## How to Use

To create a column layout, use a fenced code block with the `columns` language identifier. Separate the content of each column with `---`.

### Basic Example

This creates two equal-width columns with the default styling (a subtle border and shadow).

````md
```columns
widths: [1fr, 1fr]

# Column 1
Your content for the first column goes here. It can be anything you want.

- Lists
- **Bold Text**
- [[Internal Links]]

---

# Column 2
This is the second column. It's just as easy.
```
````

Which gives : 

![[images/first-example.png]]

### All Parameters

You can specify parameters at the top of the code block to control the appearance.

| Parameter | Description                                                                                   | Example Value                |
| :-------- | :-------------------------------------------------------------------------------------------- | :--------------------------- |
| `widths`  | **(Required)** A list of widths for each column. Use `fr` units (fractions) or `px` (pixels). | `[2fr, 1fr, 300px]`          |
| `gap`     | The space between columns. Can be a single value (for all gaps) or a list.                    | `20px` or `[10px, 30px]`     |
| `align`   | Vertical alignment. Use `start`, `center`, `end`, `stretch`. Can be a single value or a list. | `center` or `[start, end]`   |
| `border`  | The CSS `border` style. Set to `none` to disable.                                             | `1px solid #999`             |
| `shadow`  | The CSS `box-shadow` style. Set to `none` to disable.                                         | `0 5px 15px rgba(0,0,0,0.2)` |
| `radius`  | The CSS `border-radius` for rounding corners.                                                 | `12px`                       |
| `padding` | The CSS `padding` (inner space). Recommended when using a border or shadow.                   | `1.5em`                      |

### Advanced Example: Creating Styled Cards

By combining parameters, you can create visually appealing card layouts.

````md
```columns
widths: [1fr, 1fr, 1fr]
gap: 25px
align: start
border: none
shadow: 0 8px 20px rgba(0,0,0,0.15)
radius: 10px

### ✅ Task 1
A description of the first task. It's nicely contained in its own card.

---

### ⏳ Task 2
This one is in progress. The shadow gives it a nice "floating" effect.

---

### 💡 Idea
A new idea to consider for the future.
```
````

Which gives : 

![[images/second-example.png]]

## Settings

You can change all the default values (the default border, shadow, gap, etc.) in the plugin settings. Go to **Settings → Community Plugins → Advanced Columns** to customize the default appearance.

## Installation

This plugin is available on the Obsidian community plugin store.

1.  Open **Settings** in Obsidian.
2.  Go to **Community plugins**.
3.  Make sure "Restricted mode" is **off**.
4.  Click **Browse** and search for "Advanced Columns".
5.  Click **Install**, and then **Enable**.

---

## License

This plugin is released under the MIT License.