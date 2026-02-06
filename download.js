import fetch from "node-fetch";

export async function handler(event, context) {
  const referer = event.headers.referer || "";
  if (!referer.includes("seusite.netlify.app")) {
    return { statusCode: 403, body: "Acesso negado!" };
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const OWNER = "SEU-USUARIO";
  const REPO = "repo-de-releases";
  const FILE_NAME = event.queryStringParameters?.file || "App.apk";

  // Pega a última release
  const releaseRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/releases/latest`, {
    headers: { Authorization: `token ${GITHUB_TOKEN}` }
  });
  const releaseData = await releaseRes.json();

  // Procura o arquivo na release
  const asset = releaseData.assets.find(a => a.name === FILE_NAME);
  if (!asset) return { statusCode: 404, body: "Arquivo não encontrado" };

  const apkRes = await fetch(asset.browser_download_url, {
    headers: { Authorization: `token ${GITHUB_TOKEN}` }
  });
  const apkBuffer = await apkRes.arrayBuffer();

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/vnd.android.package-archive",
      "Content-Disposition": `attachment; filename=${FILE_NAME}`
    },
    body: Buffer.from(apkBuffer).toString("base64"),
    isBase64Encoded: true
  };
}