import { useColorMode } from '@chakra-ui/react';
import type { Theme } from "@nivo/core"
import { ResponsiveLine, type Serie, } from '@nivo/line'
import type { ReactNode } from 'react';



export const Chart = ({
    data,
    axisBottomRotation = 0,
    BottomLegend,
    LeftLegend,
    disableAxisBottom,
    disableAnimate,
}: { data: Array<Serie>, axisBottomRotation: number, BottomLegend?: ReactNode, LeftLegend?: ReactNode, disableAxisBottom: boolean, disableAnimate: boolean }) => {

    const { colorMode } = useColorMode();
    const isDarkMode = colorMode === "dark";

    const theme: Theme = {
        axis: {
            ticks: {
                text: {
                    fill: isDarkMode ? '#ffffff' : '#000000',
                },
            },
            domain: {
                line: {
                    stroke: isDarkMode ? '#ffffff' : '#000000', // Axis line color
                },
            },
            legend: {
                text: {
                    fill: isDarkMode ? '#ffffff' : '#000000',
                },
            },
        },
        tooltip: {
            container: {
                color: isDarkMode ? '#333333' : '#ffffff',
                text: {
                    fill: isDarkMode ? '#ffffff' : '#000000',
                },
            },
        },
        grid: {
            line: {
                stroke: isDarkMode ? '#fff' : '#dddddd',
                strokeWidth: 0.5,
            },
        },
        legends: {
            text: {
                fill: isDarkMode ? '#ffffff' : '#000000',
            }
        }
    };
    
    return (
        <ResponsiveLine
            data={data}

            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{
                type: 'linear',
                min: 'auto',
                max: 'auto',
                stacked: true,
                reverse: false
            }}
            yFormat=' >-.2f'
            theme={theme}
            axisBottom={
                disableAxisBottom
                    ? false
                    : {
                        orient: "bottom",
                        tickSize: 5,
                        tickPadding: 10,
                        tickRotation: axisBottomRotation,
                        legend: BottomLegend,
                        legendOffset: 36,
                        legendPosition: "middle",
                    }
            }
            axisLeft={{
                orient: "left",
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: LeftLegend,
                legendOffset: -40,
                legendPosition: "middle",
            }}

            colors={{ scheme: "nivo" }}
            lineWidth={5}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "seriesColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            areaOpacity={0.5}
            enableSlices='x'
            legends={[
                {
                    anchor: "top-right",
                    direction: "column",
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemDirection: "left-to-right",
                    itemWidth: 80,
                    itemHeight: 20,
                    itemsSpacing: 2,
                    itemOpacity: 1,
                    symbolSize: 20,
                    symbolShape: "square",
                    symbolBorderColor: "rgba(0, 0, 0, .5)",
                    effects: [
                        {
                            on: "hover",
                            style: {
                                itemBackground: "rgba(0, 0, 0, .03)",
                                itemOpacity: 1,
                            },
                        },
                    ],
                },
            ]}
            animate={!disableAnimate}
            motionConfig='slow'
        />
    )
}


export const weatherFakeData = [
    {
        id: "Temperature",
        color: "hsl(165, 70%, 50%)",
        data: [
            { x: "2024-10-03", y: 23 },
            { x: "2024-10-04", y: 22 },
            { x: "2024-10-05", y: 24 },
            { x: "2024-10-06", y: 25 },
            { x: "2024-10-07", y: 21 },
            { x: "2024-10-08", y: 19 },
            { x: "2024-10-09", y: 20 },
            { x: "2024-10-10", y: 18 },
            { x: "2024-10-11", y: 22 },
            { x: "2024-10-12", y: 23 },
            { x: "2024-10-13", y: 21 },
            { x: "2024-10-14", y: 20 },
            { x: "2024-10-15", y: 25 },
            { x: "2024-10-16", y: 24 },
            { x: "2024-10-17", y: 22 },
            { x: "2024-10-18", y: 21 },
            { x: "2024-10-19", y: 23 },
            { x: "2024-10-20", y: 22 },
            { x: "2024-10-21", y: 24 },
            { x: "2024-10-22", y: 26 },
            { x: "2024-10-23", y: 20 },
            { x: "2024-10-24", y: 19 },
            { x: "2024-10-25", y: 18 },
            { x: "2024-10-26", y: 22 },
            { x: "2024-10-27", y: 23 },
            { x: "2024-10-28", y: 24 },
            { x: "2024-10-29", y: 25 },
            { x: "2024-10-30", y: 21 },
            { x: "2024-10-31", y: 20 },
            { x: "2024-11-01", y: 22 }
        ]
    }
];
