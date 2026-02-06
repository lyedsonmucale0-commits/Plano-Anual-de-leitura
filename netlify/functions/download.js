const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  const fileName = event.queryStringParameters.file;
  const filePath = path.join(__dirname, "../../apks", fileName);

  try {
    const fileBuffer = fs.readFileSync(filePath);
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/vnd.android.package-archive",
        "Content-Disposition": `attachment; filename="${fileName}"`
      },
      body: fileBuffer.toString('base64'),
      isBase64Encoded: true
    };
  } catch (err) {
    return { statusCode: 404, body: "Arquivo não encontrado" };
  }
};
