import { Avatar, Button, Center, Popover, PopoverDropdown, PopoverTarget, Stack, Text } from '@mantine/core'
import { NewItemForm } from '@renderer/components/NewItemForm'
import { useUsers } from '@renderer/data/user'

export function SelectAccountScreen() {
  const {
    users,
    addUser,
    switchToUser
  } = useUsers()

  return (
    <Center flex={1}>
      <Stack>
        {users.map(user => (
          <Button
            styles={{
              inner: {
                justifyContent: 'flex-start'
              }
            }}
            size="lg"
            variant="subtle"
            key={user.id}
            onClick={() => switchToUser(user)}
            leftSection={<Avatar src={user.avatar} name={user.name} color="initials" />}>
            <Text>{user.name}</Text>
          </Button>
        ))}
        <Popover trapFocus width={'target'} position="bottom" shadow="lg">
          <PopoverTarget>
            <Button variant="light" color="gray" c={'dark.2'}>
              + Add User
            </Button>
          </PopoverTarget>
          <PopoverDropdown p={'sm'}>
            <NewItemForm
              placeholder="Name"
              initialValue="New User"
              onSubmit={addUser} />
          </PopoverDropdown>
        </Popover>
      </Stack>
    </Center>
  )
}
