import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PropertyType } from "@/types/subs/definition-objects-schema";
import { TabsContent } from "@radix-ui/react-tabs";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

export function ComponentsTabContent(props: {
  data:
    | {
        property: PropertyType;
        count: number;
      }[]
    | undefined;
}) {
  const chartConfig = {} satisfies ChartConfig;
  if (!props.data) return null;

  const sorted = props.data.sort((a, b) => b.count - a.count);
  const top10 = sorted.slice(0, 10);

  return (
    <div>
      <TabsContent value="components" className="rounded-md bg-neutral-800 p-4">
        <div className="pb-1 font-semibold text-white">
          10 most used components
        </div>

        <ChartContainer
          config={chartConfig}
          className="f-fit min-h-[100px] w-full"
        >
          <BarChart
            data={top10}
            layout="vertical"
            margin={{
              left: -10,
            }}
          >
            <XAxis type="number" dataKey="count" fill="white" />
            <YAxis
              fill="white"
              dataKey="property.name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={120}
              tickFormatter={(value) => value.slice && value.slice(0, 12)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="#eab308" radius={5} />
          </BarChart>
        </ChartContainer>
      </TabsContent>
    </div>
  );
}
