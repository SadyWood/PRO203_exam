export type Message = {
    id: string;
    from: "parent" | "staff";
    text: string;
    at?: string; // valgfritt, om du vil vise tidspunkt senere
  };
  
  export type Thread = {
    id: string;
    name: string;
    subtitle: string;
    messages: Message[];
  };
  
  export const MOCK_THREADS: Record<string, Thread> = {
    "1": {
      id: "1",
      name: "Ola Hansen",
      subtitle: "Foresatt til Editah  • Avdeling Bjørn",
      messages: [
        { id: "1a", from: "parent", text: "Hei! Editah kommer litt senere i dag 😊" },
        { id: "1b", from: "staff", text: "Hei! Null stress – takk for beskjed 👍" },
        { id: "1c", from: "parent", text: "Supert. Kan dere gi han litt frokost når han kommer?" },
        { id: "1d", from: "staff", text: "Ja, det fikser vi!" },
      ],
    },
  
    "2": {
      id: "2",
      name: "Sara Nilsen",
      subtitle: "Foresatt til Ella • Avdeling Bjørn",
      messages: [
        { id: "2a", from: "parent", text: "Hei, Ella sov dårlig i natt – kan være litt ekstra trøtt." },
        { id: "2b", from: "staff", text: "Takk for info! Vi følger litt ekstra med i dag 💛" },
      ],
    },
  
    "3": {
      id: "3",
      name: "Ahmed Ali",
      subtitle: "Foresatt til Omar • Avdeling Bjørn",
      messages: [
        { id: "3a", from: "parent", text: "Omar er litt tett i nesa, men i fin form ellers." },
        { id: "3b", from: "staff", text: "Skjønner! Vi sier ifra hvis noe endrer seg." },
        { id: "3c", from: "parent", text: "Takk 🙏" },
      ],
    },
  };
  