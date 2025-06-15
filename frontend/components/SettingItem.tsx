// components/SettingItem.tsx
import React from "react";
import { View, Text, TouchableOpacity, Switch } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";

type SettingItemProps = {
  icon: React.ReactNode;
  title: string;
  rightText?: string;
  showArrow?: boolean;
  showSwitch?: boolean;
  switchValue?: boolean;
  iconBgColor?: string;
  onPress?: () => void;
  onSwitchToggle?: (value: boolean) => void;
};

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  rightText,
  showArrow = true,
  showSwitch = false,
  switchValue = false,
  iconBgColor = "bg-indigo-100",
  onPress,
  onSwitchToggle,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(scale.value, { duration: 200, easing: Easing.out(Easing.quad) }) }],
    opacity: withTiming(opacity.value, { duration: 200, easing: Easing.out(Easing.quad) }),
  }));

  const handlePress = (isIn: boolean) => {
    scale.value = isIn ? 0.96 : 1;
    opacity.value = isIn ? 0.9 : 1;
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPressIn={() => handlePress(true)}
        onPressOut={() => handlePress(false)}
        onPress={onPress}
        className="flex-row justify-between items-center p-4 bg-white rounded-2xl border border-gray-200"
      >
        <View className="flex-row items-center space-x-3">
          <View className={`${iconBgColor} p-2 rounded-lg`}>{icon}</View>
          <Text className="text-[16px] font-medium text-gray-800">{title}</Text>
        </View>
        {showSwitch ? (
          <Switch
            value={switchValue}
            onValueChange={onSwitchToggle}
            trackColor={{ false: "#e5e7eb", true: "#6366f1" }}
            thumbColor="#ffffff"
            ios_backgroundColor="#e5e7eb"
          />
        ) : (
          <View className="flex-row items-center space-x-2">
            {rightText && <Text className="text-sm font-medium text-gray-500">{rightText}</Text>}
            {showArrow && <Feather name="chevron-right" size={18} color="#c4b5fd" />}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default SettingItem;
