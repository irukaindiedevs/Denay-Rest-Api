/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { SocialLinks } from "../SocialLinks";
import { cn } from "@/lib/utils";

export function Footer({ copyright, powered, logo, links, social, ...rest }) {
  return (
    <footer className="bg-base-100 dark:bg-base-900 pt-6" {...rest}>
      <div className="container px-4 mx-auto">
        <div
          className={cn(
            "flex flex-col md:flex-row justify-between items-center gap-4 py-6"
          )}
        >
          <div className="flex flex-row gap-4 text-sm">
            {links.map((link, index) => (
              <Link href={link.href} key={index}>
                {link.label}
              </Link>
            ))}
          </div>
          <SocialLinks links={social} />
        </div>

        <div className="border-t border-base py-4 text-center justify-between">
          <p hrevclassName="text-sm">
            <a href="">{copyright}</a> - <a href="">{powered}</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
