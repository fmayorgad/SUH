import { EasyconfigService } from "nestjs-easyconfig";

const config: EasyconfigService = new EasyconfigService({ path: ".env" });

const name = config.get("APP_NAME");
const version = config.get("APP_VERSION");

export const APP = {
	name: name,
	version: version,
	description: config.get("APP_DESCRIPTION"),
	appKeySpaces: config.get("APP_KEY_SPACES"),
	appSecretAccessKey: config.get("APP_SECRET_ACCESS_KEY"),
	port: Number.parseInt(config.get("APP_PORT"), 10),
	host: config.get("APP_HOST"),
	tokenSecret: config.get("APP_TOKEN_SECRET"),
	tokenAlgorithm: config.get("APP_TOKEN_ALGORITHM"),
	tokenExpiration: config.get("APP_TOKEN_EXPIRATION"),
	baseURL: `${name}/${version}`,
	rutaArchivos: config.get("APP_RUTA_FILES"),
};
