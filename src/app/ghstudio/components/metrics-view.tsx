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
			<MetricCard
				title="Unique Component Count"
				value={props.metrics?.uniqueComponentCount}
			/>
			<MetricCard
				title="Total Node Connections"
				value={props.metrics?.totalNodes}
			/>
			<MetricCard
				title="Size of Script (pixel)"
				value={
					props.metrics?.sizeOfScript &&
					`${props.metrics?.sizeOfScript?.x} x ${props.metrics?.sizeOfScript?.y}`
				}
			/>
			<MetricCard
				title="Layout Density"
				value={
					props.metrics?.scriptDensity &&
					`${props.metrics?.scriptDensity * 100}%`
				}
			/>
			<MetricCard title="Plugins Count" value={props.metrics?.pluginsCount} />
		</div>
	);
}
