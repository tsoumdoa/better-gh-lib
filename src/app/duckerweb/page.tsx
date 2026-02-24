"use client";

import { useState } from "react";
import Link from "next/link";
import { buildGhJson } from "parser/sand/src/parser";
import type { ParsedGrasshopper } from "parser/sand/src/types";
import { Clipboard, X } from "lucide-react";
import { validateGhXml } from "../utils/gh-xml";

interface ParsedComponent {
	id: string;
	type: string;
	nickName: string;
	description?: string;
	inputs: Record<string, { nick: string; description?: string }>;
	outputs: Record<string, { nick: string; description?: string }>;
}

function ComponentCard({ component }: { component: ParsedComponent }) {
	const inputs = Object.values(component.inputs);
	const outputs = Object.values(component.outputs);

	return (
		<div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
			<h3 className="mb-1 text-lg font-semibold text-white">
				{component.nickName}
			</h3>
			{component.type && (
				<p className="mb-2 text-sm text-neutral-400">Type: {component.type}</p>
			)}
			{component.description && (
				<p className="mb-3 text-sm text-neutral-300">{component.description}</p>
			)}

			{inputs.length > 0 && (
				<div className="mb-2">
					<p className="mb-1 text-xs font-medium text-neutral-500 uppercase">
						Inputs
					</p>
					<div className="space-y-1">
						{inputs.map((input, idx) => (
							<div key={idx} className="flex gap-2 text-sm">
								<span className="text-blue-400">{input.nick}</span>
								{input.description && (
									<span className="text-neutral-400">
										- {input.description}
									</span>
								)}
							</div>
						))}
					</div>
				</div>
			)}

			{outputs.length > 0 && (
				<div>
					<p className="mb-1 text-xs font-medium text-neutral-500 uppercase">
						Outputs
					</p>
					<div className="space-y-1">
						{outputs.map((output, idx) => (
							<div key={idx} className="flex gap-2 text-sm">
								<span className="text-green-400">{output.nick}</span>
								{output.description && (
									<span className="text-neutral-400">
										- {output.description}
									</span>
								)}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

export default function DuckerWebPage() {
	const [xmlData, setXmlData] = useState<string | undefined>();
	const [isValidXml, setIsValidXml] = useState(false);
	const [xmlError, setXmlError] = useState("");
	const [parsedData, setParsedData] = useState<ParsedGrasshopper | null>(null);
	const [isCopied, setIsCopied] = useState(false);

	const handlePasteFromClipboard = async () => {
		setXmlError("");
		setXmlData("");
		setIsValidXml(false);

		try {
			const text = await navigator.clipboard.readText();
			if (text.length === 0) {
				setXmlError("Clipboard is empty");
				return;
			}

			const { isValid, errorMsg } = validateGhXml(text);

			if (isValid) {
				setIsValidXml(true);
				setXmlData(text);
			} else {
				setIsValidXml(false);
				setXmlError("Pasted GhXml is not valid: \n" + errorMsg);
			}
		} catch (err) {
			setXmlError("Failed to read clipboard contents: \n" + String(err));
		}
	};

	const handleClear = () => {
		setXmlData(undefined);
		setXmlError("");
		setIsValidXml(false);
		setParsedData(null);
	};

	const handleParse = () => {
		setError("");
		setParsedData(null);

		if (!xmlData?.trim()) {
			setError("Please paste some GH XML first");
			return;
		}

		try {
			const result = buildGhJson(xmlData, { includeVisuals: false });
			setParsedData(result);
		} catch (e) {
			setError(
				`Failed to parse XML: ${e instanceof Error ? e.message : "Unknown error"}`
			);
		}
	};

	const handleCopyAll = () => {
		if (!parsedData) return;

		const components = Object.values(parsedData.components);
		let text = "";

		for (const comp of components) {
			text += `## ${comp.nickName}\n`;
			text += `Type: ${comp.type}\n`;
			if (comp.description) {
				text += `${comp.description}\n`;
			}

			const inputs = Object.values(comp.inputs);
			if (inputs.length > 0) {
				text += `\nInputs:\n`;
				for (const input of inputs) {
					text += `- ${input.nick}`;
					if (input.description) {
						text += `: ${input.description}`;
					}
					text += `\n`;
				}
			}

			const outputs = Object.values(comp.outputs);
			if (outputs.length > 0) {
				text += `\nOutputs:\n`;
				for (const output of outputs) {
					text += `- ${output.nick}`;
					if (output.description) {
						text += `: ${output.description}`;
					}
					text += `\n`;
				}
			}

			text += "\n---\n\n";
		}

		navigator.clipboard.writeText(text).then(() => {
			setIsCopied(true);
			setTimeout(() => setIsCopied(false), 2000);
		});
	};

	const [error, setError] = useState("");

	const components: ParsedComponent[] = parsedData
		? Object.values(parsedData.components).map((c) => ({
			id: c.id,
			type: c.type,
			nickName: c.nickName,
			description: c.description,
			inputs: c.inputs,
			outputs: c.outputs,
		}))
		: [];

	return (
		<div className="min-h-screen bg-black p-4 font-sans text-white md:p-6">
			<div className="mx-auto max-w-4xl">
				<header className="mb-8 flex w-full items-center justify-between">
					<div>
						<Link className="text-2xl font-bold md:text-4xl" href="/">
							Hopper Clip
						</Link>
						<h1 className="mt-2 text-xl font-semibold text-neutral-300">
							DuckerWeb
						</h1>
					</div>
					<a
						href="https://github.com/mcneel/ducker"
						target="_blank"
						rel="noopener noreferrer"
						className="rounded-full border border-white px-4 py-2 text-sm font-medium transition-colors hover:bg-neutral-800"
					>
						GitHub Repo
					</a>
				</header>

				<div className="mb-6 rounded-lg border border-neutral-800 bg-neutral-900 p-4">
					<p className="mb-4 text-neutral-300">
						I saw the LinkedIn post about Ducker and figured: why wrestle with
						installers when the duck can live in a browser? So here’s the same
						nifty trick—no downloads, no version headaches. Ducker is a nifty
						little tool for Grasshopper developers to automatically extract
						names, descriptions and icons from their plugins and place it in
						text files. It's completely free and open source and can be useful
						e.g. if you want to create a reference document of all components
						included in your plugin.
					</p>
					<p className="text-neutral-400">
						Paste your GH XML below to extract component documentation. You can
						get this by selecting components in Grasshopper and copying to
						clipboard (Ctrl+C).
					</p>
				</div>

				<div className="mb-6">
					{xmlData ? (
						<div className="space-y-2">
							{isValidXml ? (
								<div className="flex flex-row items-center gap-x-2">
									<button
										className="flex flex-row items-center gap-x-1 text-sm text-red-500 hover:cursor-pointer"
										onClick={handleClear}
									>
										Delete pasted GhXml
										<X size={16} />
									</button>
									<span className="text-sm font-bold text-green-600 hover:cursor-default">
										✓ GhXml validated
									</span>
								</div>
							) : (
								<div className="flex flex-row items-center gap-x-2">
									<button
										className="flex flex-row items-center gap-x-1 text-sm text-red-500"
										onClick={handleClear}
									>
										Delete invalid GhXml
										<X size={16} />
									</button>
								</div>
							)}
						</div>
					) : (
						<button
							type="button"
							onClick={handlePasteFromClipboard}
							className="animate border-input rounded-md border bg-neutral-100 p-2 font-medium text-neutral-500 shadow-xs transition-all hover:text-neutral-700"
						>
							<PasteGhXmlFromClipboard />
						</button>
					)}
					{xmlError.length > 0 && (
						<div className="mt-2 text-sm font-bold text-red-500">
							{xmlError}
						</div>
					)}
				</div>

				<div className="mb-6 flex gap-4">
					<button
						onClick={handleParse}
						disabled={!isValidXml}
						className="rounded-lg bg-white px-6 py-2 font-semibold text-black transition-colors hover:bg-neutral-200 disabled:opacity-50"
					>
						Parse XML
					</button>
					{parsedData && (
						<button
							onClick={handleCopyAll}
							className="rounded-lg border border-white px-6 py-2 font-semibold text-white transition-colors hover:bg-neutral-800"
						>
							{isCopied ? "Copied!" : "Copy All as Markdown"}
						</button>
					)}
				</div>

				{error && <p className="mb-4 text-red-400">{error}</p>}

				{parsedData && (
					<div>
						<p className="mb-4 text-neutral-400">
							Found {components.length} component(s)
						</p>
						<div className="grid gap-4 md:grid-cols-2">
							{components.map((comp) => (
								<ComponentCard key={comp.id} component={comp} />
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

function PasteGhXmlFromClipboard() {
	return (
		<div className="flex items-center gap-2">
			<Clipboard className="h-4 w-4" />
			Paste GhXml from Clipboard
		</div>
	);
}
