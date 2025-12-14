import React, { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import {
    View, 
    Text, 
    ScrollView, 
    TouchableOpacity,
    TextInput,
} from "react-native";
import { styles } from "./employee-diaper-nap-style";
import { Colors } from "@/constants/colors";

const MOCK_CHILDREN = ["Edith", "Stian", "Hafiz"]

type DiaperType = "Tiss" | "Bæsj" | "Begge";
type SkinStatus = "Normal" | "Litt rød" | "Sår";
type Mode = "Bleieskift" | "Søvn";

export default function EmployeeDiaperNapScreen() {
    const router = useRouter();

    const [mode, setMode] = useState<Mode>("Bleieskift");
    const [selectedChild, setSelectedChild] = useState<string>(MOCK_CHILDREN[0]);

    //bleie
    const [time, setTime] = useState("");
    const [diaperType, setDiaperType] = useState<DiaperType>("Tiss");
    const [skinStatus, setSkinStatus] = useState<SkinStatus>("Normal");

    //sove
    const [sleptAt, setSleptAt] = useState("");
    const [wokeAt, setWokeAt] = useState("");
    const [comment, setComment] = useState("");

    const isDiaper = mode === "Bleieskift";
    const isNap = mode === "Søvn";

    const canSumbit = useMemo(() => {
        if (!selectedChild) return false;

        if (isDiaper) {
            return time.trim().length > 0;
        }

        return sleptAt.trim.length > 0 && wokeAt.trim().length > 0;
    }, [selectedChild, isDiaper, time, sleptAt, wokeAt]);

    const handleSumbit = () => {
        if (!canSumbit) return;

        if (isDiaper) {
            // TODO backend
            //await api.createDiaperChange ({child: selectedChild, time, diaperType, skinStatus})

            console.log("Register bleie", { 
                child: selectedChild,
                time, 
                diaperType, 
                skinStatus,
            });

            setTime("");
            setDiaperType("Tiss");
            setSkinStatus("Normal");
            return;
        }
        //TODO backend
        //await api.createNap ({child: selectedChild, sleptAt, wokeAt, comment? })
        console.log("Register søvn", {
            child: selectedChild,
            sleptAt,
            wokeAt,
            comment,
        });

        setSleptAt("");
        setWokeAt("");
        setComment("");
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
                    <Text style={styles.backText}>Tilbake</Text>
                </TouchableOpacity>

                <Text style={styles.title}>BleieSkift & Søvn</Text>
                <View style={styles.toggleRow}>
                    <TouchableOpacity style={[styles.toggleButton, isDiaper && styles.toggleButtonActivate,]}
                    onPress={() => setMode("Bleieskift")} activeOpacity={0.8}>
                        <Text style={[styles.toggleText, isDiaper && styles.toggleTextActivate]}>
                            Bleieskift
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.toggleButton, isNap && styles.toggleButtonActivate,]}
                    onPress={() => setMode("Søvn")} activeOpacity={0.8}>
                        <Text style={[styles.toggleText, isNap && styles.toggleTextActivate]}>Søvn</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Barn</Text>
                <View style={styles.choiceRow}>{MOCK_CHILDREN.map((name) => {
                    const active = selectedChild === name;
                    return (<TouchableOpacity
                        key={name} style={[styles.choiceButton, active && {backgroundColor: Colors.primaryLightBlue}]}
                        onPress={() => setSelectedChild(name)} activeOpacity={0.8}>
                            <Text style={styles.choiceText}>{name}</Text>
                        </TouchableOpacity>
                    );
                })}
                </View>
                {isDiaper && (
                    <>
                    <Text style={styles.label}>Tidspunkt</Text>
                    <TextInput style={styles.input} 
                    placeholder="f.eks 11:05" 
                    value={time}
                    onChangeText={setTime}
                    keyboardType="numbers-and-punctuation"
                    />

                    <Text style={styles.label}>Type</Text>
                    <View style={styles.typeRow}>{(["Tiss", "Bæsj", "Begge"] as DiaperType[]).map((t) =>{
                        const active = diaperType === t;
                        return (
                            <TouchableOpacity 
                            key={t}
                            style={[styles.typeButton,]} onPress={() => setDiaperType(t)} activeOpacity={0.8}>
                                <Text style={styles.typeText}>{t}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                
                <Text style={styles.label}>Hud Status</Text>
                <View style={styles.choiceButton}>
                    {(["Normal", "Litt rød", "Sår"] as SkinStatus[]).map((s) => {
                        const active = skinStatus === s;
                        return (
                            <TouchableOpacity key={s}
                            style={[styles.choiceButton, active && {backgroundColor: Colors.primaryLightBlue}]}
                            onPress={() => setSkinStatus(s)}
                            activeOpacity={0.8}>
                                <Text style={styles.choiceText}>{s}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                </>
            )}
            {isNap && (
                <>
                <Text style={styles.label}>Sovnet</Text>
                <TextInput style={styles.input}
                placeholder={sleptAt}
                onChangeText={setSleptAt}
                keyboardType="numbers-and-punctuation"
                />
                <Text style={styles.label}>Våknet</Text>
                <TextInput style={styles.input}
                placeholder="f.eks 13:00"
                value={wokeAt}
                onChangeText={setWokeAt}
                keyboardType="numbers-and-punctuation"
                />

                <Text style={styles.label}>Kommentar</Text>
                <TextInput style={styles.input}
                placeholder="valgfritt"
                value={comment}
                onChangeText={setComment}
                />
                </>
            )}

            <TouchableOpacity style={[styles.submitButton, {opacity: canSumbit ? 1 : 0.4},
            ]}
            onPress={handleSumbit}
            activeOpacity={0.8}
            disabled={!canSumbit}
            >
                <Text style={styles.submitText}>Registrer</Text>
            </TouchableOpacity>
            </ScrollView>
        </View>
    );
}