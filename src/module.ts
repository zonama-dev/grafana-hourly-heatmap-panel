import { PanelPlugin } from '@grafana/data';

import { HourlyHeatmapOptions } from './types';
import { HourlyHeatmapPanel } from './components/HourlyHeatmapPanel';

export const plugin = new PanelPlugin<HourlyHeatmapOptions>(
  HourlyHeatmapPanel
).setPanelOptions((builder) => {
  return builder
    .addColorPicker({
      path: 'color',
      name: 'Colour',
      defaultValue: 'blue',
    })
    .addTextInput({
      path: 'label',
      name: 'Label',
      defaultValue: 'Items',
    })
    .addSliderInput({
      path: 'exponent',
      name: 'Gradient exponent',
      defaultValue: 1,
      settings: {
        min: 0.1,
        max: 5,
        step: 0.1,
      },
    });
});
