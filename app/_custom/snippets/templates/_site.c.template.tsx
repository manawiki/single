import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { gql } from "graphql-request";

import { fetchList } from "~/routes/_site+/c_+/$collectionId/utils/fetchList.server";
import { customListMeta } from "~/routes/_site+/c_+/$collectionId/utils/listMeta";
import { List } from "~/routes/_site+/c_+/_components/List";

export { customListMeta as meta };

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const { list } = await fetchList({
      request,
      gql: {
         query: QUERY,
         variables: {},
      },
      payload,
      user,
   });
   return json({ list });
}

export default function ListPage() {
   const { list } = useLoaderData<typeof loader>();

   return (
      <List>
         <div></div>
      </List>
   );
}

const QUERY = gql`
   query {
      PluralCollectionName(limit: 100, sort: "name") {
         docs {
            id
            name
            slug
            element {
               id
               icon {
                  url
               }
            }
         }
      }
   }
`;
