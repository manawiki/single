import { redirect } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import type { Payload } from "payload";
import type { PaginatedDocs } from "payload/dist/database/types";
import { z } from "zod";
import { zx } from "zodix";

import type { Entry, User } from "payload/generated-types";
import { getSiteSlug } from "~/routes/_site+/_utils/getSiteSlug.server";
import { gqlRequestWithCache, gql, cacheThis } from "~/utils/cache.server";
import { gqlFormat, gqlEndpoint } from "~/utils/fetchers.server";

export async function getEntryFields({
   payload,
   params,
   request,
   user,
}: {
   payload: Payload;
   params: Params;
   request: Request;
   user: User | undefined;
}) {
   const { entryId } = zx.parseParams(params, {
      entryId: z.string(),
   });

   const { siteSlug } = await getSiteSlug(request, payload, user);

   const url = new URL(request.url).pathname;

   const collectionId = url.split("/")[2];

   const collectionData = await cacheThis(
      () =>
         payload.find({
            collection: "collections",
            where: {
               "site.slug": {
                  equals: siteSlug,
               },
               slug: {
                  equals: collectionId,
               },
            },
            draft: true,
            user,
            overrideAccess: false,
         }),
      `collection-${siteSlug}-${collectionId}`,
   );

   const collection = collectionData.docs[0];

   //Check if customDatabase is selected
   if (collection?.customDatabase) {
      const label = gqlFormat(collection?.slug, "list");

      const entryQuery = gql`
      query ($entryId: String!) {
         entryData: ${label}(
               where: { OR: [{ slug: { equals: $entryId } }, { id: { equals: $entryId } }] }
            ) {
            docs {
               id
               slug
               name
               icon {
                  id
                  url
               }
            }
         }
      }
      `;

      const endpoint = gqlEndpoint({
         siteSlug: collection.site.slug,
      });

      const { entryData }: { entryData: PaginatedDocs<Entry> } =
         await gqlRequestWithCache(endpoint, entryQuery, {
            entryId,
         });

      const entry = entryData?.docs[0];

      //If there is a slug filled out, we should redirect (ex:redirects ID to slugs)
      if (entry?.slug && entry?.slug != entryId)
         throw redirect(`/c/${collection.slug}/${entry?.slug}`, 301);

      return {
         entry: {
            ...entry,
            collectionName: collection.name,
            collectionSlug: collection?.slug,
            collectionEntity: collection?.id,
            siteId: collection?.site?.id,
            siteSlug: collection?.site?.slug,
            sections: collection?.sections,
         },
      };
   }
   //This is a core site, so we use the local api
   const coreEntryData = await cacheThis(
      () =>
         payload.find({
            collection: "entries",
            where: {
               "site.slug": {
                  equals: siteSlug,
               },
               "collectionEntity.slug": {
                  equals: collectionId,
               },
               or: [
                  {
                     slug: {
                        equals: entryId,
                     },
                  },
                  {
                     id: {
                        equals: entryId,
                     },
                  },
               ],
            },
            user,
            overrideAccess: false,
         }),
      `entries-${siteSlug}-${collectionId}-${entryId}`,
   );

   const entryData = coreEntryData.docs[0];

   //If there is a slug filled out, we should redirect to the slug page instead as the canonical
   if (entryData?.slug && entryData?.slug != entryId)
      throw redirect(`/c/${collection?.slug}/${entryData?.slug}`, 301);

   return {
      entry: {
         id: entryData?.id,
         name: entryData?.name,
         icon: { id: entryData?.icon?.id, url: entryData?.icon?.url },
         collectionName: collection?.name,
         collectionSlug: collection?.slug,
         collectionEntity: collection?.id,
         sections: collection?.sections,
         siteId: collection?.site.id,
         siteSlug: collection?.site?.slug,
      },
   };
}
