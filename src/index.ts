import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { drills, history } from "./../db/schema";
import { eq, sql, and } from "drizzle-orm";
import { cors } from 'hono/cors';
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { CORS_ORIGIN } from "./const";
import { HistoryEntry } from './types'

type Bindings = {
	DB: D1Database;
	CLERK_PUBLISHABLE_KEY: string;
	CLERK_SECRET_KEY: string;
	CORS_ORIGIN: string;
};

const app = new Hono<{ Bindings: Bindings }>().basePath("/api");

// origin ドメインを明示的に示すもの。はずすとCORSエラーになる。
app.use('*', async (c, next) => {
	const corsMiddlewareHandler = cors({
		origin: c.env.CORS_ORIGIN,
	})
	return corsMiddlewareHandler(c, next)
})

app.options('*', (c) => {
	return new Response(null, { status: 204 });
})

app.use('/api/*', cors({
	origin: [CORS_ORIGIN], // Reactアプリのオリジン
	allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'],
	exposeHeaders: [],
	maxAge: 600,// preflight requestのキャッシュ時間	
	credentials: true,
}));

app.use('*', clerkMiddleware())

// drills api
app.get("/drills", async (c) => {
	const auth = getAuth(c)
	if (!auth?.userId) {
		return c.json({
			message: 'You are not logged in.',
		})
	}
	try {
		const db = drizzle(c.env.DB);
		const results = await db.select().from(drills).where(eq(drills.userId, auth.userId));;
		return c.json(results);
	} catch (e) {
		return c.json({ err: e }, 500);
	}
});

// -- 現時点では、個別drillのgetは使用していない。　-- 
// app.get("/drills/:id", async (c) => {
// 	const id = parseInt(c.req.param("id"));
// 	const auth = getAuth(c)
// 	if (!auth?.userId) {
// 		return c.json({
// 			message: 'You are not logged in.',
// 		})
// 	}
// 	try {
// 		const db = drizzle(c.env.DB);
// 		const results = await db.select().from(drills).where(and(
// 			eq(drills.id, id),
// 			eq(drills.userId, auth.userId)
// 		  ))
// 		  .limit(1);

// 		  if (results.length === 0) {
// 			return c.json({ message: 'Drill not found or you do not have permission to access it.' }, 404);
// 		  }

// 		return c.json(results[0]);
// 	} catch (e) {
// 		return c.json({ err: e }, 500);
// 	}
// });

app.post("/drills", async (c) => {
	const auth = getAuth(c)
	if (!auth?.userId) {
		return c.json({
			message: 'You are not logged in.',
		})
	}
	const drillFromClient = await c.req.json<typeof drills.$inferInsert>()
	try {
		const db = drizzle(c.env.DB);
		const drillToInsert = {
			...drillFromClient,
			userId: auth.userId // userIdを追加
		};
		const [insertedDrill] = await db.insert(drills).values(drillToInsert).returning();

		// JSON形式でレスポンスを返す
		return new Response(JSON.stringify(insertedDrill), {
			status: 201,
			headers: {
				'Content-Type': 'application/json'
			}
		});

		// 以下だと、追加したdrillが、即座に画面に追加表示されない。
		// return c.json({ 
		// 	message: "Drill created successfully",
		// 	drill: insertedDrill
		//   }, 201);
	} catch (e: any) {
		console.error('Error inserting drill:', e);
		return c.json({ error: 'An error occurred while creating the drill' }, 500);
	}
});


app.put("/drills/:id", async (c) => {
	const auth = getAuth(c)
	if (!auth?.userId) {
		return c.json({
			message: 'You are not logged in.',
		})
	}
	const id = parseInt(c.req.param("id"));
	const { url, content, status, columnId } = await c.req.json<Partial<typeof drills.$inferInsert>>()

	try {
		const db = drizzle(c.env.DB);

		const [updatedDrill] = await db.update(drills)
			.set({ url, content, status, columnId })
			.where(and(
				eq(drills.id, id),
				eq(drills.userId, auth.userId)
			))
			.returning();

		if (!updatedDrill) {
			return c.json({
				message: 'Drill not found or you do not have permission to update it.',
			}, 404);
		}

		return c.json(updatedDrill, 200);
	} catch (e: any) {
		console.error('Error updating drill:', e);
		return c.json({ error: e.message, stack: e.stack }, 500);
	}
});

app.delete("/drills/:id", async (c) => {
	const auth = getAuth(c)
	if (!auth?.userId) {
		return c.json({
			message: 'You are not logged in.',
		})
	}
	const id = parseInt(c.req.param("id"));
	try {
		const db = drizzle(c.env.DB);
		const [deletedDrill] = await db.delete(drills)
			.where(and(
				eq(drills.id, id),
				eq(drills.userId, auth.userId)
			))
			.returning();

		if (!deletedDrill) {
			return c.json({
				message: 'Drill not found or you do not have permission to delete it.',
			}, 404);
		}
		return c.json({ message: "success" }, 200);
	} catch (e) {
		return c.json({ err: e }, 500);
	}
});

// history 用 api
app.get("/history", async (c) => {
	const auth = getAuth(c)
	if (!auth?.userId) {
		return c.json({
			message: 'You are not logged in.',
		})
	}
	try {
		const db = drizzle(c.env.DB);
		const results = await db.select()
			.from(history)
			.where(eq(history.userId, auth.userId))
			.orderBy(sql`${history.createdAt} DESC`) as HistoryEntry[];

		if (results.length === 0) {
			return c.json({
				message: 'No history found for this user.',
			}, 204);
		}

		return c.json(results);
	} catch (e) {
		console.error('Error fetching history:', e);
		return c.json({
			error: 'An error occurred while fetching the history',
		}, 500);
	}
});

app.post("/history", async (c) => {
	const auth = getAuth(c)
	if (!auth?.userId) {
		return c.json({
			message: 'You are not logged in.',
		}, 401)
	}

	try {
		const { memo, drillItemsChecked } = await c.req.json();

		console.log("Received data:", { memo, drillItemsChecked });
		const drillItemsCheckedArray = drillItemsChecked.map((item: { content: string }) => item.content);
		const db = drizzle(c.env.DB);
		const newHistoryEntry = {
			userId: auth.userId,
			memo,
			drills: JSON.stringify(drillItemsCheckedArray),
			createdAt: new Date().toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })
		};

		const [insertedEntry] = await db.insert(history).values(newHistoryEntry).returning();

		return c.json({
			message: "History entry created successfully",
			entry: insertedEntry
		}, 201);
	} catch (e) {
		console.error('Error creating history entry:', e);
		return c.json({ error: 'Internal Server Error' }, 500);
	}
});




export default app;
