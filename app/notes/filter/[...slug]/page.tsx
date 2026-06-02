import { fetchNotes } from "@/lib/api";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import NotesClient from "../../Notes.client";

type Props = {
  params: Promise<{ slug: string[] }>;
};

const NotesPage = async ({ params }: Props) => {
  const { slug } = await params;
  const filterTag = slug[0] === "all" ? undefined : slug[0];

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", filterTag, 1],
    queryFn: () => fetchNotes("", 1, filterTag),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient filterTag={filterTag} />
    </HydrationBoundary>
  );
};

export default NotesPage;
