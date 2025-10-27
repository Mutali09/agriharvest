/*
  Warnings:

  - You are about to drop the column `sellerEmail` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `sellerEmail` on the `Product` table. All the data in the column will be lost.
  - Added the required column `sellerMobile` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "buyerName" TEXT NOT NULL,
    "buyerEmail" TEXT NOT NULL,
    "buyerPhone" TEXT,
    "message" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sellerMobile" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Order_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("buyerEmail", "buyerName", "buyerPhone", "createdAt", "id", "message", "productId", "sellerMobile") SELECT "buyerEmail", "buyerName", "buyerPhone", "createdAt", "id", "message", "productId", COALESCE("sellerEmail", "") FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "unit" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "category" TEXT,
    "location" TEXT NOT NULL,
    "imageUrl" TEXT,
    "sellerMobile" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Product" ("category", "createdAt", "description", "id", "imageUrl", "location", "price", "quantity", "title", "unit", "updatedAt", "sellerMobile") SELECT "category", "createdAt", "description", "id", "imageUrl", "location", "price", "quantity", "title", "unit", "updatedAt", COALESCE("sellerEmail", "") FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
