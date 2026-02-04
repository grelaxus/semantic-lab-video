import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { CopilotDemo } from "./CopilotDemo";

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
    </>
  );
};
