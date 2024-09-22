import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { drills } from "./../db/schema";
import { eq } from "drizzle-orm";
import { cors } from 'hono/cors';

type Bindings = {
	DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>().basePath("/api");

// app.use('/api/*', cors({
// 	origin: ['http://localhost:5173'], // Reactアプリのオリジン
// 	allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// 	allowHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'],
// 	exposeHeaders: ['Content-Length'],
// 	maxAge: 0,// preflight requestのキャッシュ時間	
// 	credentials: true,
// }));


app.options('*', (c) => {
	return new Response(null, { status: 204 });
})

app.get("/drills/:id", async (c) => {
    const id = parseInt(c.req.param("id"));
    try {
        const db = drizzle(c.env.DB);
        const results = await db.select().from(drills).where(eq(drills.id, id));
        return c.json(results);
    } catch (e) {
        return c.json({ err: e }, 500);
    }
});

app.get("/drills", async (c) => {
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
