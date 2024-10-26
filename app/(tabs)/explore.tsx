import React, { useEffect, useState } from "react";
import { FlatList, Text, TextInput, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Define types for your data structure
interface ClassItem {
  courseCode: string;
  courseTitle: string;
  credits: string;
  instructor: string;
  room: string;
  days: string[];
  hours: number[];
  midsem: string;
  compre: string;
}

const IndexAppScreen: React.FC = () => {
  // JSON Data (this would be imported or fetched in real use case)
  const scheduleData: ClassItem[] = [
    {
      courseCode: "PHY F417",
      courseTitle: "EXPT METHODS OF PHYSICS",
      credits: "3 1 4",
      instructor: "SRIJATA DEY",
      room: "6107",
      days: ["T", "Th", "F"],
      hours: [16], // 16 for 4 PM
      midsem: "03/10 FN1",
      compre: "02/12 FN",
    },
    {
      courseCode: "PHY F421",
      courseTitle: "ADV QUANTUM MECHANICS",
      credits: "3 1 4",
      instructor: "ARPAN DAS",
      room: "6108",
      days: ["T", "Th", "F"],
      hours: [16], // 16 for 4 PM
      midsem: "03/10 FN1",
      compre: "02/12 FN",
    },
    // Add more data as needed...
  ];

  const [searchRoom, setSearchRoom] = useState<string>("");
  const [currentClasses, setCurrentClasses] = useState<ClassItem[]>([]);

  // Find classes currently happening based on the current time and day
  const getCurrentClasses = () => {
    const now = new Date();
    const currentDay = ["S", "M", "T", "W", "Th", "F", "S"][now.getDay()];
    const currentHour = now.getHours();

    // Filter classes happening at this time
    const classesNow = scheduleData.filter((classItem) => {
      return (
        classItem.days.includes(currentDay) &&
        classItem.hours.includes(currentHour)
      );
    });

    setCurrentClasses(classesNow);
  };

  // Trigger the check for current classes whenever the component mounts
  useEffect(() => {
    getCurrentClasses();
  }, []);

  // Search by room functionality
  const searchByRoom = (room: string) => {
    return scheduleData.filter((classItem) => classItem.room.includes(room));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>Class Schedule</Text>

      {/* Room Search Input */}
      <TextInput
        placeholder="Search by room"
        placeholderTextColor="#888" // Ensures the placeholder text is visible
        value={searchRoom}
        onChangeText={(text) => setSearchRoom(text)}
        style={styles.searchInput}
      />

      {/* Display the list of classes in the searched room */}
      <FlatList
        data={searchByRoom(searchRoom)}
        keyExtractor={(item) => item.courseCode}
        ListHeaderComponent={() =>
          searchRoom ? <Text style={styles.sectionTitle}>Search Results</Text> : null
        }
        renderItem={({ item }) => (
          <View style={styles.classCard}>
            <Text style={styles.classText}>
              {item.courseTitle}
            </Text>
            <Text style={styles.instructorText}>
              Room {item.room}, Instructor: {item.instructor}
            </Text>
          </View>
        )}
      />

      {/* Display classes currently happening */}
      <Text style={styles.sectionTitle}>Currently Happening Classes</Text>
      <FlatList
        data={currentClasses}
        keyExtractor={(item) => item.courseCode}
        renderItem={({ item }) => (
          <View style={styles.classCard}>
            <Text style={styles.classText}>
              {item.courseTitle}
            </Text>
            <Text style={styles.instructorText}>
              Happening in room {item.room}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black", // Dark background
    flex: 1,
    padding: 16,
  },
  headerText: {
    color: "white", // Ensures the text is visible on a black background
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  searchInput: {
    backgroundColor: "#333", // Dark input background
    color: "white", // White text input for visibility
    padding: 12,
    borderRadius: 8,
    borderColor: "#555", // Subtle border for contrast
    borderWidth: 1,
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#fff", // Section titles in white
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 12,
  },
  classCard: {
    backgroundColor: "#222", // Card-like appearance for each class
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderColor: "#444",
    borderWidth: 1,
  },
  classText: {
    color: "#fff", // White class title
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  instructorText: {
    color: "#bbb", // Slightly lighter gray for the instructor/room text
    fontSize: 16,
  },
});

export default IndexAppScreen;
