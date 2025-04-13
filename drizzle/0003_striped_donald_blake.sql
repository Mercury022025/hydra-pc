CREATE TABLE "chat_profile_interests" (
	"chat_profile_id" uuid,
	"interest_id" uuid
);
--> statement-breakpoint
CREATE TABLE "interests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"category" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_profile_interests" (
	"user_id" uuid,
	"interest_id" uuid
);
--> statement-breakpoint
ALTER TABLE "chat_profiles" ADD COLUMN "birth_date" date;--> statement-breakpoint
ALTER TABLE "chat_profiles" ADD COLUMN "gender" text;--> statement-breakpoint
ALTER TABLE "chat_profiles" ADD COLUMN "height" integer;--> statement-breakpoint
ALTER TABLE "chat_profiles" ADD COLUMN "body_type" text;--> statement-breakpoint
ALTER TABLE "chat_profiles" ADD COLUMN "hair_color" text;--> statement-breakpoint
ALTER TABLE "chat_profiles" ADD COLUMN "eye_color" text;--> statement-breakpoint
ALTER TABLE "chat_profiles" ADD COLUMN "bio" text;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "birth_date" date;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "gender" text;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "height" integer;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "body_type" text;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "hair_color" text;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "eye_color" text;--> statement-breakpoint
ALTER TABLE "chat_profile_interests" ADD CONSTRAINT "chat_profile_interests_chat_profile_id_chat_profiles_id_fk" FOREIGN KEY ("chat_profile_id") REFERENCES "public"."chat_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_profile_interests" ADD CONSTRAINT "chat_profile_interests_interest_id_interests_id_fk" FOREIGN KEY ("interest_id") REFERENCES "public"."interests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profile_interests" ADD CONSTRAINT "user_profile_interests_user_id_user_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profile_interests" ADD CONSTRAINT "user_profile_interests_interest_id_interests_id_fk" FOREIGN KEY ("interest_id") REFERENCES "public"."interests"("id") ON DELETE no action ON UPDATE no action;