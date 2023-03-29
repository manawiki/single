import {
   useFetcher,
   useActionData,
   Form,
   useNavigation,
   Link,
} from "@remix-run/react";
import {
   Loader2,
   ImageMinus,
   Upload,
   Copy,
   EyeOff,
   MoreVertical,
   Trash2,
   ChevronUp,
   ExternalLink,
} from "lucide-react";
import type { Post } from "payload/generated-types";
import { useState, useEffect, Fragment, useCallback, useMemo } from "react";
import { useZorm } from "react-zorm";
import { useDebouncedValue, useIsMount } from "~/hooks";
import type { FormResponse } from "~/utils";
import { isProcessing } from "~/utils";
import { isAdding } from "~/utils";
import { postSchema } from "../../postSchema";
import { Image as ImageIcon } from "lucide-react";
import { Menu, Transition } from "@headlessui/react";
import { DotLoader } from "~/components/DotLoader";
import { AdminOrStaffOrOwner } from "~/modules/auth";
import { useTranslation } from "react-i18next";
import { PostDeleteModal } from "./PostDeleteModal";
import { PostUnpublishModal } from "./PostUnpublishModal";
import { PostHeader } from "../../PostHeader";
import ActiveEditors from "./ActiveEditors";
import { Tooltip } from "../forge/components";
import { createEditor, Descendant } from "slate";
import { Slate, Editable, RenderElementProps, withReact } from "slate-react";
import Block from "../forge/blocks/Block";
import Leaf from "../forge/blocks/Leaf";
import * as Tabs from "@radix-ui/react-tabs";

export const handle = {
   // i18n key for this route. This will be used to load the correct translation
   i18n: "post",
};

export const PostHeaderEdit = ({
   post,
   versions,
}: {
   post: Post;
   versions: any;
}) => {
   //Update title logic
   const fetcher = useFetcher();
   const [titleValue, setTitleValue] = useState("");
   const debouncedTitle = useDebouncedValue(titleValue, 500);
   const isMount = useIsMount();

   const isTitleAdding = isAdding(fetcher, "updateTitle");
   const isBannerDeleting = isAdding(fetcher, "deleteBanner");
   const isBannerAdding = isAdding(fetcher, "updateBanner");

   const [isShowBanner, setIsBannerShowing] = useState(false);
   const formResponse = useActionData<FormResponse>();
   const transition = useNavigation();
   const isPublishing = isAdding(transition, "publish");
   const disabled = isProcessing(transition.state);

   const [isDeleteOpen, setDeleteOpen] = useState(false);
   const [isUnpublishOpen, setUnpublishOpen] = useState(false);
   const { t } = useTranslation(handle?.i18n);

   const zo = useZorm("newPost", postSchema, {
      //@ts-ignore
      customIssues: formResponse?.serverIssues,
   });

   const editor = useMemo(() => withReact(createEditor()), []);
   const renderElement = useCallback((props: RenderElementProps) => {
      return <Block {...props} />;
   }, []);

   useEffect(() => {
      if (!isMount) {
         fetcher.submit(
            { title: debouncedTitle, intent: "updateTitle" },
            { method: "patch" }
         );
      }
   }, [debouncedTitle]);

   return (
      <>
         <PostDeleteModal
            isDeleteOpen={isDeleteOpen}
            setDeleteOpen={setDeleteOpen}
         />
         <PostUnpublishModal
            isUnpublishOpen={isUnpublishOpen}
            setUnpublishOpen={setUnpublishOpen}
         />
         <section className="max-w-[728px] mx-auto max-desktop:px-3">
            <AdminOrStaffOrOwner>
               <div className="flex items-center justify-between pb-6">
                  <div className="flex items-center justify-between gap-3 desktop:-ml-11">
                     <Menu as="div" className="relative">
                        <Menu.Button
                           className="bg-emerald-50 border-emerald-200 dark:bg-emerald-900 flex h-8 w-8 items-center justify-center 
                        rounded-xl border transition dark:border-emerald-700
                        duration-300 active:translate-y-0.5"
                        >
                           <MoreVertical
                              className="text-emerald-500"
                              size={20}
                           />
                        </Menu.Button>
                        <Transition
                           as={Fragment}
                           enter="transition ease-out duration-100"
                           enterFrom="transform opacity-0 scale-95"
                           enterTo="transform opacity-100 scale-100"
                           leave="transition ease-in duration-75"
                           leaveFrom="transform opacity-100 scale-100"
                           leaveTo="transform opacity-0 scale-95"
                        >
                           <Menu.Items
                              className="absolute left-0 mt-2.5 w-full min-w-[200px] max-w-md
                                        origin-top-left transform transition-all z-10"
                           >
                              <div className="border-color rounded-lg border bg-2 p-1.5 shadow shadow-1">
                                 <Menu.Item>
                                    <button
                                       className="text-1 flex w-full items-center gap-3 rounded-lg
                                    py-2 px-2.5 font-bold hover:bg-zinc-100 hover:dark:bg-zinc-700/50"
                                    >
                                       <Copy
                                          className="text-blue-400"
                                          size="18"
                                       />
                                       Clone
                                    </button>
                                 </Menu.Item>
                                 <Menu.Item>
                                    <button
                                       className="text-1 flex w-full items-center gap-3 rounded-lg
                                    py-2 px-2.5 font-bold hover:bg-zinc-100 hover:dark:bg-zinc-700/50"
                                       onClick={() => setUnpublishOpen(true)}
                                    >
                                       <EyeOff
                                          className="text-zinc-400"
                                          size="18"
                                       />
                                       Unpublish
                                    </button>
                                 </Menu.Item>
                                 <Menu.Item>
                                    <button
                                       className="text-1 flex w-full items-center gap-3 rounded-lg
                                    py-2 px-2.5 font-bold hover:bg-zinc-100 hover:dark:bg-zinc-700/50"
                                       onClick={() => setDeleteOpen(true)}
                                    >
                                       <Trash2
                                          className="text-red-400"
                                          size="18"
                                       />
                                       Delete
                                    </button>
                                 </Menu.Item>
                              </div>
                           </Menu.Items>
                        </Transition>
                     </Menu>
                     <button
                        onClick={() => setIsBannerShowing((v) => !v)}
                        className="flex bg-5 text-1 dark:hover:border-emerald-800 items-center hover:border-emerald-200 
                        border px-2.5 h-8 border-color rounded-lg gap-2 dark:border-zinc-600"
                     >
                        {isShowBanner ? (
                           <ChevronUp size={16} />
                        ) : (
                           <ImageIcon className="text-emerald-500" size={16} />
                        )}
                        <span className="font-bold text-xs max-laptop:hidden">
                           Banner
                        </span>
                     </button>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                     <ActiveEditors />
                     {post.isPublished && (
                        <Tooltip
                           side="bottom"
                           align="center"
                           content="Published View"
                        >
                           <Link
                              className="w-9 h-9 border border-color dark:border-zinc-600 bg-5 rounded-full flex items-center justify-center"
                              target="_blank"
                              to={`/${post.site}/posts/${post.id}`}
                           >
                              <ExternalLink size={15} className="text-1" />
                           </Link>
                        </Tooltip>
                     )}
                     <Form method="post">
                        {isPublishing ? (
                           <div className="h-9 w-24 rounded-full border-2 border-color flex items-center justify-center bg-2">
                              <DotLoader />
                           </div>
                        ) : (
                           <button
                              disabled={disabled}
                              type="submit"
                              name="intent"
                              value="publish"
                           >
                              <div
                                 className="group shadow-sm shadow-1 inline-flex justify-center h-9 items-center rounded-full bg-emerald-500 
                              w-24 font-bold text-white text-sm transition hover:bg-emerald-600 dark:hover:bg-emerald-400"
                              >
                                 {t("actions.publish")}
                                 <svg
                                    className="mt-0.5 ml-2 -mr-1 stroke-white stroke-2"
                                    fill="none"
                                    width="12"
                                    height="12"
                                    viewBox="0 0 12 12"
                                    aria-hidden="true"
                                 >
                                    <path
                                       className="opacity-0 transition group-hover:opacity-100"
                                       d="M0 5h7"
                                    ></path>
                                    <path
                                       className="transition group-hover:translate-x-[3px]"
                                       d="M1 1l4 4-4 4"
                                    ></path>
                                 </svg>
                              </div>
                           </button>
                        )}
                     </Form>
                  </div>
               </div>
            </AdminOrStaffOrOwner>
            <div className="relative mb-3 flex items-center gap-3">
               <input
                  className="mt-0 w-full rounded-sm border-0 bg-transparent p-0 font-header text-3xl 
                   laptop:text-4xl font-semibold focus:ring-transparent"
                  name={zo.fields.title()}
                  type="text"
                  defaultValue={post.title}
                  onChange={(event) => setTitleValue(event.target.value)}
                  placeholder="Add a title..."
               />
               {isTitleAdding ? (
                  <Loader2 className="absolute right-2 mx-auto h-6 w-6 animate-spin text-emerald-500" />
               ) : null}
            </div>
            <PostHeader post={post} />
         </section>
         <section className="max-w-[800px] mx-auto">
            {post.banner ? (
               <div>
                  <div className="relative mb-8">
                     <div
                        className="bg-1 border-color flex aspect-[1.91/1] desktop:border 
                         laptop:rounded-none laptop:border-x-0 desktop:rounded-md
                         items-center justify-center overflow-hidden tablet:rounded-md
                         shadow-sm"
                     >
                        <img
                           alt="Post Banner"
                           className="h-full w-full object-cover"
                           //@ts-ignore
                           src={`https://mana.wiki/cdn-cgi/image/fit=crop,height=440,gravity=auto/${post?.banner?.url}`}
                        />
                     </div>
                     <button
                        className="absolute right-2.5 top-2.5 flex h-10 w-10 items-center
                   justify-center rounded-md bg-white/60 dark:bg-zinc-800/50"
                        onClick={() =>
                           fetcher.submit(
                              { intent: "deleteBanner" },
                              { method: "delete" }
                           )
                        }
                     >
                        {isBannerDeleting ? (
                           <Loader2 className="mx-auto h-5 w-5 animate-spin text-red-200" />
                        ) : (
                           <ImageMinus
                              className="text-red-500 dark:text-red-300"
                              size={20}
                           />
                        )}
                     </button>
                  </div>
                  <div className="h-0.5 rounded-full mb-6 max-w-[728px] mx-4 tablet:mx-auto bg-zinc-100 dark:bg-zinc-700/50" />
               </div>
            ) : isShowBanner ? (
               <div className="relative mb-8">
                  <fetcher.Form
                     className="mb-8"
                     method="patch"
                     encType="multipart/form-data"
                     replace
                     onChange={(event) => {
                        fetcher.submit(event.currentTarget, {
                           method: "patch",
                        });
                     }}
                  >
                     <label className="cursor-pointer">
                        <div
                           className="bg-2 border-color flex aspect-[1.91/1] desktop:border 
                         laptop:rounded-none laptop:border-x-0 desktop:rounded-md
                         items-center justify-center overflow-hidden tablet:rounded-md
                         shadow-sm border-y tablet:border hover:border-dashed hover:border-4"
                        >
                           <div className="text-1 space-y-2">
                              {isBannerAdding ? (
                                 <Loader2
                                    size={36}
                                    className="mx-auto animate-spin"
                                 />
                              ) : (
                                 <Upload className="mx-auto" size={36} />
                              )}

                              <div className="text-center font-bold">
                                 Click to upload banner
                              </div>
                              <div className="text-center text-sm">
                                 JPEG, PNG, JPG or WEBP (MAX. 5MB)
                              </div>
                           </div>
                        </div>
                        <input
                           // @ts-ignore
                           name={zo.fields.banner()}
                           type="file"
                           className="hidden"
                        />
                     </label>
                     <input type="hidden" name="intent" value="updateBanner" />
                  </fetcher.Form>
                  <div className="h-0.5 rounded-full mb-5 mx-4 max-w-[728px] bg-zinc-100 dark:bg-zinc-700/50" />
               </div>
            ) : null}
         </section>
         {versions?.docs?.length === 0 ? null : (
            <>
               <div className="w-full">
                  <Tabs.Root
                     className="flex items-center"
                     defaultValue={versions?.docs[0].id}
                     orientation="vertical"
                  >
                     {versions?.docs?.map((version) => (
                        <div className="flex-grow" key={version.id}>
                           {version.version?.content && (
                              <>
                                 <Tabs.Content value={version.id}>
                                    <Slate
                                       editor={editor}
                                       value={
                                          version.version
                                             .content as Descendant[]
                                       }
                                    >
                                       <Editable
                                          renderElement={renderElement}
                                          renderLeaf={Leaf}
                                          readOnly={true}
                                       />
                                    </Slate>
                                 </Tabs.Content>
                              </>
                           )}
                        </div>
                     ))}
                     <Tabs.List className="" aria-label="">
                        {versions?.docs?.map((version: any) => (
                           <div key={version.id}>
                              {version.version?.content && (
                                 <>
                                    <Tabs.Trigger
                                       className=""
                                       value={version.id}
                                    >
                                       {version.id}
                                    </Tabs.Trigger>
                                 </>
                              )}
                           </div>
                        ))}
                     </Tabs.List>
                  </Tabs.Root>
               </div>
            </>
         )}
      </>
   );
};
