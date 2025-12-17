import {
 View,
 Text, 
 ScrollView, 
 Image, 
 TouchableOpacity } 
 from "react-native";
 import { useLocalSearchParams, useRouter } from "expo-router";
 import { Ionicons } from "@expo/vector-icons";
 import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useMemo, useState } from "react";

import { Colors } from "@/constants/colors";
import { STORAGE_KEY, type BlogPosts as BlogPost } from "../posts";

type PostWithImages = BlogPost & { images?: any[] };

const fallbackImagesById: Record<string, any[]> = {
    "1": [
        require("../../../assets/images/1.jpg"),
        require("../../../assets/images/2.jpg"),
        require("../../../assets/images/3.jpg"),
        require("../../../assets/images/4.jpg"),
        require("../../../assets/images/1.jpg"),
        require("../../../assets/images/2.jpg"),
    ],
    "2": [
        require("../../../assets/images/2.jpg"),
        require("../../../assets/images/3.jpg"),
        require("../../../assets/images/4.jpg"),
        require("../../../assets/images/2.jpg"),
    ]
}; 

export default function PostDetailsScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id?: string }>();
    const postId = typeof id === "string" ? id : "1";

    const [storedPosts, setStoredPosts] = useState<BlogPost[]>([]);

    useEffect(() => {
        (async () => {
            try {
                const raw = await AsyncStorage.getItem(STORAGE_KEY);
                setStoredPosts(raw ? JSON.parse(raw) : []);
            } catch {
                setStoredPosts([]);
            }
        })();
    }, []);
    const post: PostWithImages | undefined = useMemo(() => {
        const fromStorage = storedPosts.find((p) => p.id === postId);
        if (!fromStorage) return undefined;

        return {
        ...fromStorage,
        images: fromStorage.imageUri 
        ? [{ uri: fromStorage.imageUri }]
        : undefined,
    };
}, [storedPosts, postId]);

const fallBackPost: PostWithImages = useMemo(() => {
    return {
        id: postId,
        titleDate: "13.11.25",
        text: "I dag var bjørne avdelingen ute på tur i skogen. De lekte masse og løp rundt mellom trærne. Etterpå ble det pølsegrilling.",
        images: fallbackImagesById[postId] ?? [require("../../../assets/images/1.jpg")],

    };
}, [postId]);

const finalPost = post ?? fallBackPost;

const images = finalPost.images ?? [];
const twoColRows = [];
for (let i = 0; i < images.length; i += 2) {
    twoColRows.push(images.slice(i, i + 2));
}

return (
    <ScrollView style={{ flex: 1, 
    backgroundColor: 
    Colors.background }}>

    <View style={{ paddingHorizontal: 16, 
        paddingTop: 12, 
        paddingBottom: 24 }}>

        <TouchableOpacity onPress={() => router.back()} 
        style={{ marginBottom: 8}}>

            <Ionicons name="chevron-back" size={26} />

        </TouchableOpacity>

        <View style={{ backgroundColor: Colors.primaryLightBlue, 
            borderRadius: 16, 
            paddingVertical: 10,
            alignItems: "center",
            marginBottom: 10,
        }}>

            <Text style={{ fontWeight: "800",
                color: Colors.text
            }}>{finalPost.titleDate}</Text>
        </View>

        <View style={{ backgroundColor: Colors.background,
            borderWidth: 1,
            borderColor: Colors.border,
            borderRadius: 12,
            padding: 12,
            marginBottom: 12,
        }}>

            <Text style={{ color: Colors.text,
                fontSize: 13, 
                lineHeight: 18,
            }}>{finalPost.text}</Text>
        </View>

        <View style={{ gap: 10}}>
            {twoColRows.map((row, idx) => (
                <View key={idx} style={{ flexDirection: "row",
                    gap: 10}}>
                        {row.map((img, j) => (
                            <Image key={j}
                            source={img}
                            style={{ flex: 1,
                                height: 140, 
                                borderRadius: 12,
                                backgroundColor: Colors.primaryBlue,
                            }} resizeMode="cover"/>
                        ))}
                        {row.length === 1 && 
                        <View style={{ flex: 1}} />}
                        </View>
            ))}
        </View>
    </View>
    </ScrollView>
);
}

