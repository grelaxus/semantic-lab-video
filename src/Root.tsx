import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { CopilotDemo } from "./CopilotDemo";
import { UberRideFlow, uberRideFlowSchema } from "./components/scenes";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AIBuilderSpaceIntro"
        component={MyComposition}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="CopilotDemo"
        component={CopilotDemo}
        // Duration: 4s + 3s + 6s + 5s + 3s = 21s, minus transitions (4 * 0.5s = 2s) = 19s @ 30fps
        durationInFrames={570}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="UberRideFlow"
        component={UberRideFlow}
        durationInFrames={660}
        fps={30}
        width={1080}
        height={1080}
        schema={uberRideFlowSchema}
        defaultProps={{
          chatMessages: [
            { text: "Hey! Can you order an Uber for me?", isSender: false, delay: 0, typingDuration: 40, typingSpeed: 2 },
            { text: "Sure! Where to?", isSender: true, delay: 30, typingDuration: 20 },
            { text: "Birch Coffee", isSender: false, delay: 10, typingDuration: 30 },
            { text: "Got it! Ordering now...", isSender: true, delay: 10, typingDuration: 10 },
          ],
          pickupLocation: "Blue Bottle Coffee",
          destination: "Birch Coffee",
          ridePrice: "$1.99",
          driverName: "UberX",
          mapDuration: 90,
        }}
      />
    </>
  );
};
