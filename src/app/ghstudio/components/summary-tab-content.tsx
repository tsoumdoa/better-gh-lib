import { TabsContent } from "@/components/ui/tabs";
import { MetricCard } from "./metrics-card";
import { BarChart2 } from "lucide-react";
import { ArchiveVersion, XmlMetrics } from "@/types/types";

function formatVersion(archiveVersion: ArchiveVersion) {
  return `${archiveVersion.major}.${archiveVersion.minor}.${archiveVersion.revision}`;
}

export function SummaryTabContent(props: {
  metrics: XmlMetrics | undefined;
  // setMetrics: React.Dispatch<React.SetStateAction<XmlMetrics>>;
}) {
  return (
    <TabsContent value="summary" className="mt-2 rounded-md bg-neutral-800 p-4">
      <div className="mb-2 flex items-center gap-2">
        <BarChart2 className="h-5 w-5 text-white" />
        <span className="font-semibold text-white">Script Metrics</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          title="Archive Version"
          value={
            props.metrics?.archiveVersion &&
            formatVersion(props.metrics?.archiveVersion)
          }
        />
        <MetricCard title="Components" value={props.metrics?.componentCount} />
        <MetricCard title="Total Nodes" value={props.metrics?.totalNodes} />
        <MetricCard title="Max Depth" value={props.metrics?.maxDepth} />
        <MetricCard title="Plugins Count" value={props.metrics?.pluginsCount} />
        <MetricCard
          title="Schema Coverage"
          value={
            props.metrics?.schemaCoverage && `${props.metrics?.schemaCoverage}%`
          }
        />
      </div>
    </TabsContent>
  );
}
