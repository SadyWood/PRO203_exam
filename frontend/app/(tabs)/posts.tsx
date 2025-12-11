import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function BlogScreen() {
  const router = useRouter();

  const posts = [
    {
      id: 1,
      titleDate: "13.11.25",
      text:
        "I dag var bjørne avdelingen ute på tur i skogen. De lekte masse og løp rundt mellom trærne. Etterpå ble det pølsegrilling.",
      image: require("../../assets/images/1.jpg"),
    },
    {
      id: 2,
      titleDate: "30.11.25",
      text:
        "I dag var det halloweenfest. Mange fine kostymer og barna som ville fikk ansiktsmaling.",
      image: require("../../assets/images/2.jpg"),
    },
    {
      id: 3,
      titleDate: "21.12.25",
      text:
        "Barna bygde snømann ute i barnehagen. De samarbeidet og hadde det veldig gøy.",
      image: require("../../assets/images/3.jpg"),
    },
    {
      id: 4,
      titleDate: "05.01.26",
      text:
        "Første snødag på lekeplassen! Barna testet sklien og lekte i snøen hele dagen.",
      image: require("../../assets/images/4.jpg"),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Blogg</Text>

      {posts.map((post) => (
        <TouchableOpacity
          key={post.id}
          style={styles.card}
          onPress={() => router.push(`/blog/${post.id}`)}
        >
          <Image source={post.image} style={styles.image} />

          <View style={styles.textContainer}>
            <Text style={styles.date}>{post.titleDate}</Text>

            <Text style={styles.description} numberOfLines={4}>
              {post.text}
            </Text>

            <Text style={styles.arrow}>➜</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 50, 
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    position: "absolute",
    top: 0,
    left: 16,
    zIndex: 10,
    padding: 5,
  },
  backIcon: {
    fontSize: 30,
    color: "black",
  },

  title: {
    fontSize: 26,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 25,
  },

  card: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#BACEFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#F8FAFF",
  },

  image: {
    width: 110,
    height: 110,
    borderRadius: 8,
    marginRight: 12,
  },

  textContainer: {
    flex: 1,
    justifyContent: "space-between",
  },

  date: {
    fontWeight: "700",
    marginBottom: 6,
  },

  description: {
    fontSize: 14,
  },

  arrow: {
    alignSelf: "flex-end",
    marginTop: 8,
    fontSize: 18,
  },
});
