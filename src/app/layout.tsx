"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { PostHogProvider } from "./providers/PostHogProvider";
import ConvexClientProvider from "@/components/convex-client-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
	return (
		<ClerkProvider>
			<html lang="en">
				<body
					className={`${geistSans.variable} ${geistMono.variable} antialiased`}
				>
					<PostHogProvider>
						<QueryClientProvider client={queryClient}>
							<ConvexClientProvider>{children}</ConvexClientProvider>
						</QueryClientProvider>
					</PostHogProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
