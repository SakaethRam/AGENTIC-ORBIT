#!/usr/bin/env node

import { Command } from "commander";
import { cloneProject } from "./clone";

const program = new Command();

program
  .name("orbit")
  .description("ORBIT Agentic AI CLI")
  .version("1.0.0");

program
  .command("clone")
  .argument("<projectname>")
  .argument("[directory]")
  .action(async (projectName, directory) => {
    try {
      await cloneProject(
        projectName,
        directory
      );
    } catch (error) {
      console.error(
        `\n✗ ${
          error instanceof Error
            ? error.message
            : "Clone failed"
        }\n`
      );

      process.exitCode = 1;
    }
  });

program.parseAsync();