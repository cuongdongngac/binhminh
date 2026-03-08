'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import RichTextEditor from '@/components/editor/RichTextEditor'
import AudioPlayer from '@/components/AudioPlayer'

export default function BiographyClient() {
  const searchParams = useSearchParams()
  const personId = searchParams.get('person_id')

  const supabase = createClient()

  const [personName, setPersonName] = useState('')
  const [biographyHtml, setBiographyHtml] = useState<string | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!personId) return

    const fetchData = async () => {
      setLoading(true)

      // Lấy thông tin person
      const { data: person } = await supabase
        .from('persons')
        .select('full_name')
        .eq('id', personId)
        .single()

      if (person) {
        setPersonName(person.full_name)
      }

      // Lấy biography + audio
      const { data: bio } = await supabase
        .from('person_biography')
        .select('biography_html, audio_url')
        .eq('person_id', personId)
        .maybeSingle()

      if (bio) {
        if (bio.biography_html) {
          setBiographyHtml(bio.biography_html)
          setDraft(bio.biography_html)
        }

        if (bio.audio_url) {
          setAudioUrl(bio.audio_url)
        }
      }

      setLoading(false)
    }

    fetchData()
  }, [personId, supabase])

  const saveBiography = async () => {
    if (!personId) return

    setSaving(true)

    const { error } = await supabase
      .from('person_biography')
      .upsert({
        person_id: personId,
        biography_html: draft
      })

    if (!error) {
      setBiographyHtml(draft)
      setIsEditing(false)
    }

    setSaving(false)
  }

  if (!personId) {
    return (
      <div className="p-10 text-center text-stone-500">
        Không tìm thấy person_id
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">

        <Link
          href={`/dashboard?memberModalId=${personId}`}
          className="flex items-center gap-1.5 px-4 py-2 bg-stone-100 text-stone-700 rounded-full hover:bg-stone-200 font-semibold text-sm border border-stone-200"
        >
          <ArrowLeft className="size-4" />
          <span className="hidden sm:inline">
            Quay lại {personName}
          </span>
        </Link>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-100 text-amber-800 rounded-full hover:bg-amber-200 font-semibold text-sm border border-amber-200"
          >
            <Edit2 className="size-4" />
            <span>Cập nhật tiểu sử</span>
          </button>
        )}

      </div>

      {/* Content */}
      <div className="bg-white rounded-3xl shadow-xl border border-stone-200 p-8">

        {loading ? (

          <div className="flex justify-center py-20">
            <div className="size-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
          </div>

        ) : isEditing ? (

          <>
            <h1 className="text-2xl font-serif font-bold text-stone-800 mb-6">
              {biographyHtml ? "Chỉnh sửa tiểu sử" : "Thêm tiểu sử"} — {personName}
            </h1>

            {/* CKEditor */}
            <div className="mt-4 min-h-[400px]">
              <RichTextEditor
                value={draft}
                onChange={setDraft}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-stone-100 rounded-full hover:bg-stone-200 font-semibold"
              >
                Hủy
              </button>

              <button
                onClick={saveBiography}
                disabled={saving}
                className="px-4 py-2 bg-amber-600 text-white rounded-full hover:bg-amber-700 font-semibold"
              >
                {saving ? 'Đang lưu...' : 'Lưu'}
              </button>

            </div>
          </>

        ) : biographyHtml ? (

          <>
            {/* Audio player nếu có */}
            {audioUrl && (
              <div className="mb-6">
                <AudioPlayer
                  title={`🔊 Nghe tiểu sử ${personName}`}
                  src={audioUrl}
                />
              </div>
            )}

            {/* Biography */}
            <div
              className="ck-content"
              dangerouslySetInnerHTML={{ __html: biographyHtml }}
            />
          </>

        ) : (

          <div className="text-center text-stone-500 py-20">
            Thành viên này chưa có tiểu sử.
          </div>

        )}

      </div>

      {/* CKEditor content styles */}
      <style jsx global>{`
        .ck-content h1 {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 12px;
        }
        .ck-content h2 {
          font-size: 26px;
          font-weight: 600;
          margin-bottom: 10px;
        }
        .ck-content h3 {
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .ck-content p {
          margin-bottom: 12px;
          line-height: 1.6;
        }
        .ck-content ul,
        .ck-content ol {
          margin-left: 20px;
          margin-bottom: 12px;
        }
        .ck-content blockquote {
          border-left: 4px solid #2fa4e7;
          padding-left: 10px;
          color: #666;
          margin: 10px 0;
        }
        .ck-content table {
          border-collapse: collapse;
          width: 100%;
          margin-top: 10px;
        }
        .ck-content table td,
        .ck-content table th {
          border: 1px solid #ddd;
          padding: 8px;
        }
      `}</style>

    </div>
  )
}