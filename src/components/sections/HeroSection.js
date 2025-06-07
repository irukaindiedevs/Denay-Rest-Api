import { useState, useEffect } from "react";
import { Badge, Button } from "#/base";
import { Brands } from "#/Brands";
import { cn } from "@/lib/utils";

function TypingEffect({ text, speed = 150 }) {
  const [displayedText, setDisplayedText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    let index = 0;
    const buffer = [];

    const interval = setInterval(() => {
      if (index >= text.length) {
        clearInterval(interval);
        return;
      }

      buffer.push(text.charAt(index));
      setDisplayedText(buffer.join(""));
      index++;
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  useEffect(() => {
    const blink = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 500);
    return () => clearInterval(blink);
  }, []);

  return (
    <span>
      {displayedText}
      <span className="inline-block w-[1ch]">{cursorVisible ? "|" : " "}</span>
    </span>
  );
}

export function HeroSection({
  badge,
  title,
  description,
  hastag,
  buttons,
  image,
  clientsLabel,
  clients,
  ...rest
}) {
  return (
    <section {...rest}>
      <div className="container px-4 mx-auto">
        <div className="flex flex-col justify-center items-center min-h-screen">
          <div className="flex flex-col justify-center items-center gap-4 text-center max-w-3xl mx-auto mt-32 pb-12">
            <Badge {...badge} />
            <h1 className="text-2xl font-display font-semibold title-gradient">
              <TypingEffect text={title} speed={100} />
            </h1>
            <p className="text-base">{description}</p>
            <p className="text-base font-display font-bold">{hastag}</p>
            {buttons.length > 0 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                {buttons.map((button, index) => (
                  <Button key={index} {...button} />
                ))}
              </div>
            )}
          </div>
          {/* <div className="text-sm">{clientsLabel}</div>
          <Brands clients={clients} /> */}
        </div>
      </div>
    </section>
  );
}
