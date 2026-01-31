"use server";
import { r2Client } from "./bucket";
import { env } from "@/env";
import { auth, currentUser } from "@clerk/nextjs/server";

const bucketUrl = (userId: string, bucketKey: string) =>
	`${env.R2_URL}/${userId}/${bucketKey}`;

export const uploadToBucket = async (
	nanoId: string,
	ghXmlZipped: Uint8Array
) => {
	const { isAuthenticated } = await auth();
	const user = await currentUser();

	if (!isAuthenticated) {
		throw new Error("You must be signed in to use this feature");
	}
	const userId = user?.id as string;

	await r2Client.fetch(
		new Request(bucketUrl(userId, nanoId), {
			method: "PUT",
			body: ghXmlZipped as any,
			headers: {
				"content-encoding": "gzip",
				"content-type": "application/gzip",
			},
		})
	);
};

export const deleteFromBucket = async (nanoId: string) => {
	const { isAuthenticated } = await auth();
	const user = await currentUser();

	if (!isAuthenticated) {
		throw new Error("You must be signed in to use this feature");
	}
	const userId = user?.id as string;
	await r2Client.fetch(
		new Request(bucketUrl(userId, nanoId), {
			method: "DELETE",
		})
	);
};

export const generatePresigneDownloadUrl = async (nanoId: string) => {
	const { isAuthenticated } = await auth();
	const user = await currentUser();

	if (!isAuthenticated) {
		throw new Error("You must be signed in to use this feature");
	}
	const userId = user?.id as string;
	const presigned = await r2Client.sign(
		new Request(bucketUrl(userId, nanoId), {
			method: "GET",
		}),
		{
			aws: { signQuery: true },
			headers: {
				"Content-Encoding": "gzip",
				"Content-Type": "application/gzip",
			},
		}
	);
	if (!presigned) {
		throw new Error("Failed to generate download url");
	}
	return presigned.url;
};
