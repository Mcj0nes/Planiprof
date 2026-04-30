import { redirect } from 'next/navigation'

export default async function ConversationGridDetailPage({
  params,
}: {
  params: Promise<{ gridId: string }>
}) {
  const { gridId } = await params
  redirect(`/dashboard/evaluation/conversations/${gridId}/session`)
}
