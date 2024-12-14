import React from 'react';
import { FieldType, PanelProps, GrafanaTheme2 } from '@grafana/data';
import { css, cx } from '@emotion/css';
import { Tooltip, useStyles2, useTheme2 } from '@grafana/ui';
import { PanelDataErrorView } from '@grafana/runtime';
import dayjs from 'dayjs';

import { HourlyHeatmapOptions } from '../types';

type HourlyHeatmapPanelProps = PanelProps<HourlyHeatmapOptions>;

export const HourlyHeatmapPanel: React.FC<HourlyHeatmapPanelProps> = ({
  options,
  data,
  width,
  height,
  fieldConfig,
  id,
}) => {
  const theme = useTheme2();
  const styles = useStyles2(getStyles);

  if (data.series.length === 0) {
    return (
      <PanelDataErrorView
        fieldConfig={fieldConfig}
        panelId={id}
        data={data}
        needsNumberField
      />
    );
  }
  if (data.series.length > 1) {
    return (
      <PanelDataErrorView
        fieldConfig={fieldConfig}
        panelId={id}
        data={data}
        message="Only one series allowed"
      />
    );
  }

  const series = data.series[0];

  // Check for "hour" field
  const hourField = series.fields.find(
    (field) => field.name === 'hour' && field.type === FieldType.number
  );

  if (!hourField) {
    return (
      <PanelDataErrorView
        fieldConfig={fieldConfig}
        panelId={id}
        data={data}
        message="Field 'hour' not found"
      />
    );
  }

  const hours = new Array(24).fill(0).map((_, i) => i);

  // Check for "day" field
  const dayField = series.fields.find(
    (field) => field.name === 'day' && field.type === FieldType.number
  );

  if (!dayField) {
    return (
      <PanelDataErrorView
        fieldConfig={fieldConfig}
        panelId={id}
        data={data}
        message="Field 'day' not found"
      />
    );
  }

  const days = new Array(7).fill(0).map((_, i) => i);

  // Check for "value" field (the value to show in the heatmap)
  const valueField = series.fields.find(
    (field) => field.name === 'value' && field.type === FieldType.number
  );

  if (!valueField) {
    return (
      <PanelDataErrorView
        fieldConfig={fieldConfig}
        panelId={id}
        data={data}
        message="Field 'value' not found"
      />
    );
  }

  const maxValue = Math.max(...(valueField.values as number[]));

  const axisFrequency = width > 780 ? 1 : width > 480 ? 2 : 3;
  const color = theme.visualization.getColorByName(options.color);

  const hourFormatter = (hour: number) => dayjs().hour(hour).format('ha');
  const dayFormatter = (day: number | string) =>
    typeof day === 'number' ? defaultDayLabels[day] : day;
  const longHourFormatter = (hour: number) => {
    const day = dayjs().hour(hour);
    const from = day.format('ha');
    const to = day.add(1, 'hour').format('ha');
    return `${from} - ${to}`;
  };

  return (
    <div
      className={cx(
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
          grid-template-columns: auto repeat(${hours.length}, 1fr);
          grid-template-rows: auto repeat(${days.length}, 1fr);
        `
      )}
    >
      {/* Y axis (left) */}
      {days.map((day, i) => (
        <div
          key={i}
          className={cx(
            styles.axisLabel.base,
            styles.axisLabel.y,
            css`
              grid-column: 1;
              grid-row: ${i + 2};
            `
          )}
        >
          {dayFormatter(day)}
        </div>
      ))}
      {/* X axis (bottom) */}
      {hours.map((hour, i) => (
        <div
          key={i}
          className={cx(
            styles.axisLabel.base,
            styles.axisLabel.x,
            css`
              grid-column: ${i + 2};
              grid-row: ${days.length + 2};
              display: ${(i + 0) % axisFrequency === 0 ? 'block' : 'none'};
            `
          )}
        >
          <span className={styles.axisLabel.xText}>{hourFormatter(hour)}</span>
        </div>
      ))}
      {/* Heatmap */}
      {valueField.values
        .map((value, i) => ({
          value: value as number,
          columnIdx: getIndex(hourField.values[i] as number, hours),
          rowIdx: getIndex(dayField.values[i] as number, days),
        }))
        .map(({ value, columnIdx, rowIdx }, i) => {
          const hour = hourField.values[i] as number;
          const day = dayField.values[i] as number;
          const dayDisplay = dayFormatter(day);
          const hourDisplay = longHourFormatter(hour);

          return (
            <Tooltip
              key={i}
              content={
                <div>
                  <div className={styles.tooltip.header}>
                    <p
                      className={css`
                        margin-bottom: 0;
                      `}
                    >
                      {dayDisplay}, {hourDisplay}
                    </p>
                  </div>
                  <div className={styles.tooltip.body}>
                    <div
                      className={css`
                        display: flex;
                        justify-content: space-between;
                        gap: 4px;
                      `}
                    >
                      <span>{options.label}</span>
                      <strong
                        className={css`
                          color: ${color};
                        `}
                      >
                        {value}
                      </strong>
                    </div>
                  </div>
                </div>
              }
            >
              <div
                className={css`
                  grid-column: ${columnIdx + 2};
                  grid-row: ${rowIdx + 2};
                  background-color: ${color};
                  opacity: ${Math.pow(value / maxValue, options.exponent)};
                `}
              />
            </Tooltip>
          );
        })}
    </div>
  );
};

function getIndex(value: string | number, axisValues: Array<string | number>) {
  return axisValues.findIndex((v) => v === value);
}

const defaultDayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const getStyles = (theme: GrafanaTheme2) => {
  return {
    wrapper: css`
      position: relative;
      display: grid;
    `,
    axisLabel: {
      base: css`
        opacity: 0.6;
        font-size: 12px;
      `,
      x: css`
        text-align: center;
        position: relative;
        height: 25px;
      `,
      xText: css`
        position: absolute;
        padding-top: 6px;
        left: 0;
        right: 0;
        top: 0;
        transform: translateX(-50%);
      `,
      y: css`
        padding-right: 6px;
        align-self: center;
      `,
    },
    tooltip: {
      header: css`
        font-weight: 500;
        padding-bottom: 4px;
        border-bottom: 1px solid ${theme.colors.border.weak};
      `,
      body: css`
        padding-top: 8px;
        p {
          margin-bottom: 0;
        }
      `,
    },
  };
};
