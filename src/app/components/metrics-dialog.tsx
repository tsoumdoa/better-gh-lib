import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogAction,
} from "@/components/ui/alert-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { FlowViewer } from "./flow-viewer";
import type { ParsedGrasshopper } from "parser/sand/src/types";

export function MetricsDialog(props: {
	open: boolean;
	setOpen: () => void;
	metrics: {
		GhVersion: string;
		componentsCount: number;
		uniqueCount: number;
		ghLibs: Array<{ name: string; author?: string; version: string }>;
	} | null;
	loading: boolean;
	parsedData: ParsedGrasshopper | null;
}) {
	return (
		<AlertDialog open={props.open} onOpenChange={props.setOpen}>
			<AlertDialogContent className="max-w-2xl">
				<AlertDialogHeader>
					<AlertDialogTitle>Script Metrics</AlertDialogTitle>
					<AlertDialogDescription>
						{props.loading ? (
							<div className="flex items-center justify-center py-8">
								<span className="text-neutral-400">Loading metrics...</span>
							</div>
						) : props.metrics && props.parsedData ? (
							<Tabs.Root defaultValue="metrics" className="mt-2">
								<Tabs.List className="flex border-b border-neutral-200">
									<Tabs.Trigger
										value="metrics"
										className="px-4 py-2 text-sm text-neutral-600 data-[state=active]:border-b-2 data-[state=active]:border-neutral-800 data-[state=active]:text-neutral-900"
									>
										Metrics
									</Tabs.Trigger>
									<Tabs.Trigger
										value="flow"
										className="px-4 py-2 text-sm text-neutral-600 data-[state=active]:border-b-2 data-[state=active]:border-neutral-800 data-[state=active]:text-neutral-900"
									>
										Flow
									</Tabs.Trigger>
								</Tabs.List>
								<Tabs.Content value="metrics" className="space-y-4 py-4">
									<div className="grid grid-cols-2 gap-4">
										<div className="space-y-1">
											<div className="text-xs text-neutral-500">
												Grasshopper Version
											</div>
											<div className="font-semibold text-neutral-800">
												{props.metrics.GhVersion}
											</div>
										</div>
										<div className="space-y-1">
											<div className="text-xs text-neutral-500">
												Total Components
											</div>
											<div className="font-semibold text-neutral-800">
												{props.metrics.componentsCount}
											</div>
										</div>
										<div className="space-y-1">
											<div className="text-xs text-neutral-500">
												Unique Components
											</div>
											<div className="font-semibold text-neutral-800">
												{props.metrics.uniqueCount}
											</div>
										</div>
										<div className="space-y-1">
											<div className="text-xs text-neutral-500">
												Connections
											</div>
											<div className="font-semibold text-neutral-800">
												{props.parsedData.wires.length}
											</div>
										</div>
									</div>
									{props.metrics.ghLibs && props.metrics.ghLibs.length > 0 && (
										<div className="space-y-2">
											<div className="text-xs text-neutral-500">
												Plugin Libraries
											</div>
											<div className="max-h-48 space-y-1 overflow-y-auto rounded-md bg-neutral-100 p-3">
												{props.metrics.ghLibs.map((lib, index) => (
													<div
														key={index}
														className="flex items-center justify-between border-b border-neutral-200 pb-2 last:border-0 last:pb-0"
													>
														<div>
															<div className="font-medium text-neutral-800">
																{lib.name}
															</div>
															<div className="text-xs text-neutral-500">
																{lib.author}
															</div>
														</div>
														<div className="text-xs text-neutral-500">
															{lib.version}
														</div>
													</div>
												))}
											</div>
										</div>
									)}
								</Tabs.Content>
								<Tabs.Content value="flow">
									<FlowViewer parsedData={props.parsedData} />
								</Tabs.Content>
							</Tabs.Root>
						) : (
							<div className="py-8 text-neutral-400">No metrics available</div>
						)}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogAction>Close</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
