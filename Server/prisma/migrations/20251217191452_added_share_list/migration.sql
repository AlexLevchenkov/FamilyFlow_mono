-- CreateTable
CREATE TABLE `SharedLists` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ownerId` INTEGER NOT NULL,
    `recipientId` INTEGER NOT NULL,
    `listId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `SharedLists_recipientId_idx`(`recipientId`),
    UNIQUE INDEX `SharedLists_ownerId_recipientId_listId_key`(`ownerId`, `recipientId`, `listId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SharedLists` ADD CONSTRAINT `SharedLists_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SharedLists` ADD CONSTRAINT `SharedLists_recipientId_fkey` FOREIGN KEY (`recipientId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SharedLists` ADD CONSTRAINT `SharedLists_listId_fkey` FOREIGN KEY (`listId`) REFERENCES `List`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
