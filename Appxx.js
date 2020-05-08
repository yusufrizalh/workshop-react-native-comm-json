import React from 'react';
import { ApplicationProvider, Layout } from "@ui-kitten/components";
import { mapping, light as lightTheme } from "@eva-design/eva";
import { FlatList, View, Text } from 'react-native';

const mockData = [
  { id: "1", text: "Belajar" },
  { id: "2", text: "FlatList" },
  { id: "3", text: "Expo 💙" }
];

const HalamanMuka = () => (
  <View
    style={{
      flex: 1,
      paddingHorizontal: 20,
      paddingVertical: 20,
      marginTop: 40,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <FlatList
      data={mockData}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Text style={{ fontSize: 24 }}>
          {item.id} - {item.text}
        </Text>
      )}
    />
  </View>
);

const App = () => (
  <ApplicationProvider mapping={mapping} theme={lightTheme}>
    <HalamanMuka />
  </ApplicationProvider>
);

export default App;
