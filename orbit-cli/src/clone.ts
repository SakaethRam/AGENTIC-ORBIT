import fs from "node:fs/promises";
import path from "node:path";

const API =
  process.env.ORBIT_API_URL ||
  "https://YOUR-ORBIT-BACKEND.onrender.com/api/orbit";

export async function cloneProject(
  projectName: string,
  directory?: string
) {
  const response = await fetch(
    `${API}/projects/${encodeURIComponent(projectName)}`
  );

  if (!response.ok) {
    throw new Error(
      `ORBIT project "${projectName}" was not found.`
    );
  }

  const {
    project,
    files,
  } = await response.json();

  const target =
    directory || project.slug;

  const root = path.resolve(
    process.cwd(),
    target
  );

  console.log("");
  console.log("ORBIT");
  console.log("");
  console.log(
    `Cloning into '${target}'...`
  );
  console.log("");

  await fs.mkdir(root, {
    recursive: true,
  });

  for (const file of files) {
    const relative = file.path
      .replace(/\\/g, "/")
      .replace(/^\/+/, "");

    if (
      relative.includes("..") ||
      relative.includes("\0")
    ) {
      throw new Error(
        `Unsafe file path: ${file.path}`
      );
    }

    const destination = path.resolve(
      root,
      relative
    );

    if (
      !destination.startsWith(
        root + path.sep
      )
    ) {
      throw new Error(
        `Unsafe file path: ${file.path}`
      );
    }

    await fs.mkdir(
      path.dirname(destination),
      { recursive: true }
    );

    await fs.writeFile(
      destination,
      file.content,
      "utf8"
    );
  }

  console.log(
    `✓ ${files.length} files received`
  );

  console.log(
    "✓ Project files written"
  );

  console.log("");
  console.log(
    "✓ ORBIT clone complete"
  );

  console.log("");
  console.log(
    `Location: ${root}`
  );

  console.log("");
}