import TelegramBot from "node-telegram-bot-api";

export function parseHtmlMessage(text: string, entities: TelegramBot.MessageEntity[]) {
  let formattedText = text;

  entities.reverse().forEach((entity) => {
    const { offset, length, type, url } = entity;
    const entityText = text.substring(offset, offset + length);

    let replacement: string;
    switch (type) {
      case 'bold':
        replacement = `<b>${entityText}</b>`;
        break;
      case 'italic':
        replacement = `<i>${entityText}</i>`;
        break;
      case 'underline':
        replacement = `<u>${entityText}</u>`;
        break;
      case 'strikethrough':
        replacement = `<s>${entityText}</s>`;
        break;
      case 'code':
        replacement = `<code>${entityText}</code>`;
        break;
      case 'pre':
        replacement = `<pre>${entityText}</pre>`;
        break;
      case 'text_link':
        replacement = `<a href="${url}">${entityText}</a>`;
        break;
      default:
        replacement = entityText;
    }

    formattedText =
      formattedText.substring(0, offset) +
      replacement +
      formattedText.substring(offset + length);
  });

  return formattedText;
}