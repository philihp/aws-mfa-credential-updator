import { execa } from "execa";
import { Listr } from "listr2";
import dotenv from "dotenv";

dotenv.config();
const { AWS_USERNAME, AWS_ACCOUNT_NAME, AWS_ACCOUNT_ID } = process.env;

const tasks = new Listr(
  [
    {
      title: "Ask for 2FA token",
      task: async (ctx, task) => {
        ctx.token = await task.prompt({
          type: "input",
          message: `Authenticator Token (${AWS_USERNAME}@${AWS_ACCOUNT_NAME})`,
        });
        if (ctx.token === false) {
          throw new Error(":/");
        }
      },
    },
    {
      title: "Get session from AWS",
      task: async (ctx) => {
        const { exitCode, stdout } = await execa("aws", [
          "sts",
          "get-session-token",
          "--serial-number",
          `arn:aws:iam::${AWS_ACCOUNT_ID}:mfa/${AWS_USERNAME}`,
          "--token-code",
          ctx.token,
        ]);
        if (exitCode !== 0) {
          throw new Error(`aws exited with ${exitCode}`);
        }
        ctx.session = JSON.parse(stdout).Credentials;
      },
    },
    {
      title: "Save AccessKeyId",
      task: async (ctx) => {
        await execa("aws", [
          "configure",
          "set",
          "aws_access_key_id",
          ctx.session.AccessKeyId,
          "--profile",
          "mfa",
        ]);
      },
    },
    {
      title: "Save SecretAccessKey",
      task: async (ctx) => {
        await execa("aws", [
          "configure",
          "set",
          "aws_secret_access_key",
          ctx.session.SecretAccessKey,
          "--profile",
          "mfa",
        ]);
      },
    },
    {
      title: "Save SessionToken",
      task: async (ctx) => {
        await execa("aws", [
          "configure",
          "set",
          "aws_session_token",
          ctx.session.SessionToken,
          "--profile",
          "mfa",
        ]);
      },
    },
  ],
  { rendererOptions: { showTimer: true } }
);

try {
  await tasks.run();
} catch (e) {
  console.error(e);
}
