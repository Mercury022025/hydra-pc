CREATE TABLE "chat_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"display_name" text NOT NULL,
	"avatar_url" text,
	"is_available" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"user_id" uuid NOT NULL,
	"role_id" integer NOT NULL,
	CONSTRAINT "user_roles_user_id_role_id_pk" PRIMARY KEY("user_id","role_id")
);
--> statement-breakpoint
ALTER TABLE "users" RENAME TO "user_profiles";--> statement-breakpoint
ALTER TABLE "user_profiles" RENAME COLUMN "id" TO "user_id";--> statement-breakpoint
ALTER TABLE "user_profiles" RENAME COLUMN "name" TO "full_name";--> statement-breakpoint
ALTER TABLE "user_profiles" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "username" text;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "avatar_url" text;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "bio" text;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "created_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" DROP COLUMN "age";--> statement-breakpoint
ALTER TABLE "user_profiles" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_username_unique" UNIQUE("username");