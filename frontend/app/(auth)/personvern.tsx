import { Stack, useRouter } from "expo-router";
import {KeyboardAvoidingView, Platform, ScrollView,StyleSheet,Text, View, Pressable,} from "react-native";

export default function PersonvernScreen() {
  const router = useRouter();

  function handleAccept() {
    router.replace("/registration");
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <Stack.Screen options={{ title: "Personvern" }} />

      <View style={styles.container}>
        <Text style={styles.logo}>CHECK-KID ✅</Text>

        <View style={styles.card}>
          <Text style={styles.title}>Personvern</Text>

          <ScrollView style={styles.textScroll} showsVerticalScrollIndicator>
            <Text style={styles.text}>
              I Eventyrhagen Barnehage er det viktig for oss at både barn,
              foresatte og ansatte er trygge på hvordan vi behandler
              personopplysninger. For at barnehagen skal kunne kommunisere godt
              med foreldre og gi gode og trygge oppdateringer om barnas
              hverdag, samler vi inn opplysninger som navn, fødselsdato,
              kontaktinformasjon og eventuell nødvendig informasjon om barnets
              trivsel, helse eller spesielle hensyn. Vi lagrer kun det som er
              nødvendig, og all behandling av informasjon skjer i tråd med
              gjeldende lover og regler for personvern.
            </Text>

            <Text style={styles.text}>
              Opplysningene som registreres om barnet ditt brukes kun i
              forbindelse med barnehagens daglige arbeid og for å sikre god
              kommunikasjon mellom ansatte og foresatte. Det kan for eksempel
              være beskjeder, dagsrapporter, informasjon om søvn, måltider,
              aktiviteter eller andre relevante observasjoner. Foreldre får kun
              tilgang til informasjon som gjelder eget barn, og ansatte får kun
              tilgang til opplysninger de trenger for å utføre jobben sin på en
              trygg og god måte. Ingen andre har tilgang til informasjonen, og
              vi deler den aldri med tredjeparter med mindre det følger av lov
              eller du som forelder har gitt et tydelig samtykke.
            </Text>

            <Text style={styles.text}>
              For å beskytte informasjonen benytter vi sikre løsninger som
              sørger for at data er beskyttet både når den lagres og når den
              sendes mellom brukere. Appen bruker kryptering, sikre servere
              innenfor EU/EØS og strenge tilgangskontroller, slik at ingen
              uvedkommende kan se eller bruke opplysningene. All tilgang
              loggføres og overvåkes for å sikre at informasjonen behandles
              korrekt og forsvarlig.
            </Text>

            <Text style={[styles.text, styles.textLast]}>
              Opplysningene lagres så lenge barnet ditt går i barnehagen. Når
              barnet slutter, slettes eller anonymiseres informasjonen, med
              mindre lovverket krever at noe lagres lenger. Som forelder har du
              alltid rett til å be om innsyn i hvilken informasjon vi har
              registrert om barnet ditt og om deg. Du kan også be om at
              opplysninger rettes dersom noe er feil, eller at de slettes
              dersom det ikke lenger er behov for dem og loven tillater det.
              Dersom du har spørsmål om hvordan vi behandler
              personopplysninger, kan du når som helst ta kontakt med
              barnehagen eller personvernansvarlig på +47 123 456 78.
            </Text>
          </ScrollView>

          <Pressable style={styles.button} onPress={handleAccept}>
            <Text style={styles.buttonText}>Jeg godkjenner</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    padding: 16,
  },
  logo: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 12,
  },
  card: {
    flex: 1,
    maxHeight: 550,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  textScroll: {
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  textLast: {
    marginBottom: 0,
  },
  button: {
    backgroundColor: "#4ade80",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
