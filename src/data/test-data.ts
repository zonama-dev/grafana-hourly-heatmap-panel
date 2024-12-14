import { dateTime, FieldType, LoadingState, PanelData } from '@grafana/data';

export function generateHourlyHeatmap(): PanelData {
  const data = {
    state: LoadingState.Done,
    timeRange: {
      from: dateTime('2021-01-01T00:00:00Z'),
      to: dateTime('2021-01-01T23:59:59Z'),
      raw: {
        from: dateTime('2021-01-01T00:00:00Z'),
        to: dateTime('2021-01-01T23:59:59Z'),
      },
    },
    series: [
      {
        fields: [
          {
            name: 'day',
            type: FieldType.number,
            config: {},
            values: new Array(7)
              .fill(0)
              .flatMap((_, i) => new Array(24).fill(i) as number[]),
          },
          {
            name: 'hour',
            type: FieldType.number,
            config: {},
            values: new Array(7)
              .fill(0)
              .flatMap(() => new Array(24).fill(0).map((_, i) => i)),
          },
          {
            name: 'value',
            type: FieldType.number,
            config: {},
            values: new Array(24 * 7)
              .fill(0)
              .map(() => Math.round(Math.random() * 1000) / 10),
          },
        ],
        length: 24 * 7,
      },
    ],
  };

  return data;
}
