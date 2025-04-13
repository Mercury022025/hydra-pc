ALTER TABLE "user_profiles" ALTER COLUMN "user_id" DROP IDENTITY IF EXISTS;
--> statement-breakpoint
ALTER TABLE "user_profiles" ALTER COLUMN "user_id" TYPE uuid USING "user_id"::text::uuid;
--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;