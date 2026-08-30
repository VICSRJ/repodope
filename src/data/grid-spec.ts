export type GridVariation = {
  id: number;
  camera: string;
  light: string;
  crop: string;
  texture: string;
  perspective: string;
  rotation: string;
};

const cameras = [
  "front portrait",
  "low angle",
  "high angle",
  "extreme close-up",
  "wide negative space",
  "three-quarter left",
  "three-quarter right",
  "near frontal",
  "compressed telephoto",
  "distant silhouette",
];

const lights = [
  "hard left light",
  "hard right light",
  "top light",
  "low side light",
  "rim light",
  "split light",
  "soft frontal light",
  "deep shadow",
  "backlit glow",
  "near-black light",
];

const crops = [
  "full monolith",
  "upper crop",
  "lower crop",
  "text-led crop",
  "stone detail",
  "tight portrait",
  "wide frame",
  "edge crop",
  "center crop",
  "asymmetric crop",
];

const textures = [
  "fine cracks",
  "deep fractures",
  "dusty stone",
  "chipped surface",
  "wet stone",
  "powdered concrete",
  "rough volcanic grain",
  "eroded surface",
  "scratched stone",
  "heavy weathering",
];

const perspectives = [
  "natural perspective",
  "compressed perspective",
  "strong foreshortening",
  "subtle lens distortion",
  "architectural perspective",
  "shallow depth",
  "deep perspective",
  "dramatic vanishing lines",
  "flat documentary view",
  "cinematic perspective",
];

const rotations = [
  "0 degrees",
  "3 degrees clockwise",
  "5 degrees clockwise",
  "8 degrees clockwise",
  "2 degrees counter-clockwise",
  "6 degrees counter-clockwise",
  "10 degrees clockwise",
  "4 degrees counter-clockwise",
  "12 degrees clockwise",
  "near vertical",
];

export const gridVariations: GridVariation[] = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  camera: cameras[index % cameras.length],
  light: lights[(index * 3) % lights.length],
  crop: crops[(index * 7) % crops.length],
  texture: textures[(index * 5) % textures.length],
  perspective: perspectives[(index * 2) % perspectives.length],
  rotation: rotations[(index * 9) % rotations.length],
}));

export const gridSpec = {
  rows: 10,
  columns: 10,
  totalFrames: 100,
  exactText: ["5110", "AE", "vics"],
  background: "absolute black",
  subject: "dark weathered stone monolith",
  palette: ["black", "charcoal", "dark gray", "white", "burnt orange"],
  frameRule: "same subject and exact text; vary camera, lighting, crop, perspective and texture",
} as const;
