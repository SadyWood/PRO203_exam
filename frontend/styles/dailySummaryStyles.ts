import { StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";

export const DailySummaryStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: Colors.background,
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 30,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    backButton: {
        padding: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        color: Colors.text,
    },
    placeholder: {
        width: 28,
    },
    childSelector: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 16,
    },
    childTab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: Colors.primaryLightBlue,
    },
    childTabActive: {
        backgroundColor: Colors.primaryBlue,
    },
    childTabText: {
        fontSize: 14,
        fontWeight: "500",
        color: Colors.textMuted,
    },
    childTabTextActive: {
        fontWeight: "700",
        color: Colors.text,
    },
    dateHeader: {
        fontSize: 14,
        fontWeight: "700",
        color: Colors.text,
        marginBottom: 12,
        textTransform: "capitalize",
    },
    section: {
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: Colors.text,
    },
    card: {
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 8,
    },
    diaperCard: {
        backgroundColor: Colors.brown,
    },
    sleepCard: {
        backgroundColor: Colors.primaryBlue,
    },
    noteCard: {
        backgroundColor: Colors.primaryLightBlue,
        borderWidth: 1,
        borderColor: Colors.primaryBlue,
    },
    cardRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    cardText: {
        fontSize: 13,
        color: Colors.text,
    },
    cardTextBold: {
        fontSize: 13,
        fontWeight: "600",
        color: Colors.text,
    },
    cardTime: {
        fontSize: 12,
        color: Colors.textMuted,
    },
    noteText: {
        fontSize: 13,
        color: Colors.text,
        lineHeight: 18,
    },
    noteAuthor: {
        fontSize: 11,
        color: Colors.textMuted,
        marginTop: 4,
    },
    emptyText: {
        fontSize: 13,
        color: Colors.textMuted,
        fontStyle: "italic",
        paddingVertical: 8,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.primaryLightBlue,
        marginVertical: 16,
    },
});
