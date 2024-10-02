import { Avatar, Button, Group } from '@mantine/core'
import { useUser } from '@renderer/data/user'
import { useRouter } from '@renderer/use-router'

export const UserAvatar = () => {
  const currentUser = useUser()
  const { goToSelectAccount } = useRouter()
  return (
    <Group gap={'xs'}>
      <Avatar size={'sm'} src={currentUser.avatar} name={currentUser.name} color="initials" />
      <Button
        variant="light"
        color="gray"
        size="xs"
        onClick={goToSelectAccount}>
        Switch
      </Button>
    </Group>
  )
}
