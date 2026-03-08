import Link from "next/link";
import Introduction from "@/components/Introduction";
import AudioPlayer from "@/components/AudioPlayer";
import MiniVideoPlayer from "@/components/MiniVideoPlayer";
export default function Page() {
  return (
    <div>
      <Link href="/dashboard">← Quay lại Dashboard</Link>
      <AudioPlayer
        title="Giới thiệu Họ Phạm Đông Ngạc"
        src="https://mediaserver.huph.edu.vn/vod/nas1videos/phahe/hopham.mp3"
      />
    
      <Introduction />
    </div>
  );
}