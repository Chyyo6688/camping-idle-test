// Editable onboarding steps and standalone guide content.

const ONBOARDING_FIRST_GEAR_ID = "sealChair";

const onboardingSteps = [
  {
    id: "gather",
    title: "Start with Gather"
  },
  {
    id: "fire",
    title: "Feed the fire"
  },
  {
    id: "warmth",
    title: "Watch Warmth"
  },
  {
    id: "cozy",
    title: "Earn Cozy Points"
  },
  {
    id: "shop",
    title: "Open Shop"
  },
  {
    id: "chair",
    title: "Buy the first chair"
  },
  {
    id: "comfort",
    title: "Comfort makes it faster"
  }
];

const standaloneGuides = {
  tapInteraction: {
    id: "tapInteraction",
    title: "Tap camp items",
    stepLabel: "Guide +",
    primaryLabel: "Got it",
    body: "Some camp items can be tapped to interact with. Try tapping this item."
  },
  buildMode: {
    id: "buildMode",
    title: "Build Mode Unlocked",
    stepLabel: "Build",
    primaryLabel: "Got it",
    body: "Tap the Build button to rearrange your camp. Drag items to move them, use the ↑ ↓ buttons to change front/back layering, then tap Done when you're finished."
  }
};
