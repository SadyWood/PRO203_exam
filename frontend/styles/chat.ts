import { StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";

export const ChatStyles = StyleSheet.create({
  /* Screen + container (erstatter AppStyles) */
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  /* Header */
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  headerBox: {
    flex: 1,
    paddingVertical: 10,
  },

  name: {
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
    color: Colors.text,
  },

  subtitle: {
    fontSize: 12,
    opacity: 0.55,
    textAlign: "center",
    marginTop: 2,
    color: Colors.text,
  },

  /* Messages */
  messagesBox: {
    flex: 1,
    marginTop: 10,
  },

  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingBottom: 24,
  },

  bubble: {
    maxWidth: "78%",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
    marginVertical: 5,
  },

  staffBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#4A6CF7",
  },

  parentBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#EEF2FF",
  },

  bubbleText: {
    fontSize: 14,
    lineHeight: 19,
  },

  staffText: { color: "white" },
  parentText: { color: "#111827" },

  /* Input */
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },

  chatInput: {
    flex: 1,
    minHeight: 46,
    borderRadius: 999,
    paddingHorizontal: 14,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 15,
    color: Colors.text,
  },

  sendButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4A6CF7",
  },
});
