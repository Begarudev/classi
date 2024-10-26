import CustomBottomSheet from "@/components/BottomSheet";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import scheduleData from "../../assets/schedule.json"; // Adjust the path if needed

interface SectionItem {
  section: string;
  instructor: string;
  room: string;
  days_hours: string;
}

interface CourseItem {
  course_title: string;
  sections: SectionItem[];
}

interface ScheduleData {
  [key: string]: CourseItem;
}

const hourToTimeMap = {
  1: 8,
  2: 9,
  3: 10,
  4: 11,
  5: 12,
  6: 13,
  7: 14,
  8: 15,
  9: 16,
  10: 17,
};

const dayMap = {
  M: 1, // Monday
  T: 2, // Tuesday
  W: 3, // Wednesday
  Th: 4, // Thursday
  F: 5, // Friday
  S: 6, // Saturday
  Su: 0, // Sunday
};

const IndexAppScreen: React.FC = () => {
  const [searchRoom, setSearchRoom] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay());
  const [selectedHour, setSelectedHour] = useState<number>(
    new Date().getHours()
  );

  const flattenScheduleData = () => {
    const flattened: Array<{ courseCode: string; section: SectionItem }> = [];
    Object.keys(scheduleData).forEach((courseCode) => {
      const course = (scheduleData as ScheduleData)[courseCode];
      course.sections.forEach((section) => {
        flattened.push({ courseCode, section });
      });
    });
    return flattened;
  };

  const filterOngoingClasses = () => {
    return flattenScheduleData().filter((item) => {
      const { days_hours } = item.section;

      // Split the "days_hours" field to handle multiple days and hours
      const [daysPart, hoursPart] = days_hours.split(/(?<=\D) (?=\d)/);
      const dayParts = daysPart.split(" ");
      const classHours = hoursPart
        ? hoursPart
            .split(" ")
            .map(
              (h) =>
                hourToTimeMap[parseInt(h, 10) as keyof typeof hourToTimeMap]
            )
        : [];

      // Check if the selected day matches any of the days in the schedule
      const isMatchingDay = dayParts.some(
        (dayAbbrev) => dayMap[dayAbbrev as keyof typeof dayMap] === selectedDay
      );

      // Check if the selected hour is within the scheduled hours
      return isMatchingDay && classHours.includes(selectedHour);
    });
  };

  const searchByRoom = (room: string) => {
    return filterOngoingClasses().filter((item) =>
      item.section.room.includes(room)
    );
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <Text style={styles.headerText}>Class Schedule</Text>

      {/* Room Search Input */}
      <View style={styles.searchInput}>
        <TextInput
          placeholder="Search by room"
          placeholderTextColor="#888"
          value={searchRoom}
          onChangeText={(text) => setSearchRoom(text)}
          style={{ color: "white", flex: 1 }}
          // style={styles.searchInput}
        />

        <TouchableOpacity
          onPress={() => {
            <CustomBottomSheet />;
          }}
        >
          <MaterialCommunityIcons
            name="filter-outline"
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </View>

      {/* Day Selector */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "column", flex: 1 }}>
          <Text style={styles.filterLabel}>Select Day:</Text>
          <Picker
            dropdownIconColor={"#fff"}
            mode="dropdown"
            selectedValue={selectedDay}
            onValueChange={(value) => setSelectedDay(value)}
            style={styles.picker}
            itemStyle={{
              color: "green",
              backgroundColor: "#444",
              borderRadius: 8,
              borderColor: "#555",
              borderWidth: 1,
            }}
          >
            <Picker.Item
              label="Sunday"
              value={0}
              color="green"
              style={{
                color: "green",
                backgroundColor: "#444",
              }}
            />
            <Picker.Item label="Monday" value={1} />
            <Picker.Item label="Tuesday" value={2} />
            <Picker.Item label="Wednesday" value={3} />
            <Picker.Item label="Thursday" value={4} />
            <Picker.Item label="Friday" value={5} />
            <Picker.Item label="Saturday" value={6} />
          </Picker>
        </View>
        <View style={{ width: 16 }} />
        {/* Hour Selector */}
        <View style={{ flexDirection: "column", flex: 1 }}>
          <Text style={styles.filterLabel}>Select Hour:</Text>
          <Picker
            selectedValue={selectedHour}
            onValueChange={(value) => setSelectedHour(value)}
            style={styles.picker}
          >
            {Object.keys(hourToTimeMap).map((key) => (
              <Picker.Item
                key={key}
                label={`Hour ${key}`}
                value={
                  hourToTimeMap[parseInt(key, 10) as keyof typeof hourToTimeMap]
                } // Cast key to number here
              />
            ))}
          </Picker>
        </View>
      </View>

      
      {/* Display the list of classes in the searched room */}
      <FlatList
        data={searchByRoom(searchRoom)}
        keyExtractor={(item, index) => `${item.courseCode}-${index}`}
        ListHeaderComponent={() =>
          searchRoom ? (
            <Text style={styles.sectionTitle}>Filtered Classes</Text>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={styles.classCard}>
            <Text style={styles.classText}>
              {item.courseCode}: {item.section.section}
            </Text>
            <Text style={styles.courseTitleText}>
              {(scheduleData as ScheduleData)[item.courseCode].course_title}
            </Text>
            <Text style={styles.instructorText}>
              Room {item.section.room}, Instructor: {item.section.instructor}
            </Text>
            <Text style={styles.daysHoursText}>
              Days & Hours: {item.section.days_hours}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    flex: 1,
    paddingHorizontal: 16,
  },
  headerText: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  searchInput: {
    backgroundColor: "#333",
    color: "white",
    padding: 12,
    borderRadius: 8,
    borderColor: "#555",
    borderWidth: 1,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  filterLabel: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 8,
  },
  picker: {
    backgroundColor: "#444",
    color: "#fff",
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 12,
  },
  classCard: {
    backgroundColor: "#222",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderColor: "#444",
    borderWidth: 1,
  },
  classText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  courseTitleText: {
    color: "#ddd",
    fontSize: 16,
    marginBottom: 4,
  },
  instructorText: {
    color: "#bbb",
    fontSize: 16,
    marginBottom: 4,
  },
  daysHoursText: {
    color: "#aaa",
    fontSize: 14,
  },
});

export default IndexAppScreen;
