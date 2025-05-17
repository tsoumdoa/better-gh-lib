import { TabsContent } from "@/components/ui/tabs";
import { BarChart2 } from "lucide-react";
import { XmlMetrics } from "@/types/types";
import { MetricsView } from "./metrics-view";

export function SummaryTabContent(props: { metrics: XmlMetrics | undefined }) {
  return (
    <TabsContent value="summary" className="mt-2 rounded-md bg-neutral-800 p-4">
      <div className="mb-2 flex items-center gap-2">
        <BarChart2 className="h-5 w-5 text-white" />
        <span className="font-semibold text-white">Script Metrics</span>
      </div>
      <MetricsView metrics={props.metrics} />
    </TabsContent>
  );
}
