import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogAction,
} from "@/components/ui/alert-dialog";

export function MetricsDialog(props: {
	open: boolean;
	setOpen: () => void;
	metrics: {
		GhVersion: string;
		componentsCount: number;
		uniqueCount: number;
		ghLibs: Array<{ name: string; author: string; version: string }>;
	} | null;
	loading: boolean;
}) {
	return (
		<AlertDialog open={props.open} onOpenChange={props.setOpen}>
			<AlertDialogContent className="max-w-2xl">
				<AlertDialogHeader>
					<AlertDialogTitle>Script Metrics</AlertDialogTitle>
					<AlertDialogDescription>
						{props.loading ? (
							<div className="flex items-center justify-center py-8">
								<a className="text-neutral-400">Loading metrics...</a>
							</div>
						) : props.metrics ? (
							<div className="space-y-4 py-4">
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
											Plugin Libraries
										</div>
										<div className="font-semibold text-neutral-800">
											{props.metrics.ghLibs.length}
										</div>
									</div>
								</div>
								{props.metrics.ghLibs.length > 0 && (
									<div className="space-y-2">
										<div className="text-xs text-neutral-500">
											Plugin Libraries
										</div>
										<div className="max-h-48 space-y-1 overflow-y-auto rounded-md bg-neutral-800 p-3">
											{props.metrics.ghLibs.map((lib, index) => (
												<div
													key={index}
													className="flex items-center justify-between border-b border-neutral-700 pb-2 last:border-0 last:pb-0"
												>
													<div>
														<div className="font-medium text-neutral-100">
															{lib.name}
														</div>
														<div className="text-xs text-neutral-400">
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
							</div>
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
