import { describe, expect, it } from "vitest";
import { captionFromTweetHtml, lookup, nameFor } from "./lookup.ts";

describe("the inbox name", () => {
  it("drops characters that are not slug characters", () => {
    expect(nameFor("Offensive Guru!", "https://x.com/offensive_guru/status/1")).toBe(
      "offensive-guru-1",
    );
  });
});

describe("the caption of a tweet", () => {
  it("is the text of the blockquote's paragraph, with entities decoded and line breaks kept", () => {
    const html =
      '<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Trips Nub &amp; H Wheel<br>vs Cover 2 <a href="https://t.co/x">pic.twitter.com/x</a></p>&mdash; Guru (@guru) <a href="https://twitter.com/guru/status/1">March 21, 2006</a></blockquote>';
    expect(captionFromTweetHtml(html)).toBe("Trips Nub & H Wheel\nvs Cover 2 pic.twitter.com/x");
  });
});

describe("the lookup", () => {
  it("reads the author and the caption of an Instagram reel from its oEmbed", async () => {
    const fetchJson = async (endpoint: string) => {
      expect(endpoint).toBe(
        "https://www.instagram.com/api/v1/oembed/?url=https%3A%2F%2Fwww.instagram.com%2Freel%2FDecbK2ZAxuD%2F",
      );
      return {
        author_name: "playdesignerpro",
        title: "Buffalo Bills Y-Short Motion to Bunch Trail",
      };
    };
    expect(await lookup("https://www.instagram.com/reel/DecbK2ZAxuD/", fetchJson)).toEqual({
      author: "playdesignerpro",
      caption: "Buffalo Bills Y-Short Motion to Bunch Trail",
      name: "playdesignerpro-decbk2zaxud",
    });
  });

  it("takes the handle, not the display name, from X's oEmbed", async () => {
    const fetchJson = async () => ({
      author_name: "Offensive Guru",
      author_url: "https://twitter.com/offensive_guru",
      html: "<blockquote><p>Counter Solid Bluff</p>&mdash; Offensive Guru</blockquote>",
    });
    expect(await lookup("https://x.com/offensive_guru/status/42", fetchJson)).toEqual({
      author: "offensive_guru",
      caption: "Counter Solid Bluff",
      name: "offensive-guru-42",
    });
  });

  it("is null for a host the site has no embed for", async () => {
    expect(await lookup("https://www.youtube.com/watch?v=abc")).toBeNull();
  });

  it("is null when the endpoint does not answer", async () => {
    expect(await lookup("https://www.instagram.com/reel/gone/", async () => null)).toBeNull();
  });
});
