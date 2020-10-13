require("dotenv").config();

const Slack = require("slack-node");
const fs = require("fs");

const webhookUri = process.env.SLACK_WEBHOOK_URL;

const slack = new Slack();
slack.setWebhook(webhookUri);

const send = async (isSuccess, message) => {
  const prefix = isSuccess ? "✅ [ Success ]" : "❌ [ Error]";
  const format = {
    text: `${prefix} ${message}`,
  };

  console.log(message);

  if (!isSuccess) {
    format.attachments = [
      {
        pretext: "<https://jsonlint.com/|JSON포맷확인>",
        color: "#ff1111",
        fields: [
          {
            title: "[ 알림 ]",
            value: "위 링크로 접속하여 JSON 포맷을 확인해주세요.",
            short: false,
          },
        ],
      },
    ];
  }

  slack.webhook(format, (err, response) => {
    console.log(response);
  });
};

fs.readFile("./index.json", "utf-8", (err, jsonString) => {
  try {
    JSON.parse(jsonString);
    send(true, "정상적으로 배포되었습니다.");
  } catch (error) {
    send(false, error.message);
  }
});
