import YAML from "yaml";

const TESIS_URL =
  "https://raw.githubusercontent.com/disenoUDP/coleccion-tesis-interaccion-digital/main/tesis.yaml";

export default async function () {
  try {
    const response = await fetch(TESIS_URL);
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    const contents = await response.text();
    return YAML.parse(contents) || [];
  } catch (error) {
    console.warn(`No se pudo obtener tesis.yaml desde ${TESIS_URL}:`, error.message);
    return [];
  }
}
