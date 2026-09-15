import { Router } from "express";
import { getSupabaseClient } from "../services/supabase";

const router = Router();

router.post("/projects", async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(500).json({ error: "Database is not configured" });
    }

    const {
      name,
      sessionId,
      command,
      files,
    } = req.body;

    if (!name || !sessionId || !command || !Array.isArray(files)) {
      return res.status(400).json({
        error: "name, sessionId, command and files are required",
      });
    }

    const slug = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const { data: existing } = await supabase
      .from("orbit_projects")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    const revision = existing
      ? existing.current_revision + 1
      : 1;

    let project;

    if (existing) {
      const { data, error } = await supabase
        .from("orbit_projects")
        .update({
          current_revision: revision,
          command,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;

      project = data;
    } else {
      const { data, error } = await supabase
        .from("orbit_projects")
        .insert({
          name: name.trim(),
          slug,
          session_id: sessionId,
          command,
          current_revision: 1,
        })
        .select()
        .single();

      if (error) throw error;

      project = data;
    }

    const fileMap = new Map<string, string>();

    for (const file of files) {
      if (file?.path && typeof file.content === "string") {
        fileMap.set(
          file.path.replace(/\\/g, "/"),
          file.content
        );
      }
    }

    const rows = [...fileMap.entries()].map(
      ([path, content]) => ({
        project_id: project.id,
        revision,
        path,
        content,
      })
    );

    if (rows.length) {
      const { error } = await supabase
        .from("orbit_project_files")
        .insert(rows);

      if (error) throw error;
    }

    res.status(201).json({
      project,
      revision,
    });
  } catch (error) {
    console.error("[ORBIT PROJECT]", error);

    res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Failed to save ORBIT project",
    });
  }
});

router.get("/projects/:name", async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(500).json({ error: "Database is not configured" });
    }

    const slug = req.params.name
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, "-");

    const { data: project, error } = await supabase
      .from("orbit_projects")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !project) {
      return res.status(404).json({
        error: "ORBIT project not found",
      });
    }

    const { data: files, error: filesError } =
      await supabase
        .from("orbit_project_files")
        .select("path, content")
        .eq("project_id", project.id)
        .eq("revision", project.current_revision)
        .order("path");

    if (filesError) throw filesError;

    res.json({
      project,
      files: files || [],
    });
  } catch (error) {
    res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Failed to retrieve project",
    });
  }
});

export default router;