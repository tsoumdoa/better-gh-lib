import { GhCard } from "@/types/types";

export function EditButtons(props: {
	editMode: boolean;
	setEditMode: (b: boolean) => void;
	setGhInfo: (ghInfo: GhCard) => void;
	handleEdit: (b: boolean) => void;
	handleCancel: () => void;
	deletePost: () => void;
	ghInfo: GhCard;
}) {
	return (
		<div className="flex items-center justify-end text-neutral-400 transition-all">
			<button
				className={`px-2 font-bold hover:text-neutral-50`}
				onClick={() => props.deletePost()}
			>
				delete
			</button>
			<button
				className={`px-2 font-bold hover:text-neutral-50`}
				onClick={() => props.handleCancel()}
			>
				cancel
			</button>
			<button
				className={`px-2 font-bold hover:text-neutral-50`}
				onClick={() => props.handleEdit(true)}
			>
				done
			</button>
		</div>
	);
}
