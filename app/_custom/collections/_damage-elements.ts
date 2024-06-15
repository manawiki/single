import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";
export const _DamageElements: CollectionConfig = {
  slug: "_damage-elements",
  labels: { singular: "_damage-element", plural: "_damage-elements" },
  admin: {
    group: "Custom",
    useAsTitle: "name",
  },
  access: {
    create: isStaff, //udpate in future to allow site admins as well
    read: () => true,
    update: isStaff, //udpate in future to allow site admins as well
    delete: isStaff, //udpate in future to allow site admins as well
  },
  fields: [
    {
      name: "id",
      type: "text",
    },
    {
      name: "data_key",
      type: "text",
    },
    {
      name: "name",
      type: "text",
    },
    {
      name: "desc",
      type: "textarea",
    },
    {
      name: "hp_revise",
      type: "number",
    },
    {
      name: "armor_revise",
      type: "number",
    },
    {
      name: "shield_revise",
      type: "number",
    },
    {
      name: "icon_name",
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
    },
  ],
};