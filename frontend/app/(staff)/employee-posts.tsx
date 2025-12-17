import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

import { PostsStyles } from "@/styles";

type BlogPost = {
  id: string;
  titleDate: string;
  text: string;
  imageUri?: string;
  image?:  any;
};

const STORAGE_KEY = "blog_posts_v1";

const FALLBACK_POSTS: BlogPost[] = [
    {
      id: "1",
      titleDate: "13.11.25",
      text:
        "I dag var bjørne avdelingen ute på tur i skogen. De lekte masse og løp rundt mellom trærne. Etterpå ble det pølsegrilling.",
      image: require("../../assets/images/1.jpg"),
    },
    {
      id: "2",
      titleDate: "30.11.25",
      text:
        "I dag var det halloweenfest. Mange fine kostymer og barna som ville fikk ansiktsmaling.",
      image: require("../../assets/images/2.jpg"),
    },
    {
      id: "3",
      titleDate: "21.12.25",
      text:
        "Barna bygde snømann ute i barnehagen. De samarbeidet og hadde det veldig gøy.",
      image: require("../../assets/images/3.jpg"),
    },
    {
      id: "4",
      titleDate: "05.01.26",
      text:
        "Første snødag på lekeplassen! Barna testet sklien og lekte i snøen hele dagen.",
      image: require("../../assets/images/4.jpg"),
    },
  ];

  export default function EmployeePostsScreen() {
    const router = useRouter();
    const [posts, setPosts] = useState<BlogPost[]>(FALLBACK_POSTS);

    useEffect(() => {
      (async () => {
        try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        const parsed: BlogPost[] = stored ? JSON.parse(stored) : [];
        setPosts([...parsed, ...FALLBACK_POSTS]);
      } catch {
        setPosts(FALLBACK_POSTS);
      }
    })();
    }, []);


  return (
    <ScrollView
      style={PostsStyles.screen}
      contentContainerStyle={PostsStyles.container}
    >
      {/* Back */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={PostsStyles.backButton}
      >
        <Ionicons name="chevron-back" size={26} />
      </TouchableOpacity>

      <Text style={PostsStyles.title}>Blogg</Text>

      {posts.map((post) => (
        <TouchableOpacity
          key={post.id}
          style={PostsStyles.card}
          activeOpacity={0.85}
          onPress={() => router.push(`/(staff)/employee-posts${post.id}`)}
        >
          <Image source={post.imageUri ? { uri: post.imageUri } : post.image} style={PostsStyles.image} />

          <View style={PostsStyles.textContainer}>
            <Text style={PostsStyles.date}>{post.titleDate}</Text>

            <Text style={PostsStyles.description} numberOfLines={4}>
              {post.text}
            </Text>

            <Text style={PostsStyles.arrow}>➜</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
