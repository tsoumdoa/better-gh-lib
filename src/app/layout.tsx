import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TRPCReactProvider } from "@/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";
import { PostHogProvider } from "./providers/PostHogProvider";
import ConvexClientProvider from "@/components/convex-client-provider";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "HopperClip",
	description: "Better way to share your GH script",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider>
			<html lang="en">
				<body
					className={`${geistSans.variable} ${geistMono.variable} antialiased`}
				>
					<PostHogProvider>
						<TRPCReactProvider>
							<ConvexClientProvider>{children}</ConvexClientProvider>
						</TRPCReactProvider>
					</PostHogProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
