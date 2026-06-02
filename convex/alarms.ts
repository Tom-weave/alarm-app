import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const alarms = await ctx.db.query("alarms").collect();
    return alarms[0] ?? null;
  },
});

export const set = mutation({
  args: { time: v.string(), enabled: v.boolean() },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("alarms").collect();
    if (existing[0]) {
      await ctx.db.patch(existing[0]._id, args);
    } else {
      await ctx.db.insert("alarms", args);
    }
  },
});

export const clear = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("alarms").collect();
    for (const a of existing) {
      await ctx.db.delete(a._id);
    }
  },
});
