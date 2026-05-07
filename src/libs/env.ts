import { cleanEnv, num, str } from 'envalid';

export const ENV = cleanEnv(Object.assign({}, process.env), {
  HOST: str(),
  PORT: num(),
  RMQ_URL: str(),

  BOT_TOKEN: str(),
});
