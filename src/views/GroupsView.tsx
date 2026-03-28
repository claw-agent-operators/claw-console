import { GroupList } from '@/components/groups/GroupList'

export function GroupsView() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Groups</h2>
      <GroupList />
    </div>
  )
}
