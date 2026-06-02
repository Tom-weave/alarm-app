import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  alarms: defineTable({
    time: v.string(),
    enabled: v.boolean(),
  }),
});
