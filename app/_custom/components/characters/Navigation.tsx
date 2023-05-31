export const Navigation = ({ links }: any) => {
   return (
      <>
         <div className="mb-3 grid grid-cols-2 items-center justify-between gap-2 laptop:grid-cols-6">
            {links?.map((l: any) => (
               <a
                  key={l.name}
                  href={`#${l.link}`}
                  className="border-color bg-2 text-1 overflow-hidden rounded-full
                  border bg-yellow-50 p-2 text-center text-sm
                  font-bold transition dark:bg-yellow-900/20"
               >
                  {l.name}
               </a>
            ))}
         </div>
      </>
   );
};
