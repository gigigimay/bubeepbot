import embed from "./embed";

const fortuneInfo = (cardData) => {
  const { card, isReversed } = cardData;

  return embed({
    author: null,
    title: `#${card.value_int} - ${card.name} ${
      isReversed ? "- Reversed" : ""
    }`,
    fields: [
      {
        name: "Meaning",
        value: isReversed ? card.meaning_rev : card.meaning_up,
      },
    ],
    thumbnail: null,
  });
};

export default fortuneInfo;
