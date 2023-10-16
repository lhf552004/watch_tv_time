import { Box, Heading, Text, Flex, Divider } from "@chakra-ui/react";
import { Image, Link, VStack } from "@chakra-ui/react";

export default function About() {
  return (
    <Flex
      flexDirection={"column"}
      // This is a hack to make the footer stick to the bottom of the page
      justifyContent={"space-between"}
      height={"calc(100vh - 80px)"} // Calc the height of the page minus the height of the header
    >
      <Box>
        <Heading as="h1" textTransform={"uppercase"}>
          AuroraSoft
        </Heading>
        <Text>
          AuroraSoft has developed a unique system to help manage and control
          device usage time. Whether it's a laptop or a mobile app, our software
          ensures that in the specified time period, the device will be forcibly
          shut down. This is particularly helpful for ensuring focused work
          sessions or making sure children don't overuse electronic devices.
        </Text>
        <Text mt={3}>
          <Image
            src="/time-slot-management.png"
            alt="How to add time management period"
            boxSize="500px"
          />
        </Text>
        <Text fontSize="sm">Figure: How to add time management periods.</Text>
      </Box>

      <Box>
        <Heading as="h3" size="md">
          Download
        </Heading>
        <Text>
          Ready to take control of your device usage time?
          <Link
            href="https://github.com/lhf552004/watch_tv_time/releases"
            color="blue.500"
            isExternal
          >
            Click here to download our software.
          </Link>
        </Text>
      </Box>

      <Box>
        <Heading as="h3" size="md">
          About Us
        </Heading>
        <Text>
          AuroraSoft is a cutting-edge technology company, committed to
          delivering innovative solutions that cater to modern challenges. We
          recognize the growing need for digital well-being and are devoted to
          creating tools that promote balanced and healthy tech consumption. Our
          primary focus revolves around crafting software that enhances user
          experience while ensuring optimal productivity and well-being. With a
          team of passionate professionals, we're driving a new era of digital
          harmony.
        </Text>
      </Box>
    </Flex>
  );
}
