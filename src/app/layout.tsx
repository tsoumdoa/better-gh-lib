"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { PostHogProvider } from "./providers/PostHogProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const queryClient = new QueryClient();
	const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
	return (
		<ClerkProvider>
			<html lang="en">
				<body
					className={`${geistSans.variable} ${geistMono.variable} antialiased`}
				>
					<PostHogProvider>
						<QueryClientProvider client={queryClient}>
							<ConvexProviderWithClerk client={convex} useAuth={useAuth}>
								{children}
							</ConvexProviderWithClerk>
						</QueryClientProvider>
					</PostHogProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
