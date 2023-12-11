import { SkyWayContext, SkyWayRoom, type P2PRoom, type LocalRoomMember } from "@skyway-sdk/room";

export class SkyWayBag {
  public static async create(user_id: number): Promise<SkyWayBag | null> {
    const response = await fetch(`/api/chat-room/skyway-token`);
    if (!response.ok) {
      return null;
    }
    const token = await response.text();
    const context = await SkyWayContext.Create(token);
    return new SkyWayBag(context, user_id);
  }

  constructor(private readonly context: SkyWayContext, private readonly user_id: number) {
    this.#membership = null;
    this.#metadata_id = -1;
    this.#updateCallback = null;
  }

  #membership: LocalRoomMember | null;
  #metadata_id: number;
  #rooms: Map<number, P2PRoom> = new Map();
  #current_room_id: number = -1;
  #updateCallback: (() => void) | null;

  public async leaveRoom() {
    if (this.#membership == null) {
      return;
    }
    const room = this.#rooms.get(this.#current_room_id);
    this.#current_room_id = -1;
    if (room == null) {
      return;
    }
    if (room.disposed) {
      this.#rooms.delete(this.#current_room_id);
    }
    room.leave(this.#membership);
    room.onMetadataUpdated.removeAllListeners();
    if (room.members.length === 0) {
      await room.dispose();
      this.#rooms.delete(this.#current_room_id);
    }
  }

  public async joinRoom(room_id: number, updateCallback: () => void) {
    this.#current_room_id = room_id;
    let room = this.#rooms.get(room_id);
    if (room == null) {
      room = await SkyWayRoom.FindOrCreate(this.context, {
        type: "p2p",
        name: `chat-${room_id}`,
      });
    }
    this.#updateCallback = updateCallback;
    if (this.#membership === null) {
      this.#membership = await room.join({
        name: `user-${this.user_id}`,
      });
    } else if (room.localRoomMember == null) {
      this.#membership = await room.moveRoom(this.#membership);
    } else {
      room.onMetadataUpdated.removeAllListeners();
    }
    room.onMetadataUpdated.add(this.onMetadataUpdated);
  }

  public send() {
    const room = this.#rooms.get(this.#current_room_id);
    if (room == null) {
      return;
    }
    this.#metadata_id++;
    room.updateMetadata(this.#metadata_id.toString());
  }

  private onMetadataUpdated() {
    if (this.#updateCallback == null) {
      return;
    }
    this.#updateCallback();
  }

  public async dispose() {
    const promises: Promise<void>[] = [];
    for (const [_, room] of this.#rooms) {
      if (room.disposed) {
        continue;
      }
      promises.push(room.dispose());
    }
    await Promise.all(promises);
    this.context.dispose();
  }
}
