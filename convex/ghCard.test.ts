import { describe, test, expect, vi, beforeEach } from "vitest";

// Capture the handler registered by query() so we can call it directly
let capturedGetUserTagsHandler: ((ctx: unknown, args: unknown) => unknown) | null = null;

vi.mock("./_generated/server", () => ({
	query: (config: { handler: (ctx: unknown, args: unknown) => unknown }) => {
		// Each call to query() captures the handler. getUserTags is the 2nd query defined.
		// We use a flag approach: the module is evaluated once, capturing all handlers in order.
		// Store all handlers by order and identify getUserTags by checking the handler index.
		return { _handler: config.handler };
	},
	mutation: (config: { handler: (ctx: unknown, args: unknown) => unknown }) => {
		return { _handler: config.handler };
	},
	internalQuery: (config: { handler: (ctx: unknown, args: unknown) => unknown }) => {
		return { _handler: config.handler };
	},
	internalMutation: (config: { handler: (ctx: unknown, args: unknown) => unknown }) => {
		return { _handler: config.handler };
	},
}));

vi.mock("convex/values", () => ({
	v: {
		string: () => ({}),
		number: () => ({}),
		boolean: () => ({}),
		array: () => ({}),
		optional: () => ({}),
		id: () => ({}),
		object: () => ({}),
		union: () => ({}),
		null: () => ({}),
	},
}));

vi.mock("../src/utils/generage-shareable-link-uid", () => ({
	generateSharableLinkUid: () => "test-uid-12345",
}));

vi.mock("../src/types/types", () => ({
	UserTag: {},
	SortOrder: {},
}));

// Import after mocks are set up
const { getUserTags } = await import("./ghCard");

// Helper to get the handler from a query/mutation export
function getHandler(exported: unknown): (ctx: unknown, args: unknown) => unknown {
	return (exported as { _handler: (ctx: unknown, args: unknown) => unknown })._handler;
}

// ---------- Mock ctx factory ----------

interface MockPost {
	tags?: string[];
	clerkUserId?: string;
}

function makeMockCtx({
	identity = { id: "user-123" } as { id: string } | null,
	posts = [] as MockPost[],
	dbError = null as Error | null,
	authError = null as Error | null,
} = {}) {
	const collectFn = dbError
		? vi.fn().mockRejectedValue(dbError)
		: vi.fn().mockResolvedValue(posts);

	const withIndexFn = vi.fn().mockReturnValue({ collect: collectFn });
	const queryFn = vi.fn().mockReturnValue({ withIndex: withIndexFn });

	const getUserIdentityFn = authError
		? vi.fn().mockRejectedValue(authError)
		: vi.fn().mockResolvedValue(identity);

	return {
		auth: {
			getUserIdentity: getUserIdentityFn,
		},
		db: {
			query: queryFn,
		},
		_internals: { queryFn, withIndexFn, collectFn, getUserIdentityFn },
	};
}

// ---------- Tests ----------

describe("getUserTags handler", () => {
	let handler: (ctx: unknown, args: unknown) => unknown;

	beforeEach(() => {
		vi.clearAllMocks();
		handler = getHandler(getUserTags);
	});

	// --- Authentication checks (new identity.id check added in this PR) ---

	test("throws 'Not authenticated' when identity is null", async () => {
		const ctx = makeMockCtx({ identity: null });
		await expect(handler(ctx, {})).rejects.toThrow("Not authenticated");
	});

	test("throws 'User identity missing id' when identity.id is falsy (empty string)", async () => {
		const ctx = makeMockCtx({ identity: { id: "" } });
		await expect(handler(ctx, {})).rejects.toThrow("User identity missing id");
	});

	test("throws 'User identity missing id' when identity.id is undefined", async () => {
		const ctx = makeMockCtx({ identity: { id: undefined as unknown as string } });
		await expect(handler(ctx, {})).rejects.toThrow("User identity missing id");
	});

	// --- try/catch behavior (added in this PR) ---

	test("logs error and re-throws when identity is null", async () => {
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		const ctx = makeMockCtx({ identity: null });
		await expect(handler(ctx, {})).rejects.toThrow("Not authenticated");
		expect(consoleSpy).toHaveBeenCalledOnce();
		expect(consoleSpy).toHaveBeenCalledWith(
			"getUserTags error:",
			expect.any(Error)
		);
		consoleSpy.mockRestore();
	});

	test("logs error and re-throws when db.query throws", async () => {
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		const dbErr = new Error("Database connection failed");
		const ctx = makeMockCtx({ dbError: dbErr });
		await expect(handler(ctx, {})).rejects.toThrow("Database connection failed");
		expect(consoleSpy).toHaveBeenCalledOnce();
		expect(consoleSpy).toHaveBeenCalledWith("getUserTags error:", dbErr);
		consoleSpy.mockRestore();
	});

	test("logs error and re-throws when auth.getUserIdentity throws", async () => {
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		const authErr = new Error("Auth service unavailable");
		const ctx = makeMockCtx({ authError: authErr });
		await expect(handler(ctx, {})).rejects.toThrow("Auth service unavailable");
		expect(consoleSpy).toHaveBeenCalledOnce();
		expect(consoleSpy).toHaveBeenCalledWith("getUserTags error:", authErr);
		consoleSpy.mockRestore();
	});

	test("re-throws the exact same error instance caught by the try/catch", async () => {
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		const dbErr = new Error("exact error");
		const ctx = makeMockCtx({ dbError: dbErr });
		let thrown: unknown;
		try {
			await handler(ctx, {});
		} catch (e) {
			thrown = e;
		}
		expect(thrown).toBe(dbErr);
		consoleSpy.mockRestore();
	});

	// --- Happy path: tag counting ---

	test("returns empty array when user has no posts", async () => {
		const ctx = makeMockCtx({ posts: [] });
		const result = await handler(ctx, {});
		expect(result).toEqual([]);
	});

	test("returns empty array when user has posts with no tags", async () => {
		const ctx = makeMockCtx({ posts: [{ tags: undefined }, { tags: [] }] });
		const result = await handler(ctx, {});
		expect(result).toEqual([]);
	});

	test("counts tags from a single post correctly", async () => {
		const ctx = makeMockCtx({
			posts: [{ tags: ["typescript", "react", "typescript"] }],
		});
		const result = await handler(ctx, {});
		expect(result).toEqual(
			expect.arrayContaining([
				{ tag: "react", count: 1 },
				{ tag: "typescript", count: 2 },
			])
		);
		expect((result as unknown[]).length).toBe(2);
	});

	test("counts tags across multiple posts", async () => {
		const ctx = makeMockCtx({
			posts: [
				{ tags: ["a", "b"] },
				{ tags: ["b", "c"] },
				{ tags: ["a", "b", "c"] },
			],
		});
		const result = await handler(ctx, {});
		expect(result).toEqual(
			expect.arrayContaining([
				{ tag: "a", count: 2 },
				{ tag: "b", count: 3 },
				{ tag: "c", count: 2 },
			])
		);
	});

	test("handles posts where some have tags and some do not", async () => {
		const ctx = makeMockCtx({
			posts: [{ tags: ["x"] }, { tags: undefined }, { tags: ["x", "y"] }],
		});
		const result = await handler(ctx, {});
		expect(result).toEqual(
			expect.arrayContaining([
				{ tag: "x", count: 2 },
				{ tag: "y", count: 1 },
			])
		);
	});

	// --- Happy path: alphabetical sorting (preserved in this PR) ---

	test("returns tags sorted alphabetically ascending", async () => {
		const ctx = makeMockCtx({
			posts: [{ tags: ["zebra", "apple", "mango", "banana"] }],
		});
		const result = (await handler(ctx, {})) as { tag: string; count: number }[];
		const tags = result.map((ut) => ut.tag);
		expect(tags).toEqual(["apple", "banana", "mango", "zebra"]);
	});

	test("sorting is case-sensitive (uppercase before lowercase per JS string comparison)", async () => {
		const ctx = makeMockCtx({
			posts: [{ tags: ["b", "A", "a", "B"] }],
		});
		const result = (await handler(ctx, {})) as { tag: string; count: number }[];
		const tags = result.map((ut) => ut.tag);
		// JS string comparison: uppercase letters have lower char codes than lowercase
		expect(tags).toEqual(["A", "B", "a", "b"]);
	});

	// --- Return shape ---

	test("returns UserTag objects with tag and count properties", async () => {
		const ctx = makeMockCtx({ posts: [{ tags: ["typescript"] }] });
		const result = (await handler(ctx, {})) as { tag: string; count: number }[];
		expect(result[0]).toHaveProperty("tag");
		expect(result[0]).toHaveProperty("count");
		expect(typeof result[0].tag).toBe("string");
		expect(typeof result[0].count).toBe("number");
	});

	// --- DB query is called with correct arguments ---

	test("queries the 'post' table using by_clerkUserId index with the user's id", async () => {
		const ctx = makeMockCtx({ posts: [] });
		await handler(ctx, {});
		const { queryFn, withIndexFn } = (ctx as ReturnType<typeof makeMockCtx>)._internals;
		expect(queryFn).toHaveBeenCalledWith("post");
		expect(withIndexFn).toHaveBeenCalledWith("by_clerkUserId", expect.any(Function));
	});

	// --- No console.error on success ---

	test("does not log to console.error on successful execution", async () => {
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		const ctx = makeMockCtx({ posts: [{ tags: ["go"] }] });
		await handler(ctx, {});
		expect(consoleSpy).not.toHaveBeenCalled();
		consoleSpy.mockRestore();
	});

	// --- Regression: count of 1 for each unique tag in a single-post scenario ---

	test("regression: single occurrence of each tag yields count of 1", async () => {
		const ctx = makeMockCtx({
			posts: [{ tags: ["one", "two", "three"] }],
		});
		const result = (await handler(ctx, {})) as { tag: string; count: number }[];
		for (const ut of result) {
			expect(ut.count).toBe(1);
		}
	});
});