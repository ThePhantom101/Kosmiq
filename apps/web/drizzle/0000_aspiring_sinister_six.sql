CREATE TYPE "public"."event_type" AS ENUM('career', 'health', 'relationship', 'finance', 'travel', 'spiritual', 'life_event');--> statement-breakpoint
CREATE TYPE "public"."subscription_tier" AS ENUM('free', 'pro', 'god_tier');--> statement-breakpoint
CREATE TABLE "charts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"planetary_degrees" jsonb NOT NULL,
	"shodashvarga" jsonb NOT NULL,
	"planetary_strengths" jsonb NOT NULL,
	"ashtakavarga" jsonb NOT NULL,
	"last_calculated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chronicles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"event_name" text NOT NULL,
	"event_timestamp" timestamp NOT NULL,
	"event_type" "event_type" NOT NULL,
	"bio_data_snapshot" jsonb,
	"ai_validation_score" numeric(5, 2)
);
--> statement-breakpoint
CREATE TABLE "compatibility" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"primary_profile_id" uuid NOT NULL,
	"secondary_profile_id" uuid NOT NULL,
	"relationship_type" text NOT NULL,
	"score_data" jsonb NOT NULL,
	"group_id" uuid
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"profile_id" uuid,
	"interaction_type" text NOT NULL,
	"payload" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "embeddings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reference_id" uuid NOT NULL,
	"reference_type" text NOT NULL,
	"vector" vector(768) NOT NULL,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "knowledge_base" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source" text NOT NULL,
	"reference_key" text,
	"content" text NOT NULL,
	"tags" jsonb NOT NULL,
	"remedies" jsonb
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"dob" text NOT NULL,
	"tob" text NOT NULL,
	"lat" numeric(10, 7) NOT NULL,
	"long" numeric(10, 7) NOT NULL,
	"tz_offset" integer NOT NULL,
	"ayanamsa_offset" numeric(10, 7),
	"biometric_hash" text,
	"chart_style" text DEFAULT 'north_indian' NOT NULL,
	"is_guest" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"subscription_tier" "subscription_tier" DEFAULT 'free' NOT NULL,
	"mandala_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "charts" ADD CONSTRAINT "charts_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chronicles" ADD CONSTRAINT "chronicles_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compatibility" ADD CONSTRAINT "compatibility_primary_profile_id_profiles_id_fk" FOREIGN KEY ("primary_profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compatibility" ADD CONSTRAINT "compatibility_secondary_profile_id_profiles_id_fk" FOREIGN KEY ("secondary_profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;