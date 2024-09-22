import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { drills } from "./../db/schema";
import { eq } from "drizzle-orm";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { bearerAuth } from 'hono/bearer-auth';
import { clerkClient, createClerkClient } from '@clerk/clerk-sdk-node';
import { cors } from 'hono/cors';

type Bindings = {
	DB: D1Database;
	CLERK_PUBLISHABLE_KEY: string;
	CLERK_SECRET_KEY: string;
	CORS_ORIGIN:string;
};

const app = new Hono<{ Bindings: Bindings }>().basePath("/api");


app.use('*', async (c, next) => {
    const corsMiddlewareHandler = cors({
      origin: c.env.CORS_ORIGIN,
    })
    return corsMiddlewareHandler(c, next)
  })

app.use('/api/*', cors({
	origin: ['http://localhost:5173'], // Reactアプリのオリジン
	allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'],
	exposeHeaders: ['Content-Length'],
	maxAge: 0,// preflight requestのキャッシュ時間	
	credentials: true,
}));

// app.use('*', (c, next) => {
// 	c.header('Access-Control-Allow-Origin', '*')
// 	c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
// 	c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
// 	return next()
// })

app.options('*', (c) => {
	return new Response(null, { status: 204 });
})


app.use('*', clerkMiddleware())


// 公開エンドポイント
app.get("/public", (c) => c.text("This is a public endpoint"));

// 認証が必要なエンドポイント
app.get("/protected", async (c) => {

	const auth = getAuth(c)

	if (!auth?.userId) {
		return c.json({
			message: 'You are not logged in.',
		})
	}

	return c.json({
		message: 'You are logged in!',
		userId: auth.userId,
	})
});

app.get("/drills", async (c) => {

	const auth = getAuth(c)
	if (!auth?.userId) {
		return c.json({
			message: 'You are not logged in.',
		})
	}
	try {
		const db = drizzle(c.env.DB);
		const results = await db.select().from(drills);
		return c.json(results);
	} catch (e) {
		return c.json({ err: e }, 500);
	}
});

app.post("/drills", async (c) => {
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
	const id = parseInt(c.req.param("id"));
	try {
		const db = drizzle(c.env.DB);
		await db.delete(drills).where(eq(drills.id, id));
		return c.json({ message: "success" }, 200);
	} catch (e) {
		return c.json({ err: e }, 500);
	}
});



export default app;
