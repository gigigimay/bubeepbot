import { BUBEEP_AVATAR } from "../constants";
import { exampleCommand, beep } from "../utilities/string";
import axios from "../services/axios";

import getMajorCards from "../services/tarot";

const getCardData = async (cardNumber) =>
  (await getMajorCards()).find((item) => item.value_int == cardNumber);
const drawCard = async (_) => {
  return {
    card: await getCardData(Math.floor(Math.random() * 22)),
    isReversed: Math.floor(Math.random() >= 0.5),
  };
};

const messageBox = (data) => {
  const { card, isReversed } = data;
  const defaultCard = {
    title: `#${card.value} - ${card.name} ${isReversed ? "- Reversed" : ""}`,
    fields: [
      {
        name: "Meaning",
        value: isReversed ? card.meaning_rev : card.meaning_up,
      },
    ],
    timestamp: new Date(),
    footer: {
      text: "*bubeep*",
      icon_url: BUBEEP_AVATAR,
    },
  };
  return {
    embed: defaultCard,
  };
};

const execute = async (message) => {
  const selectedCard = await drawCard();
  message.channel.send(messageBox(selectedCard));
};

export default {
  name: "tarot",
  desc: "Let me read your mind then represent it as a card. ",
  cooldown: 5,
  param: 0, // 0: no param, 1: optional, 2: required
  execute,
};
