import { TouchableOpacity, Text } from "react-native";
import { ButtonStyles } from "@/styles";

type Props = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "danger" | "neutral";
};

export function AppButton({
  label,
  onPress,
  variant = "primary",
}: Props) {
  const backgroundStyle =
    variant === "danger"
      ? ButtonStyles.danger
      : variant === "neutral"
      ? ButtonStyles.neutral
      : ButtonStyles.primary;

  const textStyle =
    variant === "danger"
      ? ButtonStyles.textLight
      : ButtonStyles.textDark;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[ButtonStyles.base, backgroundStyle]}
      activeOpacity={0.85}
    >
      <Text style={textStyle}>{label}</Text>
    </TouchableOpacity>
  );
}
