import { StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: Colors.background,
    },
    content: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 30,
    },
    backText: {
        fontSize: 14,
        color: Colors.primaryBlue,
        marginBottom: 10,
        marginTop: 8,
        marginLeft: 16,
        fontWeight: "600",
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        textAlign: "center",
        color: Colors.text,
        marginBottom: 16,
    },
    toggleRow: {
        flexDirection: "row",
        alignSelf: "center",
        backgroundColor: Colors.primaryLightBlue,
        borderRadius: 99,
        padding: 4, 
        marginBottom: 16,
    },
    toggleButton: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 99,
    },
    toggleButtonActivate: {
        backgroundColor: Colors.primaryBlue,
    },
    toggleText: {
        fontSize: 12,
        fontWeight: "500",
        color: Colors.textMuted,
    },
    toggleTextActivate: {
        fontWeight: "700",
        color: Colors.text,
    },
    label: {
        fontSize: 12,
        fontWeight: "600",
        color: Colors.text,
        marginBottom: 4,
        marginTop: 12,
    },
    input: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.primaryLightBlue,
        backgroundColor: Colors.background,
        paddingVertical: 8,
        paddingHorizontal: 10,
        fontSize: 12,
        color: Colors.text,
    },
    choiceRow: {
        flexDirection: "row",
        gap: 8,
        marginTop: 4,
    },
    choiceButton: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 8,
        backgroundColor: Colors.primaryBlue,
    },
    choiceButtonActive: {
        backgroundColor: Colors.green,
    },
    choiceText: {
        fontSize: 12,
        fontWeight: "600",
        color: Colors.text,
    },
    submitButton: {
        marginTop: 24,
        alignSelf: "center",
        backgroundColor: Colors.primaryBlue,
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 99,
    },
    submitText: {
        fontSize: 14,
        fontWeight: "700",
        color: Colors.text,
    },
    typeRow: {
        flexDirection: "row",
        gap: 8,
        marginTop: 4,
    },
    typeButton: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 16,
        backgroundColor: Colors.primaryLightBlue,
    },
    typeButtonActive: {
        backgroundColor: Colors.primaryBlue,
    },
    typeText: {
        fontSize: 12,
        fontWeight: "600",
        color: Colors.text,
    },
});