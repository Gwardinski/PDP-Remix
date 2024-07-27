import { MetaFunction, json, useLoaderData } from "@remix-run/react";
import {
  IconAi,
  IconClock,
  IconDice,
  IconLuggage,
  IconPaint,
  IconPointerUp,
  IconQuestionMark,
} from "@tabler/icons-react";
import { create } from "zustand";
import { DocumentationLink, GithubLink } from "~/components/DocText";
import { PlaygroundCard } from "~/components/PlaygroundCard";
import { ProjectCard } from "~/components/ProjectCard";
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
  const tab1 = useTabStore((state) => state.tab1);
  const setTab1 = useTabStore((state) => state.setTab1);
  const tab2 = useTabStore((state) => state.tab2);
  const setTab2 = useTabStore((state) => state.setTab2);

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
          <H2>Projects & Playgrounds</H2>
          <H2Description>
            Projects start here as Playgrounds before being broken off into
            their own standalone apps.
          </H2Description>
        </PageSectionHeader>

        <Tabs defaultValue={tab1} onValueChange={setTab1}>
          <TabsList className="glass dark:dark-glass mb-4">
            <TabsTrigger value="1">Projects</TabsTrigger>
            <TabsTrigger value="2">Playgrounds</TabsTrigger>
          </TabsList>
          <TabsContent value="1">
            <div className="glass dark:dark-glass flex w-full grid-cols-1 flex-col items-center justify-center gap-4 overflow-hidden rounded-md p-2 sm:grid sm:grid-cols-2 lg:p-4 xl:grid-cols-4 ">
              <ProjectCard
                title={"QuizFlow"}
                description={"A Pub-Quiz Management App"}
                icon={<IconQuestionMark className="size-32" />}
                link={"https://quizflow-gm.vercel.app"}
                github={"https://github.com/Gwardinski/quizflow"}
              />
              <ProjectCard
                title={"PixelBoard"}
                description={"Online Pixel Art"}
                icon={<IconPaint className="size-32" />}
                link={"https://pixelboard-gm.vercel.app/"}
                github={"https://github.com/Gwardinski/pixelboard"}
              />
              <ProjectCard
                title={"PantiePacker"}
                description={"The Travel App"}
                icon={<IconLuggage className="size-32" />}
                link={"https://pantie-packer.vercel.app"}
                github={"https://github.com/Gwardinski/pantie-packer"}
              />
              <ProjectCard
                title={"Anagram Cruncher"}
                description={"Uses ChatGPT to solve Anagrams"}
                icon={<IconAi className="size-32" />}
                link={"https://anagram-cruncher.vercel.app"}
                github={"https://github.com/Gwardinski/anagram-solver"}
              />
            </div>
          </TabsContent>
          <TabsContent value="2">
            <div className="glass dark:dark-glass flex w-full grid-cols-1 flex-col items-center justify-center gap-4 overflow-hidden rounded-md p-2 sm:grid sm:grid-cols-2 lg:p-4 xl:grid-cols-4 ">
              <PlaygroundCard
                title="Anagram Solver"
                description="Now a Project ✅"
                icon={<IconAi className="size-32" />}
                link={"/anagram"}
              />
              <PlaygroundCard
                title="Metronome (WIP)"
                description="WIP"
                icon={<IconClock className="size-32" />}
                link={"/metronome"}
              />
              <PlaygroundCard
                title="Push The Button (WIP)"
                description="WIP"
                icon={<IconPointerUp className="size-32" />}
                link={"/push-the-button"}
              />
              <PlaygroundCard
                title="KT (WIP)"
                description="WIP"
                icon={<IconDice className="size-32" />}
                link={"/kt"}
              />
            </div>
          </TabsContent>
        </Tabs>
      </PageSection>

      <PageSection>
        <PageSectionHeader>
          <H2>Tutorials</H2>
          <H2Description>Interesting things to look into 👀</H2Description>
        </PageSectionHeader>

        <Tabs defaultValue={tab2} onValueChange={setTab2}>
          <TabsList className="glass dark:dark-glass mb-4">
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

interface TabStore {
  tab1: string;
  setTab1: (v: string) => void;
  tab2: string;
  setTab2: (v: string) => void;
}

const useTabStore = create<TabStore>((set) => ({
  tab1: "1",
  setTab1: (v) => set(() => ({ tab1: v })),
  tab2: "2",
  setTab2: (v) => set(() => ({ tab2: v })),
}));
