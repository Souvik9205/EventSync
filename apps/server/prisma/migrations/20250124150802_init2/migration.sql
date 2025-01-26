-- CreateTable
CREATE TABLE "_EventOwnership" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EventOwnership_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_EventOwnership_B_index" ON "_EventOwnership"("B");

-- AddForeignKey
ALTER TABLE "_EventOwnership" ADD CONSTRAINT "_EventOwnership_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventOwnership" ADD CONSTRAINT "_EventOwnership_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
