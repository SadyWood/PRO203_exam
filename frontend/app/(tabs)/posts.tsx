import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import {postsStyles} from "./posts-style";

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
        "Snøfall",
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
    <ScrollView
      style={postsStyles.screen}
    >
      {/* Back */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={postsStyles.backButton}
      >
        <Ionicons name="chevron-back" size={26} />
      </TouchableOpacity>

      <Text style={postsStyles.title}>Blogg</Text>

      {posts.map((post) => (
        <TouchableOpacity
          key={post.id}
          style={postsStyles.card}
          activeOpacity={0.85}
          onPress={() => router.push(`/blog/${post.id}`)}
        >
          <Image source={post.image} style={postsStyles.image} />

          <View style={postsStyles.textContainer}>
            <Text style={postsStyles.date}>{post.titleDate}</Text>

            <Text style={postsStyles.description} numberOfLines={4}>
              {post.text}
            </Text>

            <Text style={postsStyles.arrow}>➜</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}