import { Box, useColorMode } from '@chakra-ui/react';
import { ResponsiveLine, type Serie } from '@nivo/line';
import { memo } from 'react';

interface ChartProps {
  data: Array<Serie>;
  bottomLegend: string;
  leftLegend?: string;
  disableAnimate?: boolean;
  disableLeftAxis?: boolean;
}

export const Chart = memo(
  ({
    data,
    bottomLegend = '',
    leftLegend = '',
    disableAnimate = false,
    disableLeftAxis = false,
  }: ChartProps) => {
    const { colorMode } = useColorMode();
    const isDarkMode = colorMode === 'dark';

    const axisThemeColor = isDarkMode ? '#ffffff' : '#000000';
    const gridLineColor = isDarkMode ? '#fff' : '#ababab';
    const tooltipBgColor = isDarkMode ? '#333333' : '#ffffff';

    const chartTheme = {
      axis: {
        ticks: {
          text: {
            fill: axisThemeColor,
          },
        },
        domain: {
          line: {
            stroke: axisThemeColor,
          },
        },
        legend: {
          text: {
            fill: axisThemeColor,
          },
        },
      },
      tooltip: {
        container: {
          background: tooltipBgColor,
          color: axisThemeColor,
        },
      },
      grid: {
        line: {
          stroke: gridLineColor,
          strokeWidth: 0.5,
        },
      },
      legends: {
        text: {
          fill: axisThemeColor,
        },
      },
    };

    return (
      <Box width="full" height="full">
        <ResponsiveLine
          data={data}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: true,
            reverse: false,
          }}
          yFormat=" >-.2f"
          theme={chartTheme}
          axisBottom={{
            tickSize: 5,
            tickPadding: 10,
            tickRotation: 30,
            legend: bottomLegend,
            legendOffset: 36,
            legendPosition: 'start',
          }}
          axisLeft={
            !disableLeftAxis
              ? {
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: leftLegend,
                  legendOffset: -40,
                  legendPosition: 'start',
                }
              : null
          }
          colors={{ scheme: 'nivo' }}
          lineWidth={5}
          pointSize={10}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'seriesColor' }}
          pointLabelYOffset={-12}
          useMesh={true}
          areaOpacity={0.5}
          enableSlices="x"
          legends={[
            {
              anchor: 'top-right',
              direction: 'column',
              justify: false,
              translateX: 100,
              translateY: 0,
              itemDirection: 'left-to-right',
              itemWidth: 80,
              itemHeight: 20,
              itemsSpacing: 2,
              itemOpacity: 1,
              symbolSize: 20,
              symbolShape: 'square',
              symbolBorderColor: 'rgba(0, 0, 0, .5)',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemBackground: 'rgba(0, 0, 0, .03)',
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
          animate={!disableAnimate}
          motionConfig="slow"
        />
      </Box>
    );
  },
);

export const humidityFakeData = [
  {
    id: 'Humidity',
    data: [
      { x: '2024-10-04', y: 63 },
      { x: '2024-10-05', y: 79 },
      { x: '2024-10-06', y: 56 },
      { x: '2024-10-07', y: 72 },
      { x: '2024-10-08', y: 85 },
      { x: '2024-10-09', y: 68 },
      { x: '2024-10-10', y: 74 },
      { x: '2024-10-11', y: 48 },
      { x: '2024-10-12', y: 66 },
      { x: '2024-10-13', y: 83 },
      { x: '2024-10-14', y: 57 },
      { x: '2024-10-15', y: 71 },
    ],
  },
];

export const rainfallFakeData = [
  {
    id: 'Rainfall',
    data: [
      { x: '2024-10-04', y: 12 },
      { x: '2024-10-05', y: 5 },
      { x: '2024-10-06', y: 22 },
      { x: '2024-10-07', y: 0 },
      { x: '2024-10-08', y: 18 },
      { x: '2024-10-09', y: 35 },
      { x: '2024-10-10', y: 10 },
      { x: '2024-10-11', y: 45 },
      { x: '2024-10-12', y: 30 },
      { x: '2024-10-13', y: 3 },
      { x: '2024-10-14', y: 20 },
      { x: '2024-10-15', y: 7 },
      { x: '2024-10-16', y: 0 },
      { x: '2024-10-17', y: 15 },
      { x: '2024-10-18', y: 40 },
      { x: '2024-10-19', y: 11 },
      { x: '2024-10-20', y: 32 },
      { x: '2024-10-21', y: 0 },
      { x: '2024-10-22', y: 28 },
      { x: '2024-10-23', y: 24 },
      { x: '2024-10-24', y: 16 },
      { x: '2024-10-25', y: 5 },
      { x: '2024-10-26', y: 12 },
      { x: '2024-10-27', y: 29 },
      { x: '2024-10-28', y: 6 },
      { x: '2024-10-29', y: 17 },
      { x: '2024-10-30', y: 40 },
      { x: '2024-10-31', y: 8 },
      { x: '2024-11-01', y: 25 },
      { x: '2024-11-02', y: 3 },
    ],
  },
];
