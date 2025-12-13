CREATE TABLE "visitors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ip_address" text NOT NULL,
	"user_agent" text,
	"first_visit" timestamp DEFAULT now() NOT NULL,
	"last_visit" timestamp DEFAULT now() NOT NULL,
	"visit_count" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "visitors_ip_address_unique" UNIQUE("ip_address")
);
