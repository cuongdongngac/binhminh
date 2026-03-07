'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Edit2, Plus } from "lucide-react";

export default function BiographyClient() {

  const searchParams = useSearchParams();
  const personId = searchParams.get("person_id");

  const [biography, setBiography] = useState<string | null>(null);
  const [personName, setPersonName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    if (!personId) return;

    async function loadData() {

      const { data: bioData } = await supabase
        .from("person_biography")
        .select("biography_html")
        .eq("person_id", personId);

      if (bioData?.length) {
        setBiography(bioData[0].biography_html);
      }

      const { data: personData } = await supabase
        .from("persons")
        .select("full_name")
        .eq("id", personId);

      if (personData?.length) {
        setPersonName(personData[0].full_name);
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profile?.role === "admin") {
          setIsAdmin(true);
        }
      }
    }

    loadData();

  }, [personId, supabase]);

  return (
    <div className="max-w-3xl mx-auto p-8">

      <div className="flex items-center justify-between mb-6">

        <Link
          href={`/dashboard?memberModalId=${personId}`}
          className="text-amber-700 hover:underline font-medium"
        >
          ← Quay lại: {personName || "Trang trước"}
        </Link>

        {isAdmin && (
          <div className="flex items-center gap-2">

            {biography ? (
              <button className="flex items-center gap-1.5 px-4 py-2 bg-amber-100/80 text-amber-800 rounded-full hover:bg-amber-200 font-semibold text-sm shadow-sm border border-amber-200/50 transition-colors">
                <Edit2 className="size-4" />
                Chỉnh sửa
              </button>
            ) : (
              <button className="flex items-center gap-1.5 px-4 py-2 bg-amber-100/80 text-amber-800 rounded-full hover:bg-amber-200 font-semibold text-sm shadow-sm border border-amber-200/50 transition-colors">
                <Plus className="size-4" />
                Thêm tiểu sử
              </button>
            )}

          </div>
        )}

      </div>

      <h1 className="text-3xl font-serif font-bold mb-6">
        Tiểu sử
      </h1>

      {biography ? (
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: biography }}
        />
      ) : (
        <p className="text-stone-500">
          Chưa có tiểu sử cho cá nhân này.
        </p>
      )}
    </div>
  );
}