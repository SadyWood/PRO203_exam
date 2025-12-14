import React, { useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { styles } from "./diaper-nap-styles";

const MOCK_CHILDREN = [
    {
    name: "Edith",
    lastDiaper: "10:15",
    lastNap: "11:30 - 13:00",
    },
];

export default function DiaperNapScreen() {
    const router = useRouter();

    //TODO backend/context
    const [children] = useState(MOCK_CHILDREN);

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
                    <Text style={styles.backText}>Tilbake</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Bleieskift & søvn</Text>
                <Text style={styles.header}>Bleieskift</Text>
                <Text style={styles.dateLabel}>I går 08.01.26</Text>

                {children.map((child) => (
                    <View key={child.name} style={styles.diaperCard}>
                        <View style={styles.diaperRow}>
                            <Text style={styles.diaperText}>{child.name}: bæsjebleie skift</Text>
                            <Text style={styles.diaperText}>kl: {child.lastDiaper}</Text>
                            </View>
                        </View>
                ))}

                        <View style={styles.divider}/>
                            <Text style={styles.header}>Søvn registrering</Text>
                            <Text style={styles.dateLabel}>I går 08.01.26</Text>
                            {children.map((child) => (
                                <View key={'${child.name}-sleep'} style={styles.sleepCard}>
                                    <View style={styles.sleepRow}>
                                        <Text style={styles.sleepTextLabel}>{child.name} søvn:</Text>
                                        <Text style={styles.sleepTextDuration}>{child.lastNap}</Text>
                                    </View>
                                </View>
                            ))}
                            </ScrollView>
                            </View>
                        );
                    }