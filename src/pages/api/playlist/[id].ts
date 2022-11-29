import { Playlist } from "./../../../models/Playlist.model";
import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "~/libraries/mongoose.library";
import { DEFAULT_CARD_COLOR } from "~/config/common.config";



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const { id } = req.query;
  await dbConnect();

  if(req.method==="GET"){
    const result = await getPlaylist(id as string);
    res.status(200).send({data : result});
  } else if(req.method==="DELETE"){
    const playlist = await deletePlaylist(id as string);
    res.status(200).send({data: playlist})
  }
  
}

async function getPlaylist(id: string) {
  const result = await Playlist.findById(id);
  if (!result) return null;
  const playlist = result.toObject();
  return {
    name: playlist.name,
    owner: playlist.owner,
    slug: playlist.slug,
    spotifyId: playlist.spotifyId,
    upvote: playlist.upvote,
    color: playlist.color || DEFAULT_CARD_COLOR,
    id: playlist._id.toString(),
  };
}

async function deletePlaylist(id: string) {
  await Playlist.findByIdAndDelete(id);
  return getPlaylist(id)
}

export type Response = any;
