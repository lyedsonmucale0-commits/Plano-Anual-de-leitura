// netlify/functions/download.js

export async function handler(event, context) {
  try {
    // Pega o nome do app da query string: ?app=HolyPlay
    const appName = event.queryStringParameters?.app;
    if (!appName) {
      return {
        statusCode: 400,
        body: "Parâmetro 'app' é necessário"
      };
    }

    // Mapeamento dos APKs
    const apps = {
      "HolyPlay": "https://github.com/lyedsonmucale0-commits/NosPlayAPK/releases/download/V1.2/HolyPlay.apk"
      // Se tiver outros apps, adicione aqui
    };

    const url = apps[appName];
    if (!url) {
      return {
        statusCode: 404,
        body: "App não encontrado"
      };
    }

    // Faz fetch do arquivo
    const res = await fetch(url);
    if (!res.ok) throw new Error("Erro ao baixar o arquivo");

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/vnd.android.package-archive",
        "Content-Disposition": `attachment; filename="${appName}.apk"`
      },
      body: buffer.toString("base64"),
      isBase64Encoded: true
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: "Erro interno: " + err.message
    };
  }
      }
