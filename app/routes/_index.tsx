import { MetaFunction, json, useLoaderData } from "@remix-run/react";
import { DocumentationLink, GithubLink } from "~/components/DocText";
import { YoutubeVideo, YoutubeVideoGrid } from "~/components/Youtube";
import {
  Page,
  PageHeader,
  PageHeaderAccordion,
  PageHeading,
  PageSection,
  PageSectionHeader,
} from "~/components/layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  H1,
  H1Description,
  H2,
  H2Description,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui";

export const meta: MetaFunction = () => {
  return [
    { title: "PDP Playground" },
    {
      name: "PDP Playground",
      content: "Personal Development Project Playground",
    },
  ];
};

const YOUTUBE_PLAYLIST_ITEMS_API =
  "https://www.googleapis.com/youtube/v3/playlistItems";

async function getYoutubePlaylist(
  id: string,
  key: string,
): Promise<{
  videos: YoutubeVideo[];
}> {
  try {
    const res = await fetch(
      `${YOUTUBE_PLAYLIST_ITEMS_API}?part=snippet&maxResults=50&playlistId=${id}&key=${key}`,
    );
    const data = await res.json();
    const videos: YoutubeVideo[] =
      data?.items.map((item: YoutubeVideo) => {
        return item;
      }) ?? [];
    return { videos };
  } catch {
    console.log("Failed to fetch youtube playlist: ", id);
    return { videos: [] };
  }
}

export const loader = async () => {
  const KEY = process.env.YOUTUBE_API_KEY;
  const PLAYLIST_ID_1 = process.env.YOUTUBE_PLAYLIST_ID_1;
  const PLAYLIST_ID_2 = process.env.YOUTUBE_PLAYLIST_ID_2;

  const { videos: playlist1 } = await getYoutubePlaylist(
    PLAYLIST_ID_1 ?? "",
    KEY ?? "",
  );
  const { videos: playlist2 } = await getYoutubePlaylist(
    PLAYLIST_ID_2 ?? "",
    KEY ?? "",
  );

  return json({ playlists: [playlist1, playlist2] });
};

export default function HomePage() {
  const { playlists } = useLoaderData<typeof loader>();

  return (
    <Page>
      <PageHeader>
        <PageHeading>
          <H1>PDP Playground</H1>
          <H1Description>
            Gordon Macintyre - Personal Development Project
          </H1Description>
        </PageHeading>

        <PageHeaderAccordion>
          <Accordion type="single" collapsible defaultValue="description">
            <AccordionItem value="description">
              <AccordionTrigger>
                a scratchpad for trying out new technologies, techniques, &
                tutorials
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2 pb-6">
                <GithubLink
                  href="https://github.com/Gwardinski/PDP-Remix"
                  text="Source Code"
                />
                <h2 className="text-lg">Base TechStack</h2>
                <DocumentationLink
                  href="https://remix.run/"
                  text="Framework - Remix"
                />
                <DocumentationLink
                  href="https://vercel.com/"
                  text="Deployment - Vercel"
                />
                <DocumentationLink
                  href="https://tailwindcss.com"
                  text="CSS - Tailwind"
                />
                <DocumentationLink
                  href="https://ui.shadcn.com/"
                  text="UI - shadcn/ui"
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </PageHeaderAccordion>
      </PageHeader>

      <PageSection>
        <PageSectionHeader>
          <H2>Tutorials</H2>
          <H2Description>Interesting things to look into 👀</H2Description>
        </PageSectionHeader>

        <Tabs defaultValue="1">
          <TabsList className="glass dark:dark-glass">
            <TabsTrigger value="1">Stuff to Code</TabsTrigger>
            <TabsTrigger value="2">Stuff to Watch</TabsTrigger>
          </TabsList>
          <TabsContent value="1">
            <YoutubeVideoGrid videos={playlists[0]} />
          </TabsContent>
          <TabsContent value="2">
            <YoutubeVideoGrid videos={playlists[1]} />
          </TabsContent>
        </Tabs>
      </PageSection>
    </Page>
  );
}
