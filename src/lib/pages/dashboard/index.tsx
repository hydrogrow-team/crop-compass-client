import {
    Box,
    Card,
    CardBody,
    CardHeader,
    HStack,
    Heading,
    SimpleGrid,
    Spinner,
    Stack,
    Tag,
} from '@chakra-ui/react';
import { Link as ChakraLink } from '@chakra-ui/react';
import { Icon } from '@iconify/react';
import axios from 'axios';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link as ReactRouterLink } from 'react-router-dom';
import { Chart, rainfallFakeData } from '~/lib/layout/components/chart';


const API = 'https://crop-compass-server.fly.dev/api/v1/land';

interface SoilData {
    mean: number;
    unit: string;
    label: string;
}

interface SoilProperties {
    cec: SoilData;
    nitrogen: SoilData;
    phh2o: SoilData;
    sand: SoilData;
    soc: SoilData;
}

interface Value {
    avg: number;
}

interface RainFallData {
    year: number;
    month: number;
    day: number;
    date: string;
    epochTime: number;
    value: Value;
    raw_value: number;
    NaN: number;
    isodate: string;
}

const Dashboard = () => {
    const [rainfall, setRainfall] = useState<Array<RainFallData> | null>(null);
    const [soilProps, setSoilProps] = useState<SoilProperties | null>(null);
    const [_weather, setWeather] = useState(null);
    const [temp, setTemp] = useState<null | { id: string; data: any }[]>(null);
    const [humidity, setHumidity] = useState<null | { id: string; data: any }[]>(
        null,
    );
    const [pred, setPred] = useState(null);
    const [noloc, setNoLoc] = useState<true | null>();
    const [isRainFallLoading, setIsRainFallLoading] = useState<boolean>(false);
    const [isWeatherLoading, setIsWeatherLoading] = useState<boolean>(false);
    const [_isSoilLoading, setIsSoilLoading] = useState<boolean>(false);
    const [isPredsLoading, setIsPredsLoading] = useState<boolean>(false);

    useEffect(() => {
        const loc = localStorage.getItem('location');

        // Check if location exists in localStorage
        if (loc === null) {
            setNoLoc(true);
            return;
        }

        const { latitude, longitude } = JSON.parse(loc);

        // Helper function to process weather data into chart format
        const generateTemperatureCharts = (
            weatherData: [
                { datetime: string; temp: number; tempmin: number; tempmax: number },
            ],
        ) => {
            return [
                {
                    id: 'Temperature',
                    data: weatherData?.map((day: { datetime: string; temp: number }) => ({
                        x: day.datetime.slice(5),
                        y: day.temp,
                    })),
                },
                {
                    id: 'Min Temperature',
                    data: weatherData?.map(
                        (day: { datetime: string; tempmin: number }) => ({
                            x: day.datetime.slice(5),
                            y: day.tempmin,
                        }),
                    ),
                },
                {
                    id: 'Max Temperature',
                    data: weatherData?.map(
                        (day: { datetime: string; tempmax: number }) => ({
                            x: day.datetime.slice(5),
                            y: day.tempmax,
                        }),
                    ),
                },
            ];
        };
        const generateHumidityChart = (
            weatherData: [{ datetime: string; humidity: number }],
        ) => {
            return [
                {
                    id: 'Humidity',
                    data: weatherData?.map(
                        (day: { datetime: string; humidity: number }) => ({
                            x: day.datetime.slice(5),
                            y: day.humidity,
                        }),
                    ),
                },
            ];
        };
        // Fetch weather data
        async function fetchWeather() {
            try {
                setIsWeatherLoading(true);

                const res = await axios.get(
                    `${API}/weather?lat=${latitude}&lon=${longitude}`,
                    { timeout: 20000 },
                );
                const weatherData = res.data.data.days;
                setWeather(weatherData);

                setTemp(generateTemperatureCharts(weatherData));
                setHumidity(generateHumidityChart(weatherData));
            } catch (_error) {
            } finally {
                setIsWeatherLoading(false);
            }
        }

        // Fetch rainfall data
        async function fetchRainFall() {
            try {
                setIsRainFallLoading(true);

                const res = await axios.get(
                    `${API}/rainfall?lat=${latitude}&lon=${longitude}`,
                    { timeout: 20000 },
                );
                setRainfall(res.data.data.data);
            } catch (_error) {
            } finally {
                setIsRainFallLoading(false);
            }
        }
        // Fetch soil data
        async function fetchSoil() {
            try {
                setIsSoilLoading(true);

                const res = await axios.get(
                    `${API}/soilgrids?lat=${latitude}&lon=${longitude}`,
                    { timeout: 20000 },
                );
                setSoilProps(res.data.data);
            } catch (_error) {
                console.error(_error)
            } finally {
                setIsSoilLoading(false);
            }
        }

        async function fetchPreds() {
            try {
                setIsPredsLoading(true);
                const res = await axios.get(`${API}/prediction?lat=${latitude}&lon=${longitude}`, { timeout: 20000 });
                setPred(res.data.data);
                console.log('preds:', res.data.data);
            } catch (error) {
                console.error('Failed to fetch soil data:', error);
            } finally {
                setIsPredsLoading(false);
            }
        }

        // Fetch all data in parallel
        const fetchAllData = async () => {
            await Promise.all([fetchWeather(), fetchRainFall(), fetchSoil(), fetchPreds()]);
        };

        // Trigger data fetching
        fetchAllData();
    }, []); // Empty dependency array to run once on mount

    if (noloc) {
        return (
            <Box>
                <ChakraLink as={ReactRouterLink} to="/auth/signup">
                    You're not authenticated. Please Sign up.
                </ChakraLink>
            </Box>
        );
    }

    return (
        <Stack width={'full'} height={'full'} alignItems={'center'} minHeight={400}>
            <Heading>Dashboard</Heading>
            <SimpleGrid columns={2} spacing={10} height={'full'} width={'full'}>
                <Card minH={500} h="full" w="full">
                    <CardHeader>
                        <HStack justifyItems={'center'}>
                            <Icon icon="tabler:temperature-celsius" fontSize={'30px'} />
                            <Heading size="md">Temperature</Heading>
                        </HStack>
                    </CardHeader>
                    <CardBody>
                        {/* {temp === null &&} */}
                        {isWeatherLoading ? (
                            <Spinner color="green.100" size="xl" />
                        ) : (
                            <Chart
                                disableLeftAxis={true}
                                data={temp ?? []}
                                bottomLegend={'Day'}
                            />
                        )}
                    </CardBody>
                </Card>
                <Card minH={500} h="full" w="full">
                    <CardHeader>
                        <HStack justifyItems={'center'}>
                            <Icon icon="carbon:humidity-alt" fontSize={'30px'} />
                            <Heading size="md">Humidity</Heading>
                        </HStack>
                    </CardHeader>
                    <CardBody>
                        {isWeatherLoading ? (
                            <Spinner color="green.100" size="xl" />
                        ) : (
                            <Chart
                                data={humidity ?? []}
                                leftLegend={'Humidity'}
                                bottomLegend={'Day'}
                            />
                        )}
                    </CardBody>
                </Card>
                <Card minH={500} h="full" w="full">
                    <CardHeader>
                        <HStack justifyItems={'center'}>
                            <Icon icon="mynaui:cloud-rain" fontSize={'30px'} />
                            <Heading size="md">Rain Fall</Heading>
                        </HStack>
                    </CardHeader>
                    <CardBody>
                        {isRainFallLoading ? (
                            <Spinner color="green.100" size="xl" />
                        ) : (
                            <Chart
                                data={
                                    rainfall !== null
                                        ? [
                                            {
                                                id: 'Rainfall',
                                                data: rainfall?.map((rec) => ({
                                                    x: `${rec.month}-${rec.day}`,
                                                    y: Math.fround(rec.value.avg),
                                                })),
                                            },
                                        ]
                                        : rainfallFakeData
                                }
                                leftLegend={'RainFall'}
                                bottomLegend={'Day'}
                            />
                        )}
                    </CardBody>
                </Card>
                <Stack>
                    <HStack justifyItems={'center'}>
                        <Icon icon="iconoir:soil-alt" fontSize={'50px'} />
                        <Heading>Soil Properties</Heading>
                    </HStack>
                    <Stack spacing={2}>
                        <Card>
                            <CardBody>
                                <HStack justify={'space-between'}>
                                    <HStack justify={'center'} align={'self-start'}>
                                        <Icon icon="iconoir:nitrogen" fontSize={'30px'} />
                                        <Heading size="sm">Nitrogen</Heading>
                                    </HStack>
                                    {soilProps === null ? (
                                        <Tag colorScheme="red">No data found</Tag>
                                    ) : (
                                        <Stack justify={'center'} align={'self-end'}>
                                            <Box>{soilProps?.nitrogen.mean}</Box>
                                            <Tag
                                                colorScheme="green"
                                                size="sm"
                                                textTransform={'uppercase'}
                                            >
                                                {soilProps?.nitrogen.unit}
                                            </Tag>
                                        </Stack>
                                    )}
                                </HStack>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody>
                                <HStack justify={'space-between'}>
                                    <HStack justify={'center'} align={'self-start'}>
                                        <Icon icon="mdi:ph" fontSize={'30px'} />
                                        <Heading size="sm">of Water</Heading>
                                    </HStack>
                                    {soilProps === null ? (
                                        <Tag colorScheme="red">No data found</Tag>
                                    ) : (
                                        <Stack justify={'center'} align={'center'}>
                                            <Box>{soilProps?.phh2o.mean / 10}</Box>
                                        </Stack>
                                    )}
                                </HStack>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody>
                                <HStack justify={'space-between'}>
                                    <HStack justify={'center'} align={'self-start'}>
                                        <Icon icon="iconoir:soil" fontSize={'30px'} />
                                        <Heading size="sm">Cation exchange capacity</Heading>
                                    </HStack>
                                    {soilProps === null ? (
                                        <Tag colorScheme="red">No data found</Tag>
                                    ) : (
                                        <Stack justify={'center'} align={'self-end'}>
                                            <Box>{soilProps?.cec.mean}</Box>
                                            <Tag
                                                colorScheme="green"
                                                size="sm"
                                                textTransform={'uppercase'}
                                            >
                                                {soilProps?.cec.unit}
                                            </Tag>
                                        </Stack>
                                    )}
                                </HStack>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody>
                                <HStack justify={'space-between'}>
                                    <HStack justify={'center'} align={'self-start'}>
                                        <Icon icon="iconoir:carbon" fontSize={'30px'} />
                                        <Heading size="sm">Soil organic carbon</Heading>
                                    </HStack>
                                    {soilProps === null ? (
                                        <Tag colorScheme="red">No data found</Tag>
                                    ) : (
                                        <Stack justify={'center'} align={'self-end'}>
                                            <Box>{soilProps?.soc.mean}</Box>
                                            <Tag
                                                colorScheme="green"
                                                size="sm"
                                                textTransform={'uppercase'}
                                            >
                                                {soilProps?.soc.unit}
                                            </Tag>
                                        </Stack>
                                    )}
                                </HStack>
                            </CardBody>
                        </Card>
                    </Stack>
                </Stack>
            </SimpleGrid>

            <Stack w="full" justify={'center'} align={'center'}>
                <Heading>Predictions</Heading>
                {isPredsLoading ? (
                    <Spinner size="xl" colorScheme="green" />
                ) : (
                    <>
                        <HStack w="full">
                            <Heading size="lg">Recommended:</Heading>
                            <Tag colorScheme="green" size="lg">
                                {pred?.prediction}
                            </Tag>
                        </HStack>
                        <Stack w="full">
                            <ReactMarkdown components={ChakraUIRenderer()} skipHtml>
                                {pred?.description}
                            </ReactMarkdown>
                        </Stack>
                    </>
                )}
            </Stack>
        </Stack>
    );
};

export default Dashboard;
