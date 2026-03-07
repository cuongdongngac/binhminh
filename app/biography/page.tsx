"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function BiographyPage() {
  const searchParams = useSearchParams();
  const personId = searchParams.get("person_id");

  const [biography, setBiography] = useState<string>("");
  const [personName, setPersonName] = useState<string>("");

  const supabase = createClient();

  useEffect(() => {
    if (!personId) return;

    async function loadData() {
      console.log("Loading biography for:", personId);

      // Lấy tiểu sử
      const { data: bioData, error: bioError } = await supabase
        .from("person_biography")
        .select("biography_html")
        .eq("person_id", personId);

       
      if (bioData && bioData.length > 0) {
        setBiography(bioData[0].biography_html || "rêrererere");
      }
      


      // Lấy tên người
      const { data: personData, error: personError } = await supabase
        .from("persons")
        .select("full_name")
        .eq("id", personId);

      console.log("personData:", personData, personError);

      if (personData && personData.length > 0) {
        setPersonName(personData[0].full_name || "");
      }
    }

    loadData();
  }, [personId]);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "30px" }}>
      
      {/* Nút quay lại */}
      <div style={{ marginBottom: "20px" }}>
        <Link href={`/dashboard?memberModalId=${personId}`}>
          ← Quay lại: {personName || "Trang trước"}
        </Link>
      </div>

      <h1>Tiểu sử</h1>

      {/* Nội dung tiểu sử */}
      {biography ? (
        <div dangerouslySetInnerHTML={{ __html: biography }} />
      ) : (
        <p>Chưa có tiểu sử cho cá nhân này.</p>
      )}
    </div>
  );
}