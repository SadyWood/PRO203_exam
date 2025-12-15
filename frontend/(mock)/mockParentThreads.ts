export type ParentMessage = {
  id: string;
  from: "parent" | "staff";
  text: string;
};

export type ParentThread = {
  id: string;
  name: string;
  subtitle: string;
  messages: ParentMessage[];
};

export const MOCK_PARENT_THREADS: Record<string, ParentThread> = {
  "1": {
    id: "1",
    name: "Maiken",
    subtitle: "Ansatt • Avdeling Bjørn (Stian)",
    messages: [
      {
        id: "p1",
        from: "staff",
        text:
          "Hei Ola! Stian var litt trøtt i morges, men kom raskt i godt humør etter frokost 😊",
      },
      {
        id: "p2",
        from: "parent",
        text: "Hei! Takk for beskjed 🙏 Han sov litt dårlig i natt.",
      },
      {
        id: "p3",
        from: "staff",
        text: "Det merkes litt, men han gjør det veldig fint nå 👍",
      },
      {
        id: "p4",
        from: "staff",
        text:
          "Vi skal på tur etter lunsj. Husk gjerne ekstra votter i sekken i morgen.",
      },
      {
        id: "p5",
        from: "parent",
        text: "Supert, jeg legger ekstra votter og ullsokker i sekken hans.",
      },
    ],
  },

  "2": {
    id: "2",
    name: "Simon",
    subtitle: "Ansatt • Avdeling Loppe (Edith)",
    messages: [
      {
        id: "p6",
        from: "staff",
        text: "Hei! Edith hadde en kjempefin dag i dag ☺️",
      },
      {
        id: "p7",
        from: "parent",
        text: "Så hyggelig å høre, tusen takk for oppdatering!",
      },
    ],
  },

  "3": {
    id: "3",
    name: "Pia",
    subtitle: "Styrer • Eventyrhagen Barnehage",
    messages: [
      {
        id: "p8",
        from: "staff",
        text:
          "Hei! Ny månedsplan ligger nå tilgjengelig i appen under kalender 📅",
      },
    ],
  },
};
