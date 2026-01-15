import { Colors } from "@/src/constants";
import { MaterialIcons } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View className="flex-1 items-center justify-center p-6 bg-background-light dark:bg-background-dark">
        <MaterialIcons
          name="error-outline"
          size={64}
          color={Colors.text.secondary.light}
        />
        <Text className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mt-4 font-serif">
          Page Not Found
        </Text>
        <Text className="text-text-secondary-light dark:text-text-secondary-dark text-center mt-2">
          The page you're looking for doesn't exist.
        </Text>
        <Link href="/" asChild>
          <TouchableOpacity className="mt-6 bg-primary px-6 py-3 rounded-xl">
            <Text className="text-white font-bold">Go Home</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </>
  );
}
