import fs from "fs";
import path from "path";
import YAML from "yaml";

interface AppConfig {
  App: {
    port: number;
  };
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    dbname: string;
  };
  jwt: {
    access_token: string;
    refresh_token: string;
  };
}

const configPath = path.resolve(__dirname, "../../../config.yaml");
const file = fs.readFileSync(configPath, "utf8");

export const config: AppConfig = YAML.parse(file);

export function getDatabaseUrl(): string {
  const db = config.database;
  return `postgresql://${db.username}:${db.password}@${db.host}:${db.port}/${db.dbname}`;
}
