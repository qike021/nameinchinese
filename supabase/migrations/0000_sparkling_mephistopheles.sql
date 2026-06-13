CREATE TABLE "auth_users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text
);
--> statement-breakpoint
CREATE TABLE "generated_names" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid,
	"user_id" uuid,
	"english_name" text NOT NULL,
	"input_profile" jsonb,
	"bazi_result" jsonb,
	"names" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "name_mappings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"english_name" text NOT NULL,
	"origin" text,
	"original_meaning" text,
	"chinese_characters" jsonb,
	"suggested_names" jsonb,
	"avoid" jsonb,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "name_mappings_english_name_unique" UNIQUE("english_name")
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"tier" text NOT NULL,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'usd',
	"status" text DEFAULT 'pending',
	"payment_method" text,
	"payment_id" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "platform_settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text DEFAULT '' NOT NULL,
	"description" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "poetry" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dynasty" text NOT NULL,
	"author" text NOT NULL,
	"work" text NOT NULL,
	"quote" text NOT NULL,
	"characters" text[],
	"themes" text[],
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tattoo_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"requested_text" text NOT NULL,
	"review_result" jsonb,
	"status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "generated_names" ADD CONSTRAINT "generated_names_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "generated_names" ADD CONSTRAINT "generated_names_user_id_auth_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_auth_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tattoo_reviews" ADD CONSTRAINT "tattoo_reviews_user_id_auth_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_users"("id") ON DELETE no action ON UPDATE no action;