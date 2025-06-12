// main.ts
import {App, MarkdownPostProcessorContext, MarkdownRenderer, Plugin, PluginSettingTab, Setting} from 'obsidian';

interface ColumnsPluginSettings {
  defaultGap: string;
  defaultAlign: string;
  defaultBorder: string;
  defaultRadius: string;
  defaultShadow: string;
  defaultPadding: string;
}

const DEFAULT_SETTINGS: ColumnsPluginSettings = {
  defaultGap: '1rem',
  defaultAlign: 'stretch',
  defaultBorder: '1px solid var(--background-modifier-border)',
  defaultRadius: '8px',
  defaultShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
  defaultPadding: '1.2em'
}

export default class ColumnsPlugin extends Plugin {
  settings: ColumnsPluginSettings;

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new ColumnsSettingTab(this.app, this));
    console.log('Plugin "Advanced Columns" loaded.');

    this.registerMarkdownCodeBlockProcessor('columns', (source, el, ctx) => {
      // ... (Cette partie est INCHANGÉE) ...
      const sourceLines = source.split('\n');
      const configLines = sourceLines.filter(line => line.includes(':'));

      const parseValue = (key: string): string|string[]|undefined => {
        const line = configLines.find(l => l.trim().startsWith(key));
        if (!line) return undefined;
        const value = line.split(':')[1].trim();
        if (value.startsWith('[') && value.endsWith(']'))
          return value.substring(1, value.length - 1)
              .split(',')
              .map(s => s.trim());
        return value;
      };

      const widthsValue = parseValue('widths:') ?? '1fr 1fr';
      const gapValue = parseValue('gap:') ?? this.settings.defaultGap;
      const alignValue = parseValue('align:') ?? this.settings.defaultAlign;
      const borderValue = parseValue('border:') ?? this.settings.defaultBorder;
      const radiusValue = parseValue('radius:') ?? this.settings.defaultRadius;
      const paddingValue = parseValue('padding:');
      const shadowValue = parseValue('shadow:') ?? this.settings.defaultShadow;

      const container = el.createEl('div');
      container.addClass('columns-container');
      container.style.display = 'grid';
      container.style.gridTemplateColumns =
          Array.isArray(widthsValue) ? widthsValue.join(' ') : widthsValue;

      if (typeof gapValue === 'string')
        container.style.gap = gapValue;
      else
        container.style.gap = '0';
      if (typeof alignValue === 'string')
        container.style.alignItems = alignValue;

      const columnContents = sourceLines.filter(line => !line.includes(':'))
                                 .join('\n')
                                 .split(/^\s*---\s*$/m)
                                 .filter(content => content.trim() !== '');

      columnContents.forEach((columnContent, index) => {
        const columnEl = container.createEl('div');
        columnEl.addClass('column-content');

        const finalBorder = (borderValue !== 'none') ? borderValue : undefined;
        const finalShadow = (shadowValue !== 'none') ? shadowValue : undefined;
        let finalPadding = paddingValue;

        const hasVisualContainer =
            (finalBorder &&
             (typeof finalBorder !== 'string' || finalBorder !== 'none')) ||
            (finalShadow &&
             (typeof finalShadow !== 'string' || finalShadow !== 'none'));
        if (hasVisualContainer && !paddingValue) {
          finalPadding = this.settings.defaultPadding;
        }

        if (finalBorder && typeof finalBorder === 'string')
          columnEl.style.border = finalBorder;
        if (finalPadding && typeof finalPadding === 'string' &&
            finalPadding !== '0px')
          columnEl.style.padding = finalPadding;
        if (finalShadow && typeof finalShadow === 'string')
          columnEl.style.boxShadow = finalShadow;
        if (radiusValue && typeof radiusValue === 'string')
          columnEl.style.borderRadius = radiusValue;

        if (Array.isArray(alignValue) && alignValue[index])
          columnEl.style.alignSelf = alignValue[index];
        if (Array.isArray(gapValue) && gapValue[index] &&
            index < columnContents.length - 1)
          columnEl.style.marginRight = gapValue[index];

        MarkdownRenderer.render(
            this.app, columnContent.trim(), columnEl, ctx.sourcePath, this);
      });
    });
  }

  onunload() {
    console.log('Plugin "Advanced Columns" unloaded.');
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

class ColumnsSettingTab extends PluginSettingTab {
  plugin: ColumnsPlugin;

  constructor(app: App, plugin: ColumnsPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const {containerEl} = this;
    containerEl.empty();
    containerEl.createEl('h2', {text: 'Advanced Columns - Default Settings'});

    new Setting(containerEl)
        .setName('Default border')
        .setDesc(
            'The default CSS `border` style for columns. Set to `none` to disable.')
        .addText(
            text => text.setPlaceholder('e.g., 1px solid #ccc')
                        .setValue(this.plugin.settings.defaultBorder)
                        .onChange(async (value) => {
                          this.plugin.settings.defaultBorder = value;
                          await this.plugin.saveSettings();
                          this.plugin.app.workspace
                              .updateOptions();  // Force refresh
                        }));

    new Setting(containerEl)
        .setName('Default shadow')
        .setDesc(
            'The default CSS `box-shadow` style. Set to `none` to disable.')
        .addText(
            text => text.setPlaceholder('e.g., 0 2px 8px #0005')
                        .setValue(this.plugin.settings.defaultShadow)
                        .onChange(async (value) => {
                          this.plugin.settings.defaultShadow = value;
                          await this.plugin.saveSettings();
                          this.plugin.app.workspace
                              .updateOptions();  // Force refresh
                        }));

    new Setting(containerEl)
        .setName('Default radius')
        .setDesc('The default CSS `border-radius` for rounding corners.')
        .addText(
            text => text.setPlaceholder('e.g., 8px')
                        .setValue(this.plugin.settings.defaultRadius)
                        .onChange(async (value) => {
                          this.plugin.settings.defaultRadius = value;
                          await this.plugin.saveSettings();
                          this.plugin.app.workspace
                              .updateOptions();  // Force refresh
                        }));

    new Setting(containerEl)
        .setName('Default padding')
        .setDesc('The default CSS `padding` (inner space).')
        .addText(
            text => text.setPlaceholder('e.g., 1.2em')
                        .setValue(this.plugin.settings.defaultPadding)
                        .onChange(async (value) => {
                          this.plugin.settings.defaultPadding = value;
                          await this.plugin.saveSettings();
                          this.plugin.app.workspace
                              .updateOptions();  // Force refresh
                        }));

    new Setting(containerEl)
        .setName('Default gap')
        .setDesc('The default CSS `gap` between columns.')
        .addText(
            text => text.setPlaceholder('e.g., 1.5rem')
                        .setValue(this.plugin.settings.defaultGap)
                        .onChange(async (value) => {
                          this.plugin.settings.defaultGap = value;
                          await this.plugin.saveSettings();
                          this.plugin.app.workspace
                              .updateOptions();  // Force refresh
                        }));

    new Setting(containerEl)
        .addButton(
            button => button.setButtonText('Reset to defaults')
                          .setWarning()
                          .onClick(async () => {
                            this.plugin.settings = {...DEFAULT_SETTINGS};
                            await this.plugin.saveSettings();
                            this.plugin.app.workspace
                                .updateOptions();  // Force refresh after reset
                            this.display();
                          }));
  }
}