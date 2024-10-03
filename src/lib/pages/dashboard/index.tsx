import { Heading, Stack } from '@chakra-ui/react';
import { Chart, weatherFakeData } from '~/lib/layout/components/chart';



const Dashboard = () => {
    return (
        <Stack width={"full"} height={"full"}  >
            <Heading>
                Dashboard
            </Heading>

            <Stack width={"full"} alignItems={"center"} minHeight={1000}>
                <Heading size="lg">Weather</Heading>
                <Chart data={weatherFakeData} axisBottomRotation={15}
                    LeftLegend={<div>
                        Temperature
                    </div>}
                    BottomLegend={<div>
                        Day
                    </div>}
                />

            </Stack>

        </Stack>
    );
};

export default Dashboard;

