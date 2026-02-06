const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const fileName = event.queryStringParameters.file;

  // Link direto do seu GitHub Release
  const githubUrl = `https://github.com/lyedsonmucale0-commits/NosPlayAPK/releases/download/V1.2/${fileName}`;

  try {
    const response = await fetch(githubUrl);
    if (!response.ok) {
      return { statusCode: 404, body: 'Arquivo não encontrado' };
    }

    const buffer = await response.arrayBuffer();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/vnd.android.package-archive' },
      body: Buffer.from(buffer).toString('base64'),
      isBase64Encoded: true
    };

  } catch (err) {
    return { statusCode: 500, body: 'Erro ao buscar arquivo' };
  }
};
