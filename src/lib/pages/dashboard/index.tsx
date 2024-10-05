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

const markdown =
    '## Reasons to Plant Moth Beans as an Agribusiness:\n\nMoth beans (Vigna aconitifolia) offer a compelling case for agribusiness ventures due to their unique characteristics and growing demand:\n\n**Market Demand:**\n\n **High Protein Content:** Moth beans are a rich source of protein, making them a valuable alternative to conventional protein sources like soybeans. \n**Dietary Fiber:** They are also high in dietary fiber, which is essential for digestive health.\n**Nutritional Value:**  Moth beans are a good source of various vitamins, minerals, and antioxidants, appealing to health-conscious consumers.\n* *Gluten-Free Option:* As a legume, moth beans are naturally gluten-free, making them attractive for people with gluten intolerance or celiac disease.\n* *Rising Popularity:*  Demand for moth beans is increasing due to their health benefits and versatility in cooking, especially in vegetarian and vegan diets.\n\n*Agronomic Advantages:\n\n *Drought Tolerance:*  Moth beans can withstand drought conditions, making them suitable for regions with limited water resources.\n* *Nitrogen Fixation:*  They are legumes, meaning they can fix nitrogen from the air, reducing the need for nitrogen fertilizers and improving soil health.\n* *Pest Resistance:*  Moth beans are relatively resistant to common pests and diseases, minimizing the need for chemical treatments.\n* *Short Growing Season:*  They have a relatively short growing season, allowing for multiple crops per year and faster returns on investment.\n* *Low Input Requirements:*  Moth beans are generally low-maintenance, requiring minimal inputs for water and fertilizers.\n\n*Additional Benefits:\n\n *Market Differentiation:*  Moth beans offer a niche market opportunity compared to more common legumes like soybeans.\n* *Sustainable Practices:*  Their drought tolerance, nitrogen fixation, and pest resistance contribute to sustainable agricultural practices.\n* *Export Potential:*  Moth beans have a growing demand in international markets, offering potential for export earnings.\n\n*Challenges:\n\n *Limited Processing Infrastructure:*  Existing processing infrastructure for moth beans may be limited, requiring investments in processing and storage facilities.\n* *Awareness and Market Development:*  Raising awareness about moth beans and developing market channels may require effort.\n\n*Overall, moth beans present an exciting opportunity for agribusinesses looking to capitalize on growing demand for healthy and sustainable food options. Their drought tolerance, nutritional value, and market potential make them a promising crop for the future.* \n';

const API = 'https://crop-compass-api.onrender.com/api/v1/land';

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
    const [temp, setTemp] = useState<null | { id: string; data: any; }[]>(null);
    const [humidity, setHumidity] = useState<null | { id: string; data: any; }[]>(null);
    const [_predictions, _setPrediction] = useState(null);
    const [noloc, setNoLoc] = useState<true | null>();
    const [isRainFallLoading, setIsRainFallLoading] = useState<boolean>(false);
    const [isWeatherLoading, setIsWeatherLoading] = useState<boolean>(false);
    const [_isSoilLoading, setIsSoilLoading] = useState<boolean>(false);
    const [isPredsLoading, _setIsPredsLoading] = useState<boolean>(false);

    useEffect(() => {
        const loc = localStorage.getItem('location');

        // Check if location exists in localStorage
        if (loc === null) {
            setNoLoc(true);
            return;
        }

        const { latitude, longitude } = JSON.parse(loc);

        // Helper function to process weather data into chart format
        const generateTemperatureCharts = (weatherData: [{ datetime: string, temp: number, tempmin: number, tempmax: number }]) => {
            return [
                {
                    id: 'Temperature',
                    data: weatherData?.map((day: { datetime: string, temp: number }) => ({
                        x: day.datetime.slice(5),
                        y: day.temp,
                    })),
                },
                {
                    id: 'Min Temperature',
                    data: weatherData?.map((day: { datetime: string, tempmin: number }) => ({
                        x: day.datetime.slice(5),
                        y: day.tempmin,
                    })),
                },
                {
                    id: 'Max Temperature',
                    data: weatherData?.map((day: { datetime: string, tempmax: number }) => ({
                        x: day.datetime.slice(5),
                        y: day.tempmax,
                    })),
                },
            ];
        };
        const generateHumidityChart = (weatherData: [{ datetime: string, humidity: number }]) => {
            return [
                {
                    id: 'Humidity',
                    data: weatherData?.map((day: { datetime: string, humidity: number }) => ({
                        x: day.datetime.slice(5),
                        y: day.humidity,
                    })),
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
            } finally {
                setIsSoilLoading(false);
            }
        }

        // async function fetchPreds() {
        //     try {
        //         setIsPredsLoading(true);
        //         // const res = await axios.get(`${API}/predictions?lat=${latitude}&lon=${longitude}`, { timeout: 20000 });
        //         // setPrediction(res.data.data);
        //         // console.log('preds:', res.data.data);
        //     } catch (error) {
        //         console.error('Failed to fetch soil data:', error);
        //     } finally {
        //         setIsPredsLoading(false);
        //     }
        // }

        // Fetch all data in parallel
        const fetchAllData = async () => {
            await Promise.all([fetchWeather(), fetchRainFall(), fetchSoil()]);
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
                                Methbeans
                            </Tag>
                        </HStack>
                        <Stack w="full">
                            <ReactMarkdown components={ChakraUIRenderer()} skipHtml>
                                {markdown}
                            </ReactMarkdown>
                        </Stack>
                    </>
                )}
            </Stack>
        </Stack>
    );
};

export default Dashboard;
