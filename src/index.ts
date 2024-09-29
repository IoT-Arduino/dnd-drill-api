import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { drills,history } from "./../db/schema";
import { eq, sql } from "drizzle-orm";
import { cors } from 'hono/cors';
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

type Bindings = {
	DB: D1Database;
	CLERK_PUBLISHABLE_KEY: string;
	CLERK_SECRET_KEY: string;
	CORS_ORIGIN:string;
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
	origin: ['http://localhost:5173'], // Reactアプリのオリジン
	allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'],
	exposeHeaders: [],
	maxAge: 600,// preflight requestのキャッシュ時間	
	credentials: true,
}));

app.use('*', clerkMiddleware())

app.get("/drills", async (c) => {
	const auth = getAuth(c)
	if (!auth?.userId) {
		return c.json({
			message: 'You are not logged in.',
		})
	}
	// console.log("userId",auth.userId)
	try {
		const db = drizzle(c.env.DB);
		const results = await db.select().from(drills);
		return c.json(results);
	} catch (e) {
		return c.json({ err: e }, 500);
	}
});

app.get("/drills/:id", async (c) => {
	const id = parseInt(c.req.param("id"));
	const auth = getAuth(c)
	if (!auth?.userId) {
		return c.json({
			message: 'You are not logged in.',
		})
	}
	try {
		const db = drizzle(c.env.DB);
		const results = await db.select().from(drills).where(eq(drills.id, id));;
		return c.json(results);
	} catch (e) {
		return c.json({ err: e }, 500);
	}
});

app.post("/drills", async (c) => {
	const auth = getAuth(c)
	if (!auth?.userId) {
		return c.json({
			message: 'You are not logged in.',
		})
	}
	const drill = await c.req.json<typeof drills.$inferInsert>()
	try {
		const db = drizzle(c.env.DB);
		await db.insert(drills).values(drill);
		return c.json({ message: "success" }, 201)
	} catch (e) {
		return c.json({ err: e }, 500);
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
	const { status, columnId, content } = await c.req.json<typeof drills.$inferInsert>()
	try {
		const db = drizzle(c.env.DB);
		await db.update(drills).set({ status, columnId, content }).where(eq(drills.id, id));
		return c.json({ message: "success" }, 201);
	} catch (e) {
		return c.json({ err: e }, 500);
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
		await db.delete(drills).where(eq(drills.id, id));
		return c.json({ message: "success" }, 200);
	} catch (e) {
		return c.json({ err: e }, 500);
	}
});

type HistoryEntry = {
	id: number;
	userId: string;
	memo: string;
	createdAt: string;
	drills: string;
  };
  
  type GroupedHistory = {
	[date: string]: HistoryEntry[];
  };

app.get("/history", async (c) => {
	const auth = getAuth(c)
	if (!auth?.userId) {
		return c.json({
			message: 'You are not logged in.',
		})
	}
	// console.log("userId",auth.userId)
	try {
		// co
		const db = drizzle(c.env.DB);
		const results = await db.select()
		  .from(history)
		  .orderBy(sql`${history.createdAt} DESC`) as HistoryEntry[];
	
		const groupedResults = results.reduce<GroupedHistory>((acc, item) => {
		  if (!acc[item.createdAt]) {
			acc[item.createdAt] = {
			  memo: item.memo,
			  userId: item.userId,
			  drills: JSON.parse(item.drills)
			};
		  }
		  return acc;
		}, {} )

		return c.json(results);
	} catch (e) {
		return c.json({ err: e }, 500);
	}
});







export default app;
