import customConfig from "~/_custom/config.json";
import type { Site } from "~/db/payload-types";

export const siteHomeShouldReload = ({
   currentSite,
   site,
}: {
   currentSite?: any;
   site?: Site;
}) => {
   // Don't use csr if any are true
   // This will only return true if user is on a core site
   // and navigates to another core site
   if (
      currentSite?.type == "custom" ||
      site?.type == "custom" ||
      site?.domain ||
      customConfig?.domain != ""
   )
      return true;
};

export const siteHomePath = ({
   currentSite,
   site,
   isMobileApp,
}: {
   currentSite: Site | undefined;
   site: Site;
   isMobileApp?: Boolean;
}) => {
   //Only rewrite url on web production, mobile will share cookie under a singular domain
   if (!isMobileApp && process.env.NODE_ENV == "production") {
      if (currentSite?.domain) {
         if (site?.domain) {
            return "/";
         }
         return `https://mana.wiki/${site.slug}`;
      }
      //If nav site != active site, show external link
      if (site?.domain != currentSite?.domain) {
         return `https://${site.domain}`;
      }
   }
   return `/${site.slug}`;
};

export const siteHomeRoot = ({ site }: { site: Site }) => {
   return `${
      site?.domain && process.env.NODE_ENV == "production"
         ? `/`
         : `/${site.slug}`
   }`;
};
