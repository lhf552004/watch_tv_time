import React, { useEffect, useState } from "react";
import { Box, Text, Button, Input, Flex, VStack } from "@chakra-ui/react";
import { doc, updateDoc } from "firebase/firestore";
import { useToast } from "@chakra-ui/react";
import { useFirestore } from "reactfire";

function ScheduleForm({ setIsOpen, values }) {
  const [schedule, setSchedule] = useState(values.schedule);
  const toast = useToast();
  const firestore = useFirestore();
  useEffect(() => {
    // Ensure all days are present in the schedule
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const completeSchedule = daysOfWeek.reduce((acc, day) => {
      acc[day] = schedule[day] || [];
      return acc;
    }, {});

    setSchedule(completeSchedule);
  }, []);

  const handleTimeChange = (day, index, type, value) => {
    const updatedDay = [...schedule[day]];
    updatedDay[index][type] = value;
    setSchedule((prev) => ({
      ...prev,
      [day]: updatedDay,
    }));
  };

  const handleAddTime = (day) => {
    const updatedDay = [...schedule[day], { startTime: "", endTime: "" }];
    setSchedule((prev) => ({
      ...prev,
      [day]: updatedDay,
    }));
  };

  const handleRemoveTime = (day, index) => {
    const updatedDay = [...schedule[day]];
    updatedDay.splice(index, 1);
    setSchedule((prev) => ({
      ...prev,
      [day]: updatedDay,
    }));
  };

  const handleSubmit = async () => {
    if (values.id) {
      try {
        values = { ...values, schedule };
        console.log(values);
        setIsOpen(false);
        const docRef = doc(firestore, `computers/${values.id}`);
        await updateDoc(docRef, values);
        toast({
          title: "Update computer schedule successfully.",
          status: "success",
        });
      } catch (error) {
        console.log(error);
        toast({
          title: `Update computer schedule failed with error: ${error}`,
          status: "error",
        });
      }
      return;
    }
  };

  return (
    <VStack spacing={4} width="100%">
      {Object.entries(schedule).map(([day, times]) => (
        <Box key={day}>
          <Text fontWeight="bold">{day}</Text>
          {times.map((time, index) => (
            <Flex
              key={index}
              justifyContent="space-between"
              alignItems="center"
              my={2}
            >
              <Input
                placeholder="Start Time"
                value={time.startTime}
                onChange={(e) =>
                  handleTimeChange(day, index, "startTime", e.target.value)
                }
              />
              <Text mx={2}>to</Text>
              <Input
                placeholder="End Time"
                value={time.endTime}
                onChange={(e) =>
                  handleTimeChange(day, index, "endTime", e.target.value)
                }
              />
              <Button
                onClick={() => handleRemoveTime(day, index)}
                size="sm"
                colorScheme="red"
                ml={2}
              >
                X
              </Button>
            </Flex>
          ))}
          <Button
            onClick={() => handleAddTime(day)}
            size="sm"
            colorScheme="teal"
          >
            Add Time
          </Button>
        </Box>
      ))}
      <Button onClick={handleSubmit} colorScheme="blue">
        Submit
      </Button>
    </VStack>
  );
}

export default ScheduleForm;
