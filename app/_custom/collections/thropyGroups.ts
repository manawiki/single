import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

export const ThropyGroups: CollectionConfig = {
   slug: "thropyGroups",
   labels: { singular: "thropyGroup", plural: "thropyGroups" },
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
         name: "category",
         type: "relationship",
         relationTo: "thropyCategories",
      },
      {
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};