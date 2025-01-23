import { DMHelperContextProvider } from '@lib/components/contexts/DMHelperContext';
import JoinRoomPage from '@lib/components/dm-helper/JoinRoomPage';

type JoinRoomPageProps = Promise<{
  roomId: string;
}>;

export default async function JoinRoom(props: { params: JoinRoomPageProps }) {
  const { roomId } = await props.params;

  return (
    <DMHelperContextProvider>
      <JoinRoomPage roomId={roomId} />
    </DMHelperContextProvider>
  );
}
