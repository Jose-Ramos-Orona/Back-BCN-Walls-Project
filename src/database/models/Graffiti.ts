import type { InferSchemaType } from "mongoose";
import { model, Schema } from "mongoose";

const graffitiSchema = new Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  author: { type: String },
  address: { type: String, required: true },
  theme: { type: String, required: true },
  description: { type: String, required: true },
});

export type GraffitiStructure = InferSchemaType<typeof graffitiSchema>;

export const Graffiti = model("Graffiti", graffitiSchema, "graffitis");
