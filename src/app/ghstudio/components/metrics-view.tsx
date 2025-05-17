import { ArchiveVersion, XmlMetrics } from "@/types/types";
import { MetricCard } from "./metrics-card";

function formatVersion(archiveVersion: ArchiveVersion) {
  return `${archiveVersion.major}.${archiveVersion.minor}.${archiveVersion.revision}`;
}

export function MetricsView(props: { metrics: XmlMetrics | undefined }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <MetricCard
        title="Archive Version"
        value={
          props.metrics?.archiveVersion &&
          formatVersion(props.metrics?.archiveVersion)
        }
      />
      <MetricCard
        title="Component Count"
        value={props.metrics?.componentCount}
      />
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
  );
}
