import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { H2 } from "~/_custom/components/custom";
import { Image } from "~/components";

export async function loader({
   context: { payload },
   params,
   request,
}: LoaderArgs) {
   const BANNERS = `
   query Banners {
      Banners(limit: 100) {
        docs {
          name
          icon {
            url
          }
          start_date
          end_date
          featured_characters {
            id
            name
            icon {
              url
            }
            rarity {
              display_number
            }
          }
          featured_light_cones {
            id
            name
            icon {
              url
            }
            rarity {
              display_number
            }
          }
        }
      }
    }
   `;
   const { data, errors } = await fetch(
      `https://${process.env.PAYLOAD_PUBLIC_SITE_ID}-db.mana.wiki/api/graphql?banners`,
      {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            query: BANNERS,
         }),
      }
   ).then((res) => res.json());

   if (errors) {
      console.error(JSON.stringify(errors)); // eslint-disable-line no-console
      throw new Error();
   }

   return json({ banners: data.Banners.docs });
}

export const meta: V2_MetaFunction = () => {
   return [
      {
         title: "Banners - Honkai: Star Rail",
      },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
   ];
};
export default function HomePage() {
   const { banners } = useLoaderData<typeof loader>();

   return (
      <div className="mx-auto max-w-[728px] max-laptop:px-3">
         <BannerList banners={banners} />
      </div>
   );
}

const BannerList = ({ banners }: any) => {
   const [filters, setFilters] = useState([]);
   const [sort, setSort] = useState("character_id");
   const [search, setSearch] = useState("");

   return (
      <>
         <div className="">
            {/* List of Characters with applied sorting */}
            <H2 text="Banners" />
            <div className="text-center">
               {banners?.map((b: any) => {
                  return (
                     <>
                        <div className="relative my-1 rounded-md border p-2 dark:border-gray-700">
                           <div className="relative inline-block w-1/4 px-2 text-center align-middle">
                              {/* Banner Name */}

                              <div className="block text-sm font-bold">
                                 {b?.name}
                              </div>
                              {/* Banner Image */}
                              <div className="h-28 w-auto">
                                 <Image
                                    options="height=120"
                                    alt={b?.name}
                                    className="h-28 object-contain"
                                    url={b?.icon?.url}
                                 />
                              </div>
                              {/* Banner Period */}
                              <div className="text-xs">
                                 {new Date(b?.start_date).toLocaleString()} -{" "}
                                 {b?.end_date
                                    ? new Date(b?.end_date).toLocaleString()
                                    : null}
                              </div>
                           </div>
                           <div className="relative inline-block w-3/4 px-2 align-middle">
                              {b.featured_characters?.map((c: any) => {
                                 return (
                                    <>
                                       <div className="relative my-1 inline-block align-top">
                                          <CharFrame char={c} />
                                       </div>
                                    </>
                                 );
                              })}

                              {b.featured_light_cones?.map((c: any) => {
                                 return (
                                    <>
                                       <div className="relative my-1 inline-block align-top">
                                          <LightConeFrame char={c} />
                                       </div>
                                    </>
                                 );
                              })}
                           </div>
                        </div>
                     </>
                  );
               })}
            </div>
         </div>
      </>
   );
};

// ====================================
// 0a) GENERIC: Item Icon and Quantity Frame
// ------------------------------------
// * PROPS (Arguments) accepted:
// - item: An object from the material_qty structure, with an id, item{}, and qty field.
// ====================================
const CharFrame = ({ char }: any) => {
   // Matqty holds material and quantity information

   return (
      <div className="relative mx-1 inline-block text-center" key={char?.id}>
         <a href={`/starrail/collections/characters/${char?.id}`}>
            <div className="relative inline-block h-20 w-20 align-middle text-xs">
               <Image
                  options="aspect_ratio=1:1&height=100&width=100"
                  url={char?.icon?.url ?? "no_image_42df124128"}
                  className={`object-contain color-rarity-${
                     char?.rarity?.display_number ?? "1"
                  } rounded-t-md`}
                  alt={char?.name}
               />
            </div>
            <div className="relative mt-2 w-20 rounded-b-md border-b border-gray-700 bg-black align-middle text-xs text-white">
               {char?.name}
            </div>
         </a>
      </div>
   );
};

const LightConeFrame = ({ char }: any) => {
   // Matqty holds material and quantity information

   return (
      <div className="relative mx-1 inline-block text-center" key={char?.id}>
         <a href={`/starrail/collections/lightCones/${char?.id}`}>
            <div className="relative inline-block h-20 w-20 align-top text-xs">
               <Image
                  options="aspect_ratio=1:1&height=100&width=100"
                  url={char?.icon?.url ?? "no_image_42df124128"}
                  className={`object-contain color-rarity-${
                     char?.rarity?.display_number ?? "1"
                  } rounded-t-md`}
                  alt={char?.name}
               />
            </div>
            <div className="relative w-20 rounded-b-md border-b border-gray-700 bg-black align-middle text-xs text-white">
               {char?.name}
            </div>
         </a>
      </div>
   );
};
