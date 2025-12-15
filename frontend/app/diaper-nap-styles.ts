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
    title: {
        fontSize: 20,
        fontWeight: "700",
        textAlign: "center",
        color: Colors.text,
        marginBottom: 16,
    },
    header: {
        fontSize: 16,
        fontWeight: "700",
        color: Colors.text,
        marginTop: 8,
        marginBottom: 8,
    },
    dateLabel: {
        fontSize: 14,
        fontWeight: "700",
        color: Colors.text,
        marginBottom: 8,
    },
    diaperCard: {
        backgroundColor: Colors.brown,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 8,
    },
    diaperRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    diaperText: {
        fontSize: 12,
        color: Colors.text,
    },
    sleepCard: {
        backgroundColor: Colors.primaryBlue,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 8,
    },
    sleepRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    sleepTextLabel: {
        fontSize: 12,
        color: Colors.text,
        fontWeight: "600",
    },
    sleepTextDuration: {
        fontSize: 12,
        color: Colors.text,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.primaryLightBlue,
        marginVertical: 16,
    },
    backText: {
        fontSize: 14,
        color: Colors.primaryBlue,
        marginBottom: 10,
        marginTop: 8,
        marginLeft: 16,
        fontWeight: "600",
    },
    buttonRow: {
        marginTop: 10,
        gap: 8,
    },
    primaryButton: {
        alignSelf: "center",
        backgroundColor: Colors.green,
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 99,
    },
    primaryButtonText: {
        fontSize: 12,
        fontWeight: "700",
        color: Colors.brown,
    },
    secondaryButton: {
        alignSelf: "center",
        backgroundColor: Colors.primaryLightBlue,
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 99,
    },
    secondaryButtonText: {
        fontSize: 12,
        fontWeight: "700",
        color: Colors.text,
    },
});