import { GhXmlType } from "@/types/types";
import { CheckCircle, XCircle } from "lucide-react";

export function ValidatedResult(props: {
	isValidXml: boolean;
	validatedJson: GhXmlType | undefined;
	schemaCoverage: number | undefined;
}) {
	return (
		<div className="h-[32px] w-fit rounded-md bg-neutral-800 p-2 text-sm font-semibold">
			<div className="flex items-center gap-2">
				{props.isValidXml ? (
					<div className="flex items-center text-green-500">
						<CheckCircle className="h-5 w-5 pr-1" />
						Valid GhXml
						{props.schemaCoverage &&
							` - Schema Coverage ${props.schemaCoverage}%`}
					</div>
				) : (
					<div className="flex items-center text-red-500">
						<XCircle className="mr-1 h-5 w-5" />
						Invalid GhXml
					</div>
				)}
			</div>
		</div>
	);
}
