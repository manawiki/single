import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../access/user";

export const OperatorTags: CollectionConfig = {
   slug: "operatorTags",
   labels: { singular: "operatortag", plural: "operatortags" },
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
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};
