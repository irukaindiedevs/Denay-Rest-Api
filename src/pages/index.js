import Head from "next/head";
import { FeatureSection } from "@/components/sections/FeatureSection";
import {
  Header,
  HeroSection,
  TestimonialSection,
  FaqSection,
  Footer,
  PricingSection,
} from "../components/sections";

import {
  header,
  faqs,
  testimonials,
  features,
  pricing,
  clients,
  footer,
} from "@/data";

export default function Home() {
  return (
    <>
      <Head>
        <title>DenayRestAPI – REST Made Easy</title>
        <link rel="shortcut icon" href="./dra.ico" />
      </Head>
      <Header
        logo={header.logo}
        links={header.links}
        buttons={header.buttons}
      />
      <HeroSection
        id="home"
        badge={{
          href: "#",
          icon: "tabler:arrow-right",
          label: "What's New",
        }}
        title="Launch Faster. Code Smarter. DenayRestAPI"
        description="Bikin produk cepat tanpa bikin backend dari nol. DenayRestAPI siap jadi fondasi API-mu."
        hastag="#startnowscalelater #oneplatformendlessintegrations"
        buttons={[
          {
            href: "./auth",
            label: "Sign up for free",
            color: "dark",
          },
          {
            href: "./dashboard",
            label: "Documentation",
            color: "transparent",
            variant: "link",
            icon: "tabler:arrow-right",
          },
        ]}
        // clientsLabel="Trusted by 100+ Brands"
        // clients={clients}
      />
      <FeatureSection
        id="features"
        title="Why Choose DenayRestAPI?"
        description="Powerful features that give you speed, scale, and full control — so your tools can do more, faster."
        features={features}
      />
      <PricingSection
        id="pricing"
        title="Pricing for Everyone"
        description="Choose a plan that works for you. All plans include a 7-day free trial."
        badge={{
          leading: true,
          icon: "tabler:file-invoice",
          label: "Plans",
        }}
        pricing={pricing}
      />
      <TestimonialSection
        id="testimonials"
        title="Love from our customers"
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis similique
        veritatis"
        badge={{
          leading: true,
          icon: "tabler:heart",
          label: "TESTIMONIALS",
        }}
        testimonials={testimonials}
        button={{
          icon: "tabler:brand-x",
          label: "Share Your Feedback on",
          href: "#",
          color: "white",
        }}
      />
      <FaqSection
        id="faqs"
        title="Frequently Asked Questions"
        description="Here are some of our most frequently asked questions. If you have a question that isn't answered here, please feel free to contact us."
        buttons={[
          {
            label: "Contact Support",
            href: "#",
            color: "primary",
            variant: "link",
            icon: "tabler:arrow-right",
          },
        ]}
        faqs={faqs}
      />
      <Footer
        id="footer"
        copyright={footer.copyright}
        powered={footer.powered}
        logo={footer.logo}
        social={footer.social}
        links={footer.links}
      />
    </>
  );
}
