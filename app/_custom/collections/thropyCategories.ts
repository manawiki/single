import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

export const ThropyCategories: CollectionConfig = {
   slug: "thropyCategories",
   labels: { singular: "thropyCategories", plural: "thropyCategory" },
   admin: {
      group: "Custom",
      useAsTitle: "name",
   },
   access: {
      create: isStaff,
      read: () => true,
      update: isStaff,
      delete: isStaff,
   },
   fields: [
      {
         name: "id",
         type: "text",
      },
      {
         name: "name",
         type: "text",
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};
