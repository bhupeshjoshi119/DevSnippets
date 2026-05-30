import { Stack } from "expo-router";
import { BottomTabs } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <BottomTabs>
        <Stack name="home" options={{ title: "Snippets" }} />
        <Stack name="favorites" options={{ title: "Favorites" }} />
        <Stack name="file-manager" options={{ title: "Files" }} />
        <Stack name="settings" options={{ title: "Settings" }} />
      </BottomTabs>
    </Stack>
  );
}