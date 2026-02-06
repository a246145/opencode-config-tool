import { Router, Request, Response } from 'express';
import { execFile } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as os from 'os';

const router = Router();
const execFileAsync = promisify(execFile);

const buildCommandEnv = (): NodeJS.ProcessEnv => {
  const env = { ...process.env };
  const extraPaths: string[] = [];

  // Add opencode's default installation path
  extraPaths.push(path.join(os.homedir(), '.opencode', 'bin'));

  if (process.platform === 'darwin') {
    extraPaths.push('/usr/local/bin', '/opt/homebrew/bin', '/opt/homebrew/sbin');
  }

  if (process.platform !== 'win32') {
    extraPaths.push(path.join(os.homedir(), '.local', 'bin'));
  }

  if (extraPaths.length > 0) {
    env.PATH = [env.PATH, ...extraPaths].filter(Boolean).join(path.delimiter);
  }

  return env;
};

type OpencodeCommand = {
  command: string;
  args: string[];
};

const buildOpencodeCommands = (args: string[]): OpencodeCommand[] => {
  const commands: OpencodeCommand[] = [
    { command: 'opencode', args },
  ];

  if (process.platform === 'win32') {
    commands.unshift({ command: 'opencode.exe', args });
    commands.push({ command: 'opencode.cmd', args });
    commands.push({ command: 'npx.cmd', args: ['opencode', ...args] });
  } else {
    commands.push({ command: 'npx', args: ['opencode', ...args] });
  }

  return commands;
};

async function runOpencodeModels(provider?: string): Promise<string> {
  const args = ['models', ...(provider ? [provider] : [])];
  const commands = buildOpencodeCommands(args);
  let lastError: unknown = null;

  for (const { command, args: cmdArgs } of commands) {
    try {
      const result = await execFileAsync(command, cmdArgs, {
        timeout: 15000,
        maxBuffer: 1024 * 1024,
        env: buildCommandEnv(),
      });
      return result.stdout || '';
    } catch (error) {
      lastError = error;
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        continue;
      }
      throw error;
    }
  }

  if (lastError) {
    throw lastError;
  }
  throw new Error('opencode command not found');
}

/**
 * GET /api/models?provider=xxx
 * 读取 opencode models 输出
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const provider = req.query.provider as string | undefined;
    const output = await runOpencodeModels(provider);
    res.json({ output });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to run opencode models',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
