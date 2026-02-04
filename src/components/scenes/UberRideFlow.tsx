import { AbsoluteFill, Sequence } from "remotion";
import { z } from "zod";
import { ChatScene } from "./uber/ChatScene";
import { SearchScene } from "./uber/SearchScene";
import { RequestingScene } from "./uber/RequestingScene";
import { MapScene } from "./uber/MapScene";
import { OutroScene } from "./uber/OutroScene";

export const uberRideFlowSchema = z.object({
  chatMessages: z.array(
    z.object({
      text: z.string(),
      isSender: z.boolean(),
      delay: z.number(), // Frames to wait AFTER previous message finishes before starting this one
      typingDuration: z.number().optional(), // Frames to show "..." typing indicator for grey user (default: 20). Only applies to received messages (isSender: false)
      typingSpeed: z.number().optional(), // Frames per character for typing effect for blue user (default: 2). Only applies to sent messages (isSender: true)
    })
  ),
  pickupLocation: z.string().default("Blue Bottle Coffee"),
  destination: z.string().default("Birch Coffee"),
  ridePrice: z.string().default("$1.99"),
  driverName: z.string().default("UberX"),
  mapDuration: z.number().default(90), // Frames for car movement
});

export type UberRideFlowProps = z.infer<typeof uberRideFlowSchema>;

export const UberRideFlow: React.FC<UberRideFlowProps> = ({
  chatMessages = [
    { text: "Hey! Can you order an Uber for me?", isSender: false, delay: 130 },
    { text: "Sure! Where to?", isSender: true, delay: 30 },
    { text: "Birch Coffee", isSender: false, delay: 60 },
    { text: "Got it! Ordering now...", isSender: true, delay: 90 },
  ],
  pickupLocation = "Blue Bottle Coffee",
  destination = "Birch Coffee",
  ridePrice = "$1.99",
  driverName = "UberX",
  mapDuration = 90,
}) => {
  // Scene timings in frames (30fps)
  const CHAT_START = 0;
  const CHAT_END = 270; // 9 seconds
  const SEARCH_START = 270;
  const SEARCH_END = 330; // 11 seconds
  const REQUESTING_START = 330;
  const REQUESTING_END = 450; // 15 seconds
  const MAP_START = 450;
  const MAP_END = 540; // 18 seconds
  const OUTRO_START = 540;
  const OUTRO_END = 660; // 22 seconds

  return (
    <AbsoluteFill className="bg-black">
      {/* Scene 1: Chat (0-210 frames / 0-7s) */}
      <Sequence from={CHAT_START} durationInFrames={CHAT_END - CHAT_START}>
        <ChatScene chatMessages={chatMessages} />
      </Sequence>

      {/* Scene 2: Search UI (210-330 frames / 7-11s) */}
      <Sequence
        from={SEARCH_START}
        durationInFrames={SEARCH_END - SEARCH_START}
      >
        <SearchScene
          pickupLocation={pickupLocation}
          destination={destination}
        />
      </Sequence>

      {/* Scene 3: Requesting (330-450 frames / 11-15s) */}
      <Sequence
        from={REQUESTING_START}
        durationInFrames={REQUESTING_END - REQUESTING_START}
      >
        <RequestingScene
          driverName={driverName}
          ridePrice={ridePrice}
        />
      </Sequence>

      {/* Scene 4: Map (450-540 frames / 15-18s) */}
      <Sequence from={MAP_START} durationInFrames={MAP_END - MAP_START}>
        <MapScene mapDuration={mapDuration} />
      </Sequence>

      {/* Scene 5: Outro (540-660 frames / 18-22s) */}
      <Sequence from={OUTRO_START} durationInFrames={OUTRO_END - OUTRO_START}>
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};
