import { StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";

export const ChildDetailStyles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: Colors.background,
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 20,
        paddingBottom: 10,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: Colors.text,
    },
    headerPlaceholder: {
        width: 24,
    },
    scrollContent: {
        padding: 20,
        paddingTop: 0,
        paddingBottom: 40,
    },
    errorText: {
        fontSize: 16,
        color: Colors.textMuted,
    },
    backLink: {
        marginTop: 16,
    },
    backLinkText: {
        color: Colors.primaryBlue,
        fontSize: 14,
        fontWeight: "600",
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.primaryLightBlue,
        padding: 16,
        marginBottom: 16,
    },
    childHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.primaryBlue,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    avatarText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "700",
    },
    childInfo: {
        flex: 1,
    },
    childName: {
        fontSize: 20,
        fontWeight: "700",
        color: Colors.text,
    },
    childAge: {
        fontSize: 14,
        color: Colors.textMuted,
        marginTop: 2,
    },
    statusBadge: {
        alignSelf: "flex-start",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        marginTop: 6,
    },
    statusBadgeIn: {
        backgroundColor: "#DCFCE7",
    },
    statusBadgeOut: {
        backgroundColor: "#FEE2E2",
    },
    statusBadgeText: {
        fontSize: 12,
        fontWeight: "600",
    },
    statusBadgeTextIn: {
        color: "#15803D",
    },
    statusBadgeTextOut: {
        color: "#B91C1C",
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: Colors.primaryLightBlue,
    },
    infoLabel: {
        fontSize: 14,
        color: Colors.textMuted,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: "500",
        color: Colors.text,
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    cardHeaderLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: Colors.text,
    },
    healthRow: {
        marginBottom: 12,
    },
    healthLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: Colors.textMuted,
        textTransform: "uppercase",
        marginBottom: 4,
    },
    healthValue: {
        fontSize: 14,
        color: Colors.text,
    },
    noDataText: {
        fontSize: 14,
        color: Colors.textMuted,
        fontStyle: "italic",
    },
    parentCard: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.primaryLightBlue,
    },
    parentInfo: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 8,
    },
    parentName: {
        fontSize: 15,
        fontWeight: "600",
        color: Colors.text,
    },
    primaryBadge: {
        backgroundColor: Colors.primaryBlue,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    primaryBadgeText: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "600",
    },
    relationText: {
        fontSize: 12,
        color: Colors.textMuted,
    },
    parentActions: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 8,
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: Colors.primaryLightBlue,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
    },
    actionButtonText: {
        fontSize: 12,
        fontWeight: "600",
        color: Colors.primaryBlue,
    },
    contactDetail: {
        fontSize: 13,
        color: Colors.textMuted,
        marginTop: 2,
    },
    warningBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: "#FEF3C7",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        alignSelf: "flex-start",
        marginTop: 8,
    },
    warningText: {
        fontSize: 11,
        color: "#B45309",
        fontWeight: "500",
    },

    // Notes section
    addNoteButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: Colors.green,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    addNoteButtonText: {
        fontSize: 12,
        fontWeight: "600",
        color: Colors.text,
    },
    noteForm: {
        backgroundColor: Colors.primaryLightBlue,
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    noteInput: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        fontSize: 14,
        borderColor: Colors.primaryBlue,
        color: Colors.text,
        backgroundColor: "#fff",
        marginBottom: 8,
    },
    noteTextArea: {
        minHeight: 80,
        textAlignVertical: "top",
    },
    noteFormButtons: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 8,
    },
    noteCancelButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: Colors.primaryBlue,
    },
    noteCancelButtonText: {
        fontSize: 14,
        fontWeight: "500",
        color: Colors.text,
    },
    noteSaveButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: Colors.green,
    },
    noteSaveButtonDisabled: {
        opacity: 0.6,
    },
    noteSaveButtonText: {
        fontSize: 14,
        fontWeight: "600",
        color: Colors.text,
    },
    noteCard: {
        backgroundColor: Colors.primaryLightBlue,
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderLeftWidth: 3,
        borderLeftColor: Colors.primaryBlue,
    },
    noteTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: Colors.text,
        marginBottom: 4,
    },
    noteContent: {
        fontSize: 13,
        color: Colors.text,
        lineHeight: 18,
    },
    noteMeta: {
        fontSize: 11,
        color: Colors.textMuted,
        marginTop: 8,
    },
});
