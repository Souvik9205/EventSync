-- +goose Up
-- +goose StatementBegin
-- ENUMS
CREATE TYPE "OTP_Type" AS ENUM ('UserOtp', 'EverntOtp', 'RegisterOtp');

-- USER TABLE
CREATE TABLE "User" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    name TEXT,
    "imgURL" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- EVENT TABLE
CREATE TABLE "Event" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    tickets INT,
    price INT NOT NULL DEFAULT 0,
    organization TEXT NOT NULL,
    "orgImgURL" TEXT NOT NULL,
    "dateTime" TIMESTAMP NOT NULL,
    location TEXT NOT NULL,

    "createdById" TEXT NOT NULL,
    "additionalData" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_event_creator FOREIGN KEY ("createdById")
        REFERENCES "User"(id)
);

-- EVENT OWNERSHIP (MANY-TO-MANY: admins)
CREATE TABLE "_EventOwnership" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    UNIQUE ("A", "B"),
    FOREIGN KEY ("A") REFERENCES "Event"(id) ON DELETE CASCADE,
    FOREIGN KEY ("B") REFERENCES "User"(id) ON DELETE CASCADE
);

-- USER EVENTS (MANY-TO-MANY reverse relation)
CREATE TABLE "_UserEvents" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    UNIQUE ("A", "B"),
    FOREIGN KEY ("A") REFERENCES "User"(id) ON DELETE CASCADE,
    FOREIGN KEY ("B") REFERENCES "Event"(id) ON DELETE CASCADE
);

-- CUSTOM FIELDS
CREATE TABLE "CustomField" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "eventId" TEXT NOT NULL,
    "fieldName" TEXT NOT NULL,
    "fieldType" TEXT NOT NULL DEFAULT 'text',

    FOREIGN KEY ("eventId") REFERENCES "Event"(id)
);

-- ATTENDANCE
CREATE TABLE "Attendance" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "user" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "timestamp" TIMESTAMP NOT NULL DEFAULT NOW(),
    fields JSONB NOT NULL,
    verified BOOLEAN NOT NULL,

    FOREIGN KEY ("eventId") REFERENCES "Event"(id)
);

-- REVIEW
CREATE TABLE "Review" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "eventId" TEXT NOT NULL UNIQUE,
    participants INT NOT NULL,
    "Review" DECIMAL NOT NULL,

    FOREIGN KEY ("eventId") REFERENCES "Event"(id)
);

-- OTP
CREATE TABLE "Otp" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "user" TEXT NOT NULL,
    otp TEXT NOT NULL,
    data JSONB NOT NULL,
    type "OTP_Type" NOT NULL,
    "expiresAt" TIMESTAMP NOT NULL
);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE User;
DROP TABLE Evert;
DROP TABLE CustomField;
DROP TABLE Attendance;
DROP TABLE Review;
DROP TABLE otp;
-- +goose StatementEnd
