import { StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";

export const EmployeeChildrenStyles = StyleSheet.create({
  /* Layout */
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  /* Empty state */
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginTop: 12,
  },

  /* Group card */
  groupCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primaryLightBlue,
    marginBottom: 12,
    overflow: "hidden",
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  groupHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  groupHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  groupName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  myGroupBadge: {
    backgroundColor: Colors.primaryBlue,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  myGroupBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  groupCount: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  groupContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.primaryLightBlue,
  },

  /* Section labels */
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textMuted,
    marginTop: 12,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  emptyListText: {
    fontSize: 13,
    color: Colors.textMuted,
    fontStyle: "italic",
  },

  /* Member rows */
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryLightBlue,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text,
  },
  memberSubtext: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  memberRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  /* Status pills */
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  statusPillIn: {
    backgroundColor: "#DCFCE7",
  },
  statusPillOut: {
    backgroundColor: "#FEE2E2",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusDotIn: {
    backgroundColor: "#16A34A",
  },
  statusDotOut: {
    backgroundColor: "#DC2626",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
  },
  statusTextIn: {
    color: "#15803D",
  },
  statusTextOut: {
    color: "#B91C1C",
  },
});
