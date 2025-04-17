import { pgTable, text, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Schema pentru conținutul site-ului
export const siteContent = pgTable("site_content", {
  id: serial("id").primaryKey(),
  contentKey: varchar("content_key", { length: 100 }).notNull().unique(),
  contentName: varchar("content_name", { length: 255 }).notNull(),
  contentType: varchar("content_type", { length: 50 }).notNull(),
  contentValue: text("content_value").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertSiteContentSchema = createInsertSchema(siteContent).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type InsertSiteContent = z.infer<typeof insertSiteContentSchema>;
export type SiteContent = typeof siteContent.$inferSelect;

// Enumerare pentru tipurile de conținut
export enum ContentType {
  HERO = 'hero',
  TEXT = 'text',
  IMAGE = 'image',
  SECTION_TITLE = 'section-title'
}