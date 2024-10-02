import {
  ActionIcon,
  Button,
  Card,
  CopyButton,
  Group,
  Popover,
  PopoverDropdown,
  PopoverTarget,
  rem,
  ScrollArea,
  Stack,
  Text,
  Title,
  Tooltip
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { NewItemForm } from '@renderer/components/NewItemForm'
import { UserAvatar } from '@renderer/components/UserAvatar'
import type { ListId } from '@renderer/data/_types'
import { useAddTodoList, useJoinToList } from '@renderer/data/todos'
import { useAllLists, useUser } from '@renderer/data/user'
import { useRouter } from '@renderer/use-router'
import { IconCheck, IconCopy } from '@tabler/icons-react'
import { find } from 'remeda'
import styles from './MainScreen.module.css'

export function MainScreen() {
  const { lists } = useUser()

  return (
    <Stack gap={'md'} flex={1}>
      <Group justify="space-between">
        <Title order={2} fw={500}>My Lists</Title>
        <UserAvatar />
      </Group>

      <ScrollArea.Autosize>
        <Stack gap={'md'}>
          {lists.map((l) => <TodoListCard key={l} listId={l} />)}
        </Stack>
      </ScrollArea.Autosize>
      <Group mt={'md'} gap={'xs'}>
        <AddTodoList />
        <JoinToTodoList/>
      </Group>
    </Stack>
  )
}

const TodoListCard = ({ listId }: { listId: ListId }) => {
  const { gotToList } = useRouter()
  const list = find(useAllLists(), l => l.id === listId)
  return (
    <Card
      className={styles.listCard}
      shadow="md"
      onClick={() => gotToList(listId)}
    >
      <Title order={3} fw="500">{list?.name ?? 'Untitled'}</Title>
      <Group>
        <Text size="sm" c="dimmed">{listId}</Text>
        <CopyButton value={listId} timeout={2000}>
          {({ copied, copy }) => (
            <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
              <ActionIcon
                color={copied ? 'teal' : 'gray'}
                variant="subtle"
                onClick={e => {
                  e.stopPropagation()
                  copy()
                }}>
                {copied ? <IconCheck style={{ width: rem(16) }} /> : <IconCopy style={{ width: rem(16) }} />}
              </ActionIcon>
            </Tooltip>
          )}
        </CopyButton>
      </Group>
    </Card>
  )
}

function AddTodoList() {
  const addList = useAddTodoList()
  const [isOpened, { toggle, close }] = useDisclosure()

  return (
    <Popover opened={isOpened} trapFocus width={'target'} position="bottom" shadow="lg" keepMounted={false}>
      <PopoverTarget>
        <Button variant="light" onClick={toggle}>
          + Create new list
        </Button>
      </PopoverTarget>
      <PopoverDropdown p={'sm'} miw={200}>
        <NewItemForm
          initialValue={`New List`}
          onSubmit={title => {
            close()
            addList(title)
          }}
        />
      </PopoverDropdown>
    </Popover>
  )
}

function JoinToTodoList() {
  const joinTo = useJoinToList()

  return (
    <Popover trapFocus width={'target'} position="bottom" shadow="lg" keepMounted={false}>
      <PopoverTarget>
        <Button variant="subtle" color='gray'>
          Join to existing
        </Button>
      </PopoverTarget>
      <PopoverDropdown p={'sm'} miw={200}>
        <NewItemForm
          placeholder="List id"
          onSubmit={listId => {
            joinTo(listId as ListId)
          }}
        />
      </PopoverDropdown>
    </Popover>
  )
}
