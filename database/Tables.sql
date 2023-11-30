create table "users"(
 "id" varchar not null,
 "email" varchar not null,
 "username" varchar null,
 "createdat" varchar null,
 "updatedat" varchar null,
 primary key ("id")
);
create table "logged_users"(
 "user_id" varchar not null,
 "token" varchar not null,
 "timestamp" bigint not null,
 primary key ("user_id")
);
create table "passwords"(
"user_id" varchar not null,
"password" varchar not null,
"email" varchar not null,
"updated_at" bigint not null,
 primary key ("user_id")
);
create table "message"(
 "id" varchar not null,
 "user_id" varchar not null,
 "message" varchar not null,
 "timestamp" bigint not null,
 primary key ("id")
);
create table "chatroom"(
    "id" serial not null,
    "room_name" varchar not null,
    primary key ("id")
);
insert into "chatroom" ("room_name") values ('general');
ALTER TABLE "message" ADD COLUMN "room_name" VARCHAR NOT NULL;
ALTER TABLE "message" ADD COLUMN "sender_name" VARCHAR NOT NULL;