import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, gameSessions } from "@workspace/db";
import { createSoloSave, loadSave } from "../lib/saves.js";

const router: IRouter = Router();

router.post("/saves/solo", async (req, res) => {
  const sessionId = typeof req.body?.sessionId === "string" ? req.body.sessionId.trim() : "";
  if (!sessionId) {
    return res.status(400).json({ error: "sessionId required" });
  }
  const rows = await db
    .select({ id: gameSessions.sessionId })
    .from(gameSessions)
    .where(eq(gameSessions.sessionId, sessionId))
    .limit(1);
  if (rows.length === 0) {
    return res.status(404).json({ error: "Session not found" });
  }
  const code = createSoloSave(sessionId);
  return res.json({ code });
});

router.post("/saves/load", (req, res) => {
  const code = typeof req.body?.code === "string" ? req.body.code.trim().toUpperCase() : "";
  if (!code) {
    return res.status(400).json({ error: "code required" });
  }
  const result = loadSave(code);
  if (!result) {
    return res.status(404).json({ error: "Save code not found" });
  }
  return res.json(result);
});

export default router;
